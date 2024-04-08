import { startChatWithAssistant } from "../../../service/runAssistant.js";

class ChatSessionFlowController {
  async store(req, res, next) {
    try {
      const chatbotName = req.params.id;
      const { message, chatbotId } = req.body;

      const AIService = await startChatWithAssistant({ currentMessage: message, chatbotName, chatbotId });

      return res.status(200).json(AIService);
    } catch (error) {
      next(error);
    }
  }
}

export { ChatSessionFlowController };
