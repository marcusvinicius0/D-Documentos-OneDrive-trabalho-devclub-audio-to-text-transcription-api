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
      select: {
        id: true,
        userId: true,
        authorEmail: true,
        authorName: true,
      }
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
          }
        ]
      },
      select: {
        id: true,
      }
    });

    if (!isSessionActive) {
      await prismaClient.chatSession.create({
        data: {
          userId: findChatbot.authorEmail,
          chatbotId: findChatbot.id,
          isFiled: false,
          slug: slug,
        }
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
          }
        ]
      },
      select: {
        id: true,
      }
    })

    const chat_session_id = getSessionCreated.id;

    const saveChatFlow = await prismaClient.chatbotMessages.create({
      data: {
        chatSessionId: chat_session_id,
        sender: author,
        bot: bot,
        isFiled: false,
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
    });

    return saveChatFlow;
  }
}

export { SaveOrCreateChatFlowService };
