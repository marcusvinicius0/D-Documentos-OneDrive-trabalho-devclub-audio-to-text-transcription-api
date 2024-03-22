import { AppError } from "../../../errors/app.error.js";
import prismaClient from "../../../prisma/connect.js";

class SaveTextsForTrainingService {
  async execute({ textData, chatbotId }) {
    const isChatbot = await prismaClient.chatbot.findFirst({
      where: {
        id: chatbotId,
      }
    })

    if (!isChatbot) {
      throw new AppError("Você não tem permissão para rodar esse serviço.", 401);
    }

    let text_length = textData.text.length;

    const saveTexts = await prismaClient.textsForBotTraining.create({
      data: {
        author: textData.authorEmail,
        text: textData.text,
        chatbotId: isChatbot.id,
        isTextTrained: true,
        textLength: text_length,
        slug: isChatbot.slug,
      }
    })

    return saveTexts;
  }
}

export { SaveTextsForTrainingService };