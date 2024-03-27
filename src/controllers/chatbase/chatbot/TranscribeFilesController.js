import { speechToTextEdenAI } from "../../../service/edenai/speech-to-text.js";

class TranscribeFilesController {
  async store(req, res, next) {
    try {
      const files = req.files;

      await speechToTextEdenAI(files).then(async (transcriptions) => {
        const texts = transcriptions.map((transcription) => {

          const text = transcription;

          return text;
        });

        const fullTexts = texts.map(transctiption => {
          const text = transctiption.transcription.results.openai.text;

          return text;
        });

        return res.status(200).json(fullTexts);
      });
    } catch (error) {
      next(error);
    }
  }
}

export { TranscribeFilesController };
