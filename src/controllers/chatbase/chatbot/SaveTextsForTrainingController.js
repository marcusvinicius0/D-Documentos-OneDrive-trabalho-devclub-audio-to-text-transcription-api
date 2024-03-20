// import { initializeNewAIChatSession } from "../../service/openai.js";
import { createSaveTextsForTrainingService } from "../../../utils/services.js";

class SaveTextsForTraningController {
  async store(req, res, next) {
    try {
      const { textData } = req.body;
      const chatbotId = req.params.id;

      createSaveTextsForTrainingService;
      const service = await createSaveTextsForTrainingService.execute({ textData, chatbotId });
      // await initializeNewAIChatSession();

      return res.status(201).json(service);
    } catch (error) {
      next(error);
    }
  }
}

export { SaveTextsForTraningController };
