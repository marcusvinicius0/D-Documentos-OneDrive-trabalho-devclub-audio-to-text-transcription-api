import { AppError } from "../../../errors/app.error.js";
import prismaClient from "../../../prisma/connect.js";

class SaveOrCreateChatFlowService {
  async execute({ latestMessages, chatbotId }) {
    let author = latestMessages[0];
    let bot = latestMessages[1];

    const findChatbot = await prismaClient.chatbot.findFirst({
      where: {
        id: chatbotId,
      },
      select: {
        id: true,
        userId: true,
        authorEmail: true,
        authorName: true,
        name: true,
      },
    });

    if (!findChatbot) {
      throw new AppError("Nenhum bot foi encontrado.", 404);
    }

    const isSessionActive = await prismaClient.chatSession.findFirst({
      where: {
        AND: [
          {
            chatbotId: findChatbot.id,
          },
          {
            isFiled: false,
          },
        ],
      },
      select: {
        id: true,
      },
    });

    if (!isSessionActive) {
      await prismaClient.chatSession.create({
        data: {
          userId: findChatbot.authorEmail,
          chatbotId: findChatbot.id,
          isFiled: false,
          slug: chatbotId,
        },
      });
    }

    const getSessionCreated = await prismaClient.chatSession.findFirst({
      where: {
        AND: [
          {
            chatbotId: findChatbot.id,
          },
          {
            isFiled: false,
          },
        ],
      },
      select: {
        id: true,
      },
    });

    const chat_session_id = getSessionCreated.id;

    await prismaClient.chatbotMessages.create({
      data: {
        chatSessionId: chat_session_id,
        sender: author,
        bot: bot,
        messages: [author, bot],
        isFiled: false,
      },
    });

    return { ok: true };
  }
}

export { SaveOrCreateChatFlowService };
