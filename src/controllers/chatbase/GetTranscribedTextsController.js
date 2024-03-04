import { createGetTranscribedTextsService } from "../../utils/services.js";

class GetTranscribedTexts {
  async index(req, res, next) {
    try {
      const userSession = req.params.id;

      createGetTranscribedTextsService;
      const service = await createGetTranscribedTextsService.execute({userSession});

      return res.status(200).json(service);
    } catch (error) {
      next(error);
    }
  }
}

export { GetTranscribedTexts };
