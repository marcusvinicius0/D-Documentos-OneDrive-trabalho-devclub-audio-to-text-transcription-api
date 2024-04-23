import { AppError } from "../../errors/app.error.js";
import { startNewWppConnectSession } from "../../service/wpp/index.js";

class StartNewConnectSessionController {
  async store(req, res, next) {
    try {
      const chatbotId = req.params.id;

      if (!chatbotId) {
        throw new AppError("Nenhuma credencial foi encontrada.", 401);
      }

      await startNewWppConnectSession(chatbotId, async (onQRCodeData) => {
        if (onQRCodeData) {
          return res.status(200).json(onQRCodeData);
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

export { StartNewConnectSessionController };
