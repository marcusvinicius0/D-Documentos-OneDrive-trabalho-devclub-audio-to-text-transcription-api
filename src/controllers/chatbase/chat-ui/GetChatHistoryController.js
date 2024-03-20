import { createGetChatHistoryService } from "../../../utils/services.js";

class GetChatHistoryController {
  async index(req, res, next) {
    try {
      const slug = req.params.id;

      createGetChatHistoryService;
      const service = await createGetChatHistoryService.execute({
        slug,
      });

      return res.status(200).json(service);
    } catch (error) {
      next(error);
    }
  }
}

export { GetChatHistoryController };
