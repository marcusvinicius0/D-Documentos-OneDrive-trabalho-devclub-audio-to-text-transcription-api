import prismaClient from "../../../prisma/connect.js";

class GetChatHistoryOfEmbedService {
  async execute({ chatbotId }) {
    const findUserChatSessionWidget = await prismaClient.chatSession.findFirst({
      where: {
        AND: [
          {
            chatbotId: chatbotId,
          },
          {
            isChatWidget: true,
          },
        ],
      },
      select: {
        id: true,
      },
    });

    if (!findUserChatSessionWidget) {
      return [];
    }

    const sessionId = findUserChatSessionWidget.id;

    const getChatFlow = await prismaClient.chatbotMessages.findMany({
      orderBy: {
        createdAt: "asc",
      },
      where: {
        AND: [
          {
            chatSessionId: sessionId,
          },
          {
            isChatWidget: true,
          }
        ]
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

    return allMessages || [];
  }
}

export { GetChatHistoryOfEmbedService };
