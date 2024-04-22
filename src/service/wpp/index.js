import wppconnect from "@wppconnect-team/wppconnect";

const messageBufferPerChatId = new Map();
const messageTimeouts = new Map();

import { io } from "../../server.js";
import { startChatWithAssistant } from "../runAssistant.js";
import prismaClient from "../../prisma/connect.js";

import fs from "node:fs";
import path from "node:path";

let directoryPath = "./tokens";

export async function startNewWppConnectSession(chatbotId, onQRCodeCallback) {
  wppconnect
    .create({
      session: chatbotId,
      catchQR: (base64Qrimg, asciiQR, attempts, urlCode) => {
        io.emit("qrcodeReading", "QRCode for reading.");
        onQRCodeCallback({ base64Qrimg, asciiQR, attempts, urlCode });
      },
      statusFind: async (statusSession, session) => {
        const wppSessionStatus = [
          "qrReadSuccess",
          "inChat",
          "desconnectedMobile",
        ];

        const desconnectedWppSessionStatus = [
          "notLogged",
          "browserClose",
          "autoClose",
        ];

        if (wppSessionStatus.includes(statusSession)) {
          const findAndUpdate = async () => {
            const find = await prismaClient.chatbot.findFirst({
              where: {
                id: session,
              },
              select: {
                id: true,
              },
            });

            const update = await prismaClient.chatbot.update({
              where: {
                id: find.id,
              },
              data: {
                wppSessionStatus: statusSession,
              },
              select: {
                id: true,
                wppSessionStatus: true,
              },
            });

            return update.wppSessionStatus;
          };
          findAndUpdate();
        };

        // if (desconnectedWppSessionStatus.includes(statusSession)) {
        //   await clearTokenDirectory(directoryPath);
        // }
      },
      headless: true,
      puppeteerOptions: {
        args: ["--no-sandbox", "--headless", "--disable-gpu"],
      },
    })
    .then((client) => {
      io.emit("wppsession", "Connected to wpp.");
      start(client, chatbotId);
    })
    .catch((error) => {
      console.error(error);
    });
}

async function start(client, chatbotId) {
  client.onMessage((message) => {
    (async () => {
      if (
        message.type === "chat" &&
        !message.isGroupMsg &&
        message.chatId !== "status@broadcast"
      ) {
        const chatId = message.chatId;
        console.log("Mensagem recebida:", message.body);

        if (!messageBufferPerChatId.has(chatId)) {
          messageBufferPerChatId.set(chatId, []);
        }
        messageBufferPerChatId.set(chatId, [
          ...messageBufferPerChatId.get(chatId),
          message.body,
        ]);

        if (messageTimeouts.has(chatId)) {
          clearTimeout(messageTimeouts.get(chatId));
        }
        console.log("Aguardando novas mensagens...");
        messageTimeouts.set(
          chatId,
            (async () => {
              console.log(
                "Gerando resposta para: ",
                [...messageBufferPerChatId.get(chatId)].join(" \n ")
              );
              const currentMessage = [
                ...messageBufferPerChatId.get(chatId),
              ].join(" \n ");

              const answer = await startChatWithAssistant({
                currentMessage,
                chatbotId,
              });

              console.log("Enviando mensagens...");
              client
                .sendText(message.from, answer)
                .then((result) => {
                  console.log("Mensagem enviada:", result.body);
                })
                .catch((error) => {
                  console.error("Erro ao enviar mensagem:", error);
                });
              messageBufferPerChatId.delete(chatId);
              messageTimeouts.delete(chatId);
            })()
        );
      }
    })();
  });
}

async function clearTokenDirectory(directoryPath) {
  try {
    const files = await fs.promises.readdir(directoryPath);

    for (const file of files) {
      const filePath = path.join(directoryPath, file);
      const stats = await fs.promises.stat(filePath);

      if (stats.isFile()) {
        try {
          await fs.promises.unlink(filePath);
          console.log(`File ${filePath} deleted successfully.`);
        } catch (unlinkError) {
          console.error(`Error deleting file ${filePath}:`, unlinkError);
        }
      } else {
        try {
          await clearTokenDirectory(filePath);
          await fs.promises.rmdir(filePath);
          console.log(`Directory ${filePath} deleted successfully.`);
        } catch (rmdirError) {
          console.error(`Error deleting directory ${filePath}:`, rmdirError);
        }
      }
    }
    await fs.promises.rmdir(directoryPath);
    console.log(`Directory ${directoryPath} content cleared successfully.`);
  } catch (readdirError) {
    console.error(`Error reading directory ${directoryPath}:`, readdirError);
  }
}
