import { AppError } from "../../errors/app.error.js";
import prismaClient from "../../prisma/connect.js";

class GetTranscribedTextsService {
  async execute({ userSession }) {
    const transcribedTexts =
      await prismaClient.transcribedMessagesTable.findMany({
        where: {
          author: userSession,
        },
      });

    if (!transcribedTexts) {
      throw new AppError("Nenhum texto salvo encontrado.", 404);
    }

    return transcribedTexts || [];
  }
}

export { GetTranscribedTextsService };
