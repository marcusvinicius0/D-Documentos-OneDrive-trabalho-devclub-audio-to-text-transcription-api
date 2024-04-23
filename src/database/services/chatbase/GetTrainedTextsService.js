import { AppError } from "../../../errors/app.error.js";
import prismaClient from "../../../prisma/connect.js";

class GetTrainedTextsService {
  async execute({ chatbotId }) {
    const isTrainedTexts = await prismaClient.textsForBotTraining.findMany({
      where: {
        AND: [
          {
            chatbotId: chatbotId,
          },
          {
            isTextTrained: true,
          },
        ],
      },
    });

    if (!isTrainedTexts) {
      throw new AppError("Nenhum texto treinado foi encontrado.", 404)
    }

    return isTrainedTexts || [];
  }
}

export { GetTrainedTextsService };
