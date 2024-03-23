import { speechToTextEdenAI } from "../../../service/edenai/speech-to-text.js";

import fs from "node:fs";

class UpdateChatbotWithFilesController {
  async update(req, res, next) {
    try {
      const slug = req.params.id;
      const files = req.files;

      await speechToTextEdenAI(files).then(async (transcriptions) => {
        const texts = transcriptions.map(transcription => {
          const text = transcription;

          return text;
        })

        const fullTexts = texts.map((transcription) => {
          const fullText = transcription.transcription.results.openai.text;

          return fullText;
        })

        let existingContent = "";
        const contentPath = "./src/utils/chatbot-content.js";

        if (fs.existsSync(contentPath)) {
          existingContent = fs.readFileSync(contentPath, { encoding: "utf-8" })
        }

        const newTexts = existingContent + fullTexts;

        fs.writeFileSync(contentPath, JSON.stringify(newTexts, null, 2), { encoding: "utf-8" });


      }).catch(error => {
        console.error("Erro ao processar transcrições: ", error);
      })
    } catch (error) {
      next(error);
    }
  }
}

export { UpdateChatbotWithFilesController };
