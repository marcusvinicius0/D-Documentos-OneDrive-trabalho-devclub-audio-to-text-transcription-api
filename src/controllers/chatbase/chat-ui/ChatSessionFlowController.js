import { startChatWithAssistant } from "../../../service/runAssistant.js";

class ChatSessionFlowController {
  async store(req, res, next) {
    try {
      const chatbotId = req.params.id;
      const { message } = req.body;

      const AIService = await startChatWithAssistant({ currentMessage: message, chatbotId });

      return res.status(200).json(AIService);
    } catch (error) {
      next(error);
    }
  }
}

export { ChatSessionFlowController };
