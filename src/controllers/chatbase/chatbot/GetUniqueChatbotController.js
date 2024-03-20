import { createGetUniqueChatbotService } from "../../../utils/services.js";

class GetUniqueChatbotController {
  async show(req, res, next) {
    try {
      const slug = req.params.id;

      createGetUniqueChatbotService;
      const service = await createGetUniqueChatbotService.execute({slug});

      return res.status(200).json(service);

    } catch (error) {
      next(error)
    }
  }
}

export { GetUniqueChatbotController };