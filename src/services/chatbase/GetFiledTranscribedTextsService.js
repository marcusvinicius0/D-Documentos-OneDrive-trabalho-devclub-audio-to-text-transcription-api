import { AppError } from "../../errors/app.error.js";
import prismaClient from "../../prisma/connect.js";

class GetFiledTranscribedTextsService {
  async execute({ userSession }) {
    const getFiledTranscribedTexts =
      await prismaClient.transcribedMessagesTable.findMany({
        where: {
          author: userSession,
          isFiled: true,
        },
      });

    if (!getFiledTranscribedTexts) {
      throw new AppError(
        "Não foi possível encontrar nenhum texto transcrito arquivado.",
        500
      );
    }

    return getFiledTranscribedTexts;
  }
}

export { GetFiledTranscribedTextsService };
