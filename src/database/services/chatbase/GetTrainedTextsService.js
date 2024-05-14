import { AppError } from "../../../errors/app.error.js";
import prismaClient from "../../../prisma/connect.js";

class GetTrainedTextsService {
  async execute({ chatbotId }) {
    const isTrainedTexts = await prismaClient.textsForBotTraining.findMany({
      orderBy: {
        createdAt: 'desc',
      },
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
      select: {
        id: true,
        text: true,
        author: true,
        isTextTrained: true,
        textLength: true,
        chatbotId: true,
        slug: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    if (!isTrainedTexts) {
      throw new AppError("Nenhum texto treinado foi encontrado.", 404)
    }

    const getUserChatbot = await prismaClient.chatbot.findFirst({
      where: {
        id: chatbotId,
      },
      select: {
        id: true,
        instructions: true,
        temperature: true,
      }
    });

    const trainedTexts = isTrainedTexts.map((text) => {
      const result = [{
        id: text.id,
        text: text.text,
        author: text.author,
        isTextTrained: text.isTextTrained,
        textLength: text.textLength,
        chatbotId: text.chatbotId,
        slug: text.slug,
        chatbotInstructions: getUserChatbot.instructions,
        chatbotTemperature: getUserChatbot.temperature,
        createdAt: text.createdAt,
        updatedAt: text.updatedAt,
      }]

      return result;
    })

    return trainedTexts || [];
  }
}

export { GetTrainedTextsService };
