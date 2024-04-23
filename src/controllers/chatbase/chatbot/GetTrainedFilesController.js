import { createGetTrainedFilesService } from "../../../utils/services.js";

class GetTrainedFilesController {
  async index(req, res, next) {
    try {
      const chatbotId = req.params.id;

      createGetTrainedFilesService;
      const service = await createGetTrainedFilesService.execute({ chatbotId });

      return res.status(200).json(service);
    } catch (error) {
      next(error);
    }
  }
}

export { GetTrainedFilesController };