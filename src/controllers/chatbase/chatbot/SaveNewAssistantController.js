import { runAssistant } from "../../../service/runAssistant.js";

class SaveNewAssistantController {
  async store(req, res, next) {
    try {
      const chatbot = req.body;

      const createRunAssistant = await runAssistant(chatbot);
      return res.status(201).json(createRunAssistant);
    } catch (error) {
      next(error)
    }
  }
}

export { SaveNewAssistantController };