import { createDeleteChatHistoryService } from "../../utils/services.js";

class DeleteChatHistoryController {
  async delete(req, res, next) {
    try {
      const userSession = req.params.id;

      createDeleteChatHistoryService;
      const service = await createDeleteChatHistoryService.execute({
        userSession,
      });

      return res.status(200).json(service);
    } catch (error) {
      next(error);
    }
  }
}

export { DeleteChatHistoryController };
