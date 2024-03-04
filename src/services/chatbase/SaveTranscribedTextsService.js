import { AppError } from "../../errors/app.error.js";
import prismaClient from "../../prisma/connect.js";

class SaveTranscribedTextsService {
  async execute({ messageTranscribed }) {
    if (!messageTranscribed.message) {
      throw new AppError(
        "Nenhum texto inserido. Por favor, envie um texto.",
        400
      );
    }

    const saveMessage = await prismaClient.transcribedMessagesTable.create({
      data: {
        message: messageTranscribed.message,
        author: messageTranscribed.author,
        isFiled: messageTranscribed.isFiled,
      },
    });

    return saveMessage;
  }
}

export { SaveTranscribedTextsService };
