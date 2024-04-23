import { AppError } from "../../../errors/app.error.js";
import prismaClient from "../../../prisma/connect.js";

class GetTrainedFilesService {
  async execute({ chatbotId }) {
    const isTrainedFiles = await prismaClient.filesForBotTraining.findMany({
      where: {
        AND: [
          {
            chatbotId: chatbotId,
          },
          {
            isFileTrained: true,
          },
        ],
      },
      select: {
        id: true,
        chatbotId: true,
        author: true,
        slug: true,
        fileName: true,
        isFileTrained: true,
        message: true,
        messageLength: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!isTrainedFiles) {
      throw new AppError("Nenhum arquivo treinado foi encontrado.", 404);
    }

    return isTrainedFiles || [];
  }
}

export { GetTrainedFilesService };
