import { initializeNewAIChatSession, mainOpenAI } from "../../../service/openai.js";

class ChatSessionFlowController {
  async store(req, res, next) {
    try {
      const userSession = req.params.id;
      const body = req.body;
      const currentUserMessage = body.message;
      const chatId = userSession;

      await initializeNewAIChatSession(chatId);
      const AIService = await mainOpenAI({ currentMessage: currentUserMessage, chatId });

      return res.status(200).json(AIService);
    } catch (error) {
      next(error);
    }
  }
}

export { ChatSessionFlowController };
