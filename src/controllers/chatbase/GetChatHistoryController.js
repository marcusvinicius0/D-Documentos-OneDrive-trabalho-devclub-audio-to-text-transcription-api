import { createGetChatHistoryService } from "../../utils/services.js";

class GetChatHistoryController {
  async index(req, res, next) {
    try {
      const userSession = req.params.id;

      createGetChatHistoryService;
      const service = await createGetChatHistoryService.execute({
        userSession,
      });

      return res.status(200).json(service);
    } catch (error) {
      next(error);
    }
  }
}

export { GetChatHistoryController };
