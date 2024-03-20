import { AppError } from "../../../errors/app.error.js";
import prismaClient from "../../../prisma/connect.js";

class GetChatbotsService {
  async execute({ slug }) {
    const isChatbot = await prismaClient.chatbot.findMany({
      where: {
        authorName: slug,
      },
      include: {
        Files: true,
        Texts: true,
      }
    })

    if (!isChatbot) {
      throw new AppError("Não foi possível encontrar nenhum bot para esse usuário.", 404);
    }

    return isChatbot;
  }
}

export { GetChatbotsService };