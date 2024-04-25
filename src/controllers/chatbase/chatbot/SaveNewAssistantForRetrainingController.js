import { runAssistantForRetraining } from "../../../service/runAssistant.js";

class SaveNewAssistantForRetrainingController {
  async store(req, res, next) {
    try {
      const chatbotId = req.params.id;

      const createRunAssistantForRetraining = await runAssistantForRetraining(chatbotId);

      return res.status(200).json(createRunAssistantForRetraining);
    } catch (error) {
      next(error);
    }
  }
}

export { SaveNewAssistantForRetrainingController };