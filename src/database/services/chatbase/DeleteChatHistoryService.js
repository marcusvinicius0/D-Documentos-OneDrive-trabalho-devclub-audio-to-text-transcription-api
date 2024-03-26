import prismaClient from "../../../prisma/connect.js";
import { AppError } from "../../../errors/app.error.js";

class DeleteChatHistoryService {
  async execute({ slug }) {
    const isChatSession = await prismaClient.chatSession.findFirst({
      where: {
        slug: slug,
      },
      select: {
        id: true,
        userId: true,
      }
    });

    const getChatbot = await prismaClient.chatbot.findFirst({
      where: {
        authorEmail: isChatSession.userId,
      },
      select: {
        id: true
      }
    })

    const isChatHistory = await prismaClient.chatbotMessages.findFirst({
      where: {
        chatSessionId: isChatSession.id,
      },
    });

    if (!isChatHistory) {
      throw new AppError("Nenhum histórico de conversa foi encontrado.", 404);
    }

    await prismaClient.chatbotMessages.deleteMany({
      where: {
        chatSessionId: isChatSession.id,
      },
    });

    return getChatbot;
  }
}

export { DeleteChatHistoryService };
