import { AppError } from "../../../errors/app.error.js";
import prismaClient from "../../../prisma/connect.js";

class DeleteChatbotService {
  async execute({ chatbotName }) {
    const findChatbot = await prismaClient.chatbot.findFirst({
      where: {
        name: chatbotName
      },
      select: {
        id: true,
        name: true,
      }
    })

    if (!findChatbot) {
      throw new AppError("Não foi possível encontrar o chatbot relacionado.", 404);
    }

    const findFilesOfChatbot = await prismaClient.filesForBotTraining.findMany({
      where: {
        chatbotId: findChatbot.id,
      },
      select: {
        id: true,
      }
    });

    if (findFilesOfChatbot) {
      await prismaClient.filesForBotTraining.deleteMany({
        where: {
          id: findFilesOfChatbot.id,
        }
      })
    }

    const findTextsOfChatbot = await prismaClient.textsForBotTraining.findMany({
      where: {
        chatbotId: findChatbot.id,
      },
      select: {
        id: true,
      }
    })

    if (findTextsOfChatbot) {
      await prismaClient.textsForBotTraining.deleteMany({
        where: {
          id: findTextsOfChatbot.id,
        }
      })
    }

    const findChatSession = await prismaClient.chatSession.findFirst({
      where: {
        chatbotId: findChatbot.id,
      },
      select: {
        id: true,
      }
    })

    if (findChatSession) {
      const findMessagesOfChatSession = await prismaClient.chatbotMessages.findMany({
        where: {
          chatSessionId: findChatSession.id,
        },
        select: {
          id: true,
        }
      })

      if (findMessagesOfChatSession) {
        await prismaClient.chatbotMessages.deleteMany({
          where: {
            id: findMessagesOfChatSession.id,
          }
        })
      }

      await prismaClient.chatSession.delete({
        where: {
          id: findChatSession.id,
        }
      })
    }
    
    const deleteChatbot = await prismaClient.chatbot.delete({
      where: {
        id: findChatbot.id,
      }
    })

    return deleteChatbot;
  }
}

export { DeleteChatbotService };