import { createTrainChatbotService } from "../../utils/services.js";

class TrainChatbotController {
  async store(req, res, next) {
    try {
      const userSession = req.params.id;

      createTrainChatbotService;
      await createTrainChatbotService.execute({ userSession });

      return res.status(201).json({ message: "Bot treinado com sucesso." });
    } catch (error) {
      next(error);
    }
  }
}

export { TrainChatbotController };
