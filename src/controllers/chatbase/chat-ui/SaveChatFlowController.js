import { createSaveOrCreateChatFlowService } from "../../../utils/services.js";

class SaveChatFlowController {
  async store(req, res, next) {
    try {
      const { latestMessages } = req.body;
      const slug = req.params.id;

      createSaveOrCreateChatFlowService;
      const service = await createSaveOrCreateChatFlowService.execute({
        latestMessages,
        slug,
      });
      return res.status(200).json(service);
    } catch (error) {
      next(error);
    }
  }
}

export { SaveChatFlowController };
