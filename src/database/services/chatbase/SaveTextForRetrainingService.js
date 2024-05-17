import prismaClient from "../../../prisma/connect.js";

class SaveTextsForRetrainingService {
  async execute({ textData, chatbotId }) {
    const isChatbot = await prismaClient.chatbot.findFirst({
      where: {
        id: chatbotId,
      },
      select: {
        id: true,
        slug: true,
        authorEmail: true,
      }
    })

    if (!isChatbot) {
      throw new AppError("Você não tem permissão para rodar esse serviço.", 401);
    }
    
    let textLength = textData?.length;

    const saveText = await prismaClient.textsForBotTraining.create({
      data: {
        author: isChatbot.authorEmail,
        text: textData,
        chatbotId: isChatbot.id,
        isTextTrained: true,
        textLength: textLength,
        slug: isChatbot.slug,
      }
    })

    return saveText;
  }
}

export { SaveTextsForRetrainingService };