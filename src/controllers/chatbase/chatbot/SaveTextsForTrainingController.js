import { createSaveTextsForTrainingService } from "../../../utils/services.js";

import fs from "node:fs";

class SaveTextsForTraningController {
  async store(req, res, next) {
    try {
      const { textData } = req.body;
      const chatbotId = req.params.id;

      const text = textData.text;
      let existingContent = "";

      if (fs.existsSync("./src/utils/chatbot-content.js")) {
        existingContent = fs.readFileSync("./src/utils/chatbot-content.js", { encoding: "utf-8" })
      }

      const newTexts = existingContent + text;

      fs.writeFileSync("./src/utils/chatbot-content.js", JSON.stringify(newTexts, null, 2), { encoding: "utf-8" });

      createSaveTextsForTrainingService;
      const service = await createSaveTextsForTrainingService.execute({ textData, chatbotId });

      return res.status(201).json(service);
    } catch (error) {
      next(error);
    }
  }
}

export { SaveTextsForTraningController };
