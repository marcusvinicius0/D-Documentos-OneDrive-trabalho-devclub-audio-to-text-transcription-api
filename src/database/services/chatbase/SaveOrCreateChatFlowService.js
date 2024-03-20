import { AppError } from "../../../errors/app.error.js";
import prismaClient from "../../../prisma/connect.js";

class SaveOrCreateChatFlowService {
  async execute({ latestMessages, slug }) {
    const author = latestMessages[0];
    const bot = latestMessages[1];

    const findChatbot = await prismaClient.chatbot.findFirst({
      where: {
        OR: [
          {
            slug: slug,
          },
          {
            authorEmail: slug,
          },
        ],
      },
    });

    if (!findChatbot) {
      throw new AppError("Nenhum bot foi encontrado.", 404);
    }

    const isSessionActive = await prismaClient.chatSession.findFirst({
      where: {
        chatbotId: findChatbot.id,
        isFiled: false,
      },
    });

    if (!isSessionActive) {
      await prismaClient.chatSession.create({
        data: {
          userId: findChatbot.authorEmail,
          chatbotId: findChatbot.id,
          isFiled: false,
          slug: slug,
        },
      });
    }

    const chat_session_id = isSessionActive.id;

    const saveChatFlow = await prismaClient.chatbotMessages.create({
      data: {
        chatSessionId: chat_session_id,
        sender: author,
        bot: bot,
        isFiled: false,
      },
    });

    return saveChatFlow;
  }
}

export { SaveOrCreateChatFlowService };
