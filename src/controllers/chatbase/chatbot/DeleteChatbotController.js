import { createDeleteChatbotService } from "../../../utils/services.js";

class DeleteChatbotController {
  async delete(req, res, next) {
    try {
      const chatbotName = req.params.id;

      createDeleteChatbotService;
      const service = await createDeleteChatbotService.execute({ chatbotName });

      return res.status(200).json(service);
    } catch (error) {
      next(error);
    }
  }
}

export { DeleteChatbotController };
