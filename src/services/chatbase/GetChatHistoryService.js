import { AppError } from "../../errors/app.error.js";
import prismaClient from "../../prisma/connect.js";

class GetChatHistoryService {
  async execute({ userSession }) {
    const findUserChatSession = await prismaClient.chatSession.findFirst({
      where: {
        userId: userSession,
      }
    })

    if (!findUserChatSession) {
      throw new AppError("Não foi possível encontrar uma sessão de chat ativa para esse usuário.", 404);
    }

    const session_id = findUserChatSession.id;

    const getChatHistory = await prismaClient.chatbotMessages.findMany({
      where: {
        chatSessionId: session_id
      },
      select: {
        id: true,
        chatSessionId: true,
        sender: true,
        bot: true,
        isFiled: true,
        createdAt: true,
        updatedAt: true,
      }
    })

    return getChatHistory;

  }
}

export { GetChatHistoryService };