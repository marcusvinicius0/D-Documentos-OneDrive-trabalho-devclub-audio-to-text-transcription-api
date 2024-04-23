import { createSaveOrCreateChatFlowService } from "../../../utils/services.js";

class SaveChatFlowController {
  async store(req, res, next) {
    try {
      const { latestMessages } = req.body;
      const chatbotId = req.params.id;

      createSaveOrCreateChatFlowService;
      const service = await createSaveOrCreateChatFlowService.execute({
        latestMessages,
        chatbotId,
      });
      return res.status(200).json(service);
    } catch (error) {
      next(error);
    }
  }
}

export { SaveChatFlowController };
