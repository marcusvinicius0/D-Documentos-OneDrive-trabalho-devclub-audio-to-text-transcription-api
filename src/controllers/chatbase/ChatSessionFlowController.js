import { mainGoogle } from "../../service/google.js";

class ChatSessionFlowController {
  async store(req, res, next) {
    try {
      const userSession = req.params.id;
      const body = req.body;
      const currentUserMessage = body.message;
      const chatId = userSession;

      const AIServiceRes = await mainGoogle({ currentUserMessage, chatId });

      return res.status(200).json(AIServiceRes);
    } catch (error) {
      next(error);
    }
  }
}

export { ChatSessionFlowController };
