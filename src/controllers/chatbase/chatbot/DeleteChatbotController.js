import { createDeleteChatbotService } from "../../../utils/services.js";

class DeleteChatbotController {
  async delete(req, res, next) {
    try {
      const chatbotId = req.params.id;

      const { email } = req.body;

      createDeleteChatbotService;
      const service = await createDeleteChatbotService.execute({ chatbotId, email });

      return res.status(200).json(service);
    } catch (error) {
      next(error);
    }
  }
}

export { DeleteChatbotController };
