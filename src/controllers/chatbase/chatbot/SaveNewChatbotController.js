import { createSaveNewChatbotService } from "../../../utils/services.js";

class SaveNewChatbotController {
  async store(req, res, next) {
    try {
      const { authorEmail, authorName, chatbotName } = req.body;

      createSaveNewChatbotService;
      const service = await createSaveNewChatbotService.execute({ authorEmail, authorName, chatbotName });

      return res.status(201).json(service);
    } catch (error) {
      next(error);
    }
  }
}

export { SaveNewChatbotController };
