import { AppError } from "../../errors/app.error.js";
import { startNewWppConnectSession } from "../../service/wpp/index.js";

class StartNewConnectSessionController {
  async store(req, res, next) {
    try {
      const userSession = req.params.id;
      const { chatbotId } = req.body;

      if (!userSession) {
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
