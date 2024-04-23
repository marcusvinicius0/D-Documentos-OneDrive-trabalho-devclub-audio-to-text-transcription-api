import { AppError } from "../../../errors/app.error.js";
import prismaClient from "../../../prisma/connect.js";

class GetUniqueChatbotService {
  async execute({ chatbotId }) {
    const isChatbot = await prismaClient.chatbot.findFirst({
      where: {
        id: chatbotId,
      },
      select: {
        id: true,
        name: true,
        model: true,
        imageUrl: true,
        status: true,
        authorEmail: true,
        authorName: true,
        visibility: true,
        assistantId: true,
        threadId: true,
        wppSessionStatus: true,
        lastTrainedAt: true,
        creditMessagesPerMonth: true,
        subscriptionPlans: true,
        createdAt: true,
        updatedAt: true,
        Files: true,
        Texts: true,
      }
    })

    if (!isChatbot) {
      throw new AppError("Não foi possível encontrar esse chatbot.", 404);
    }

    return isChatbot;

  }
}

export { GetUniqueChatbotService };
