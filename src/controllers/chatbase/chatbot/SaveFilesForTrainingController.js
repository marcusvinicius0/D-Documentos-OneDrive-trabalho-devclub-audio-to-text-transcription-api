import { speechToTextEdenAI } from "../../../service/edenai/speech-to-text.js";
import { createSaveFilesForTrainingService } from "../../../utils/services.js";

import fs from "node:fs";

class SaveFilesForTrainingController {
  async store(req, res, next) {
    try {
      const files = req.files;
      const chatbotId = req.params.id;

      if (!files) {
        return res.status(400).json({ error: "Nenhum arquivo foi baixado." });
      }

      const transcriptions = await speechToTextEdenAI(files);
      let texts = transcriptions.filter(Boolean);

      const joinTexts = texts
        .map((transcription) => {
          let result = transcription.transcription.results.openai.text;
          return result;
        })
        .filter(Boolean);

      fs.writeFileSync(
        "./src/utils/chatbot-content.txt",
        JSON.stringify(joinTexts, null, 2),
        { encoding: "utf-8" }
      );

      createSaveFilesForTrainingService;
      const service = await createSaveFilesForTrainingService.execute({
        texts,
        chatbotId,
      });

      return res.status(201).json(service);
    } catch (error) {
      next(error);
    }
  }
}

export { SaveFilesForTrainingController };
