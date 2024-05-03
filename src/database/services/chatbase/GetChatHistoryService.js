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

    const getChatFlow = await prismaClient.chatbotMessages.findMany({
      orderBy: {
        createdAt: "asc",
      },
      where: {
        chatSessionId: session_id,
      },
      select: {
        id: true,
        chatSessionId: true,
        sender: true,
        bot: true,
        messages: true,
        isFiled: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const allMessages = [].concat(...getChatFlow.map(chat => chat.messages));

    return allMessages;
  }
}

export { GetChatHistoryService };
