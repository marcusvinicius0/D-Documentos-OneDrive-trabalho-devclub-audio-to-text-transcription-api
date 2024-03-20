import { createGetChatbotsService } from "../../../utils/services.js";

class GetChatbotsController {
  async index(req, res, next) {
    const userSession = req.params.id;

    createGetChatbotsService;
    const service = await createGetChatbotsService.execute({ userSession });

    return res.status(200).json(service);
  }
}

export { GetChatbotsController };
