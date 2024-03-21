import { AppError } from "../../../errors/app.error.js";
import prismaClient from "../../../prisma/connect.js";

class SaveNewChatbotService {
  async execute({ authorEmail, authorName, chatbotName }) {
    if (!authorEmail || !authorName) {
      throw new AppError(
        "Você não tem permissão para rodar esse serviço.",
        401
      );
    }

    const chatbotDataStructure = {
      model: "gpt-3.5-turbo-16k-0613",
      authorEmail: authorEmail,
      authorName: authorName,
      chatbotName: chatbotName,
      slug: chatbotName,
    };

    const isChatbotSameName = await prismaClient.chatbot.findFirst({
      where: {
        slug: chatbotName,
      }
    });

    if (isChatbotSameName) {
      throw new AppError("Não pode ter dois bots com o mesmo nome.", 403);
    }

    const findUser = await prismaClient.user.findFirst({
      where: {
        email: authorEmail,
      },
      select: {
        id: true,
      }
    })

    const createNewChatbot = await prismaClient.chatbot.create({
      data: {
        model: chatbotDataStructure.model,
        authorEmail: chatbotDataStructure.authorEmail,
        authorName: chatbotDataStructure.authorName,
        name: chatbotDataStructure.chatbotName,
        slug: chatbotDataStructure.slug,
        userId: findUser.id,
      },
      select: {
        id: true,
      }
    });

    return createNewChatbot;
  }
}

export { SaveNewChatbotService };
