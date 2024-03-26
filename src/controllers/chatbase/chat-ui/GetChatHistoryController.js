import { createGetChatHistoryService } from "../../../utils/services.js";

class GetChatHistoryController {
  async index(req, res, next) {
    try {
      const chatbotIdentification = req.params.id;

      createGetChatHistoryService;
      const service = await createGetChatHistoryService.execute({
        chatbotIdentification,
      });

      return res.status(200).json(service);
    } catch (error) {
      next(error);
    }
  }
}

export { GetChatHistoryController };
