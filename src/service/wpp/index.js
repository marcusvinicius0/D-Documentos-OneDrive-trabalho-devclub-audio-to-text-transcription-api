import wppconnect from "@wppconnect-team/wppconnect";

const messageBufferPerChatId = new Map();
const messageTimeouts = new Map();

import { io } from "../../server.js";
import { startChatWithAssistant } from "../runAssistant.js";

export async function startNewWppConnectSession(chatbotId, onQRCodeCallback) {
  wppconnect
    .create({
      session: chatbotId,
      catchQR: (base64Qrimg, asciiQR, attempts, urlCode) => {
        onQRCodeCallback({ base64Qrimg, asciiQR, attempts, urlCode });
      },
      statusFind: (statusSession, session) => {
        console.log("Status session: ", statusSession);
        console.log("Session name: ", session);
      },
      headless: true,
      puppeteerOptions: {
        args: ["--no-sandbox", "--headless", "--disable-gpu"],
      },
    })
    .then((client) => {
      start(client, chatbotId);
      io.emit("wppsession", "Connected to wpp.");
    })
    .catch((error) => {
      console.error(error);
      io.emit("Erro ao conectar com whatsapp. ", error);
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
          setTimeout(() => {
            (async () => {
              console.log("Gerando resposta para: ", [...messageBufferPerChatId.get(chatId)].join(" \n "));
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
            })();
          }, 10000)
        );
      }
    })();
  });
}
