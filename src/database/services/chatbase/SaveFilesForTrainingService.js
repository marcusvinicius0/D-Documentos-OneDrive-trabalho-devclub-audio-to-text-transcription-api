import { AppError } from "../../../errors/app.error.js";
import prismaClient from "../../../prisma/connect.js";

class SaveFilesForTrainingService {
  async execute({ texts, chatbotId }) {
    const isChatbot = await prismaClient.chatbot.findFirst({
      where: {
        id: chatbotId,
      },
    });

    if (!isChatbot) {
      throw new AppError("Você não tem permissão para rodar esse serviço.", 401);
    }

    const createPromises = texts.flatMap((transcription) => {
      const filename = transcription.filename;
      const text = transcription.transcription.results.openai.text;
      const message_length = text.length;

      return prismaClient.filesForBotTraining.create({
        data: {
          author: isChatbot.authorEmail,
          chatbotId: isChatbot.id,
          message: text,
          fileName: filename,
          isFileTrained: false,
          messageLength: message_length,
          slug: isChatbot.slug,
        },
      });
    });

    try {
      await prismaClient.$transaction(createPromises);

      return { message: "Transcrições salvas com sucesso" };
    } catch (error) {
      console.error(error);
    }
  }
}

export { SaveFilesForTrainingService };
