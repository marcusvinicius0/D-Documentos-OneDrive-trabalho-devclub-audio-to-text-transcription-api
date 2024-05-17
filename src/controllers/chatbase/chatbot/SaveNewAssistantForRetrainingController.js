import { runAssistantForRetraining } from "../../../service/runAssistant.js";

class SaveNewAssistantForRetrainingController {
  async store(req, res, next) {
    try {
      const chatbotId = req.params.id;
      const { botConfig } = req.body;

      const createRunAssistantForRetraining = await runAssistantForRetraining(chatbotId, botConfig);

      return res.status(201).json(createRunAssistantForRetraining);
    } catch (error) {
      next(error);
    }
  }
}

export { SaveNewAssistantForRetrainingController };