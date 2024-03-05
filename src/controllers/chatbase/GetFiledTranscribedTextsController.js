import { createGetFiledTranscribedTextsService } from "../../utils/services.js";

class GetFiledTranscribedTextsController {
  async index(req, res, next) {
    try {
      const userSession = req.params.id;

      createGetFiledTranscribedTextsService;
      const service = await createGetFiledTranscribedTextsService.execute({ userSession });

      return res.status(200).json(service);
    } catch (error) {
      next(error)
    }
  }
}

export { GetFiledTranscribedTextsController };