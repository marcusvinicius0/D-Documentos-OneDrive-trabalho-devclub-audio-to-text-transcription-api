import { AppError } from "../../../errors/app.error.js";
import prismaClient from "../../../prisma/connect.js";

class GetUniqueChatbotService {
  async execute({slug}) {
    const isChatbot = await prismaClient.chatbot.findFirst({
      where: {
        slug: slug,
      },
      select: {
        id: true,
        name: true,
        model: true,
        imageUrl: true,
        status: true,
        authorEmail: true,
        authorName: true,
        visibility: true,
        lastTrainedAt: true,
        createdAt: true,
        updatedAt: true,
        Files: true,
        Texts: true,
      }
    })

    if (!isChatbot) {
      throw new AppError("Não foi possível encontrar esse chatbot.", 404);
    }

    return isChatbot;

  }
}

export { GetUniqueChatbotService };