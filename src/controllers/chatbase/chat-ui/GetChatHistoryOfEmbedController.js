import { createGetChatHistoryOfEmbedService } from "../../../utils/services.js";

class GetChatHistoryOfEmbedController {
  async index(req, res, next) {
    try {
      const chatbotId = req.params.id;

      console.log("chatbotId: ", chatbotId);
      createGetChatHistoryOfEmbedService;
      const service = await createGetChatHistoryOfEmbedService.execute({
        chatbotId,
      });

      return res.status(200).json(service);
    } catch (error) {
      next(error);
    }
  }
}

export { GetChatHistoryOfEmbedController };
