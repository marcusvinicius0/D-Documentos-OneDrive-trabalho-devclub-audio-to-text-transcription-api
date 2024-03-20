import { speechToTextEdenAI } from "../../../service/edenai/speech-to-text.js";
import { createSaveFilesForTrainingService } from "../../../utils/services.js";

class SaveFilesForTrainingController {
  async store(req, res, next) {
    try {
      const files = req.files;
      const chatbotId = req.params.id;

      await speechToTextEdenAI(files).then(async (transcriptions) => {
        const texts = transcriptions.map(transcription => {
          const text = transcription;
          return text;
        })

        createSaveFilesForTrainingService;
        const service = await createSaveFilesForTrainingService.execute({ texts, chatbotId });
        return res.status(200).json(service);
      }).catch(error => {
        console.error("Erro ao processar transcrições: ", error);
      });
    } catch (error) {
      next(error);
    }
  }
}

export { SaveFilesForTrainingController };
