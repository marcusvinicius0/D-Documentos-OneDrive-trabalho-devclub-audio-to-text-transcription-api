import prismaClient from "../../../prisma/connect.js";
import { AppError } from "../../../errors/app.error.js";
class GetChatHistoryService {
  async execute({ chatbotIdentification }) {
    const findUserChatSession = await prismaClient.chatSession.findFirst({
      where: {
        AND: [
          {
            chatbotId: chatbotIdentification,
          },
          {
            isChatWidget: false,
          },
        ],
      },
      select: {
        id: true,
      },
    });

    if (!findUserChatSession) {
      throw new AppError(
        "Não foi possível encontrar uma sessão de chat. ",
        404
      );
    }

    const sessionId = findUserChatSession.id;

    const getChatFlow = await prismaClient.chatbotMessages.findMany({
      orderBy: {
        createdAt: "asc",
      },
      where: {
        chatSessionId: sessionId,
      },
      select: {
        id: true,
        chatSessionId: true,
        sender: true,
        bot: true,
        messages: true,
        isFiled: true,
        isChatWidget: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const allMessages = [].concat(...getChatFlow.map((chat) => chat.messages));

    return allMessages || [];
  }
}

export { GetChatHistoryService };
