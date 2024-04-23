import { createGetTrainedTextsService } from "../../../utils/services.js";

class GetTrainedTextsController {
  async index(req, res, next) {
    try {
      const chatbotId = req.params.id;

      createGetTrainedTextsService;
      const service = await createGetTrainedTextsService.execute({ chatbotId });

      return res.status(200).json(service);
    } catch (error) {
      next(error);
    }
  }
}

export { GetTrainedTextsController };
