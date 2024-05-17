import { AppError } from "../../../errors/app.error.js";
import prismaClient from "../../../prisma/connect.js";

class SaveNewChatbotService {
  async execute(chatbot) {
    const chatbotDataStructure = {
      model: "gpt-3.5-turbo",
      authorEmail: chatbot.authorEmail,
      authorName: chatbot.authorName,
      chatbotName: chatbot.name,
      slug: chatbot.name,
      instructions: chatbot.instructions,
      temperature: chatbot.temperature,
    };

    const isChatbotSameName = await prismaClient.chatbot.findFirst({
      where: {
        AND: [
          {
            name: {
              equals: chatbot.name,
              mode: "insensitive",
            },
          },
          {
            authorEmail: chatbot.authorEmail,
          },
        ],
      },
      select: {
        name: true,
        slug: true,
        authorEmail: true,
      }
    });

    if (isChatbotSameName) {
      throw new AppError("Não pode ter dois bots com o mesmo nome.", 403);
    }

    const findUser = await prismaClient.user.findFirst({
      where: {
        email: chatbot.authorEmail,
      },
      select: {
        id: true,
      },
    });

    const createNewChatbot = await prismaClient.chatbot.create({
      data: {
        model: chatbotDataStructure.model,
        authorEmail: chatbotDataStructure.authorEmail,
        authorName: chatbotDataStructure.authorName,
        name: chatbotDataStructure.chatbotName,
        slug: chatbotDataStructure.slug,
        userId: findUser.id,
        instructions: chatbotDataStructure.instructions,
        temperature: chatbotDataStructure.temperature,
      },
      select: {
        id: true,
      },
    });

    return createNewChatbot;
  }
}

export { SaveNewChatbotService };
