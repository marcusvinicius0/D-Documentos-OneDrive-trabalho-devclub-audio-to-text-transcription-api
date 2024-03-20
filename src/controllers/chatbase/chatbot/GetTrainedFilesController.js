import { createGetTrainedFilesService } from "../../../utils/services.js";

class GetTrainedFilesController {
  async index(req, res, next) {
    try {
      const slug = req.params.id;

      createGetTrainedFilesService;
      const service = await createGetTrainedFilesService.execute({ slug });

      return res.status(200).json(service);
    } catch (error) {
      next(error);
    }
  }
}

export { GetTrainedFilesController };