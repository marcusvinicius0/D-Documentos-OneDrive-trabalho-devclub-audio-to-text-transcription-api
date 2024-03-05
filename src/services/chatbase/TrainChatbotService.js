import prismaClient from "../../prisma/connect.js";
import { AppError } from "../../errors/app.error.js";

import fs from "node:fs";
import { getOrCreateChatSession } from "../../service/google.js";

class TrainChatbotService {
  async execute({ userSession }) {
    const isTextsForTraining =
      await prismaClient.transcribedMessagesTable.findMany({
        where: {
          author: userSession,
          isFiled: false,
        },
        select: {
          message: true,
        },
      });

    if (!isTextsForTraining) {
      throw new AppError("Nenhum texto para treinamento foi encontrado.", 404);
    }

    const textsForTraining = isTextsForTraining.map((text) => text.message).join("\n");
    fs.writeFileSync("./src/utils/chatbot-content.js", JSON.stringify(textsForTraining, null, 2), { encoding: "utf-8" });

    const chatId = userSession;
    getOrCreateChatSession(chatId);

    await prismaClient.transcribedMessagesTable.updateMany({
      where: {
        author: userSession,
        isFiled: false,
      },
      data: {
        isFiled: true,
      },
    });
    const status = "Treinamento do bot realizado com sucesso! 🎉";

    return status;
  }
}

export { TrainChatbotService };
