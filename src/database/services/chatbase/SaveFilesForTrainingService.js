import { AppError } from "../../../errors/app.error.js";
import prismaClient from "../../../prisma/connect.js";

class SaveFilesForTrainingService {
  async execute({ texts, chatbotId }) {
    const isChatbot = await prismaClient.chatbot.findFirst({
      where: {
        id: chatbotId,
      },
      select: {
        id: true,
        authorEmail: true,
        slug: true,
      },
    });

    if (!isChatbot) {
      throw new AppError(
        "Você não tem permissão para rodar esse serviço.",
        401
      );
    }

    const transcriptions = Array.isArray(texts) ? texts : [texts];

    const filesToInsert = transcriptions.map((transcription) => {
      const filename = transcription.filename;
      const text = transcription.transcription.results.openai.text;
      const message_length = text.length;

      return {
        author: isChatbot.authorEmail,
        chatbotId: isChatbot.id,
        message: text,
        fileName: filename,
        isFileTrained: true,
        messageLength: message_length,
        slug: isChatbot.slug,
      };
    });

    try {
      await prismaClient.filesForBotTraining.createMany({
        data: filesToInsert,
      })

      return { message: "Transcrições salvas com sucesso." };
    } catch (error) {
      console.error(error);
      throw new AppError("Erro ao salvar transcrições no banco de dados.", 500);
    }
  }
}

export { SaveFilesForTrainingService };
