import { AppError } from "../../../errors/app.error.js";
import prismaClient from "../../../prisma/connect.js";
import { deleteAssistant } from "../../../service/runAssistant.js";

class DeleteChatbotService {
  async execute({ chatbotId, email }) {
    const findChatbot = await prismaClient.chatbot.findFirst({
      where: {
        AND: [
          {
            id: chatbotId,
          },
          {
            authorEmail: email,
          },
        ],
      },
      select: {
        id: true,
        name: true,
        assistantId: true,
      },
    });

    if (!findChatbot) {
      throw new AppError(
        "Não foi possível encontrar o chatbot relacionado.",
        404
      );
    }

    const findFilesOfChatbot = await prismaClient.filesForBotTraining.findMany({
      where: {
        chatbotId: findChatbot.id,
      },
      select: {
        id: true,
      },
    });

    if (findFilesOfChatbot) {
      await prismaClient.filesForBotTraining.deleteMany({
        where: {
          chatbotId: findChatbot.id,
        },
      });
    }

    const findTextsOfChatbot = await prismaClient.textsForBotTraining.findMany({
      where: {
        chatbotId: findChatbot.id,
      },
      select: {
        id: true,
      },
    });

    if (findTextsOfChatbot) {
      await prismaClient.textsForBotTraining.deleteMany({
        where: {
          chatbotId: findChatbot.id,
        },
      });
    }

    const findChatSession = await prismaClient.chatSession.findFirst({
      where: {
        chatbotId: findChatbot.id,
      },
      select: {
        id: true,
      },
    });

    if (findChatSession) {
      const findMessagesOfChatSession =
        await prismaClient.chatbotMessages.findMany({
          where: {
            chatSessionId: findChatSession.id,
          },
          select: {
            id: true,
          },
        });

      if (findMessagesOfChatSession) {
        await prismaClient.chatbotMessages.deleteMany({
          where: {
            chatSessionId: findChatSession.id,
          },
        });
      }

      await prismaClient.chatSession.delete({
        where: {
          id: findChatSession.id,
        },
      });
    }

    await deleteAssistant(findChatbot.assistantId);

    const deleteChatbot = await prismaClient.chatbot.delete({
      where: {
        id: findChatbot.id,
      },
    });

    return deleteChatbot;
  }
}

export { DeleteChatbotService };
