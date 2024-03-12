import { AppError } from "../../errors/app.error.js";
import { startNewWppConnectSession } from "../../service/wpp/index.js"


class StartNewConnectSessionController {
  async store(req, res, next) {
      try {
        const userSession = req.params.id;

        if (!userSession) {
          throw new AppError("Nenhuma credencial foi encontrada.", 401);
        }

        await startNewWppConnectSession((onQRCode) => {
          res.status(200).json(onQRCode)
        });

      } catch (error) {
        next(error)
      }
  }
}

export { StartNewConnectSessionController }