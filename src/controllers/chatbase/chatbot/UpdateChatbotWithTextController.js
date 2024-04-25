import { createSaveTextForRetrainingService } from "../../../utils/services.js";

class UpdateChatbotWithTextController {
  async store(req, res, next) {
    try {
      const { textData } = req.body;
      const chatbotId = req.params.id;

      createSaveTextForRetrainingService;
      const service = await createSaveTextForRetrainingService.execute({
        textData, chatbotId
      })

      return res.status(200).json(service);

    } catch (error) {
      next(error);
    }
  }
}

export { UpdateChatbotWithTextController };
