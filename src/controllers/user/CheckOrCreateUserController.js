import { createCheckOrCreateUserService } from "../../utils/services.js";

class CheckOrCreateUserController {
  async store(req, res, next) {
    const { email, name } = req.body;

    createCheckOrCreateUserService;
    const service = await createCheckOrCreateUserService.execute({ email, name });

    return res.status(200).json(service);
  }
}

export { CheckOrCreateUserController };