import { runAssistant } from "../../../service/runAssistant.js";

class SaveNewAssistantController {
  async store(req, res, next) {
    try {
      const { chatbot_id } = req.body;

      const createRunAssistant = await runAssistant(chatbot_id);

      return res.status(201).json(createRunAssistant);
    } catch (error) {
      next(error)
    }
  }
}

export { SaveNewAssistantController };