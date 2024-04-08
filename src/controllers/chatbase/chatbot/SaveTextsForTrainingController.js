import { createSaveTextsForTrainingService } from "../../../utils/services.js";

import fs from "node:fs";

class SaveTextsForTraningController {
  async store(req, res, next) {
    try {
      const { textData } = req.body;
      const chatbotId = req.params.id;

      const text = textData.text;
      let existingContent = "";
      const path = "./src/utils/chatbot-content.txt";

      if (fs.existsSync(path)) {
        existingContent = fs.readFileSync(path, { encoding: "utf-8" })
      }

      const newTexts = existingContent + text;

      fs.writeFileSync(path, JSON.stringify(newTexts, null, 2), { encoding: "utf-8" });

      createSaveTextsForTrainingService;
      const service = await createSaveTextsForTrainingService.execute({ textData, chatbotId });

      return res.status(201).json(service);
    } catch (error) {
      next(error);
    }
  }
}

export { SaveTextsForTraningController };
