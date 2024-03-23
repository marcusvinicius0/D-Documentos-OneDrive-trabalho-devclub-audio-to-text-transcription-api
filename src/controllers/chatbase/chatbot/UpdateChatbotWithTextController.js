import fs from "node:fs";

class UpdateChatbotWithTextController {
  async update(req, res, next) {
    try {
      const { textData } = req.body;
      const slug = req.params.id;

      let existingContent = "";
      const contentPath = "./src/utils/chatbot-content.js";

      if (fs.existsSync(contentPath)) {
        existingContent = fs.readFileSync(contentPath, { encoding: "utf-8" })
      }

      const newTexts = existingContent + textData;

      fs.writeFileSync(contentPath, JSON.stringify(newTexts, null, 2), { encoding: "utf-8" });

      return res.status(200).json({ message: "Bot treinado com textos."});

    } catch (error) {
      next(error);
    }
  }
}

export { UpdateChatbotWithTextController };
