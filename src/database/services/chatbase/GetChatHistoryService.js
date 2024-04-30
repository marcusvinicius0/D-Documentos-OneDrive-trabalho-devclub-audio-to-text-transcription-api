import prismaClient from "../../../prisma/connect.js";

class GetChatHistoryService {
  async execute({ chatbotIdentification }) {
    const findUserChatSession = await prismaClient.chatSession.findFirst({
      where: {
        chatbotId: chatbotIdentification,
      },
      select: {
        id: true,
      },
    });

    if (!findUserChatSession) {
      return [];
    }

    const session_id = findUserChatSession.id;

    const getChatHistory = await prismaClient.chatbotMessages.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        chatSessionId: session_id,
      },
      select: {
        id: true,
        chatSessionId: true,
        sender: true,
        bot: true,
        isFiled: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return getChatHistory;
  }
}

export { GetChatHistoryService };
