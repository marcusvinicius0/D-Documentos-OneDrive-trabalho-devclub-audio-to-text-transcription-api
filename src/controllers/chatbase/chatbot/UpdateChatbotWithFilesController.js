import { speechToTextEdenAI } from "../../../service/edenai/speech-to-text.js";
import { createSaveFilesForRetrainingService } from "../../../utils/services.js";

class UpdateChatbotWithFilesController {
  async store(req, res, next) {
    try {
      const files = req.files;
      const chatbotId = req.params.id;

      if (files) {
        await speechToTextEdenAI(files)
          .then(async (transcriptions) => {
            const texts = transcriptions.map((transcription) => {
              const text = transcription;
              return text;
            });

            createSaveFilesForRetrainingService;
            const service = await createSaveFilesForRetrainingService.execute({
              texts,
              chatbotId,
            });

            return res.status(200).json(service);
          })
          .catch((error) => {
            console.error("Erro ao processar transcrições: ", error);
          });
      } else {
        next();
      }
    } catch (error) {
      next(error);
    }
  }
}

export { UpdateChatbotWithFilesController };
