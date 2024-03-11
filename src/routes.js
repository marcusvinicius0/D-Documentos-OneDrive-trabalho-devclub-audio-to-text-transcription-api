import { Router } from "express";
import multer from "multer";
import path from "node:path";

import { speechToText } from "./service/edenai/speech-to-text.js";
import { SaveTrancribedTextsController } from "./controllers/chatbase/SaveTranscribedTextsController.js";
import { GetTranscribedTextsController } from "./controllers/chatbase/GetTranscribedTextsController.js";
import { TrainChatbotController } from "./controllers/chatbase/TrainChatbotController.js";
import { ChatSessionFlowController } from "./controllers/chatbase/ChatSessionFlowController.js";
import { SaveChatFlowController } from "./controllers/chatbase/SaveChatFlowController.js";
import { GetChatHistoryController } from "./controllers/chatbase/GetChatHistoryController.js";
import { GetFiledTranscribedTextsController } from "./controllers/chatbase/GetFiledTranscribedTextsController.js";
import { StartNewConnectSessionController } from "./controllers/wpp/StartNewConnectSessionController.js";

const routes = new Router();

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage, dest: "uploads/" });

routes.get("/", async (req, res, next) => {
  const healthCheck = {
    uptime: process.uptime(),
    responseTime: process.hrtime(),
    message: "OK",
    timestamp: Date.now(),
  };

  try {
    res.send(healthCheck);
  } catch (err) {
    healthCheck.message = err;
    return res.status(503).send();
  }
});

routes.post("/mp3file", upload.single("audio"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("Nenhum arquivo foi enviado.");
  }

  try {
    const filePath = req.file.path;
    const result = await speechToText(filePath);

    res.status(200).json({ message: "Arquivo transcrevido", data: result });
  } catch (error) {
    console.error("Erro na transcrição:", error);
    if (req.file && req.file.path) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      message: "Erro ao transcrever arquivo",
      error: error.toString(),
    });
  }
});
routes.post("/transcribed-text", new SaveTrancribedTextsController().store);
routes.get("/transcribed-text/:id", new GetTranscribedTextsController().index);
routes.get("/filed-transcribed-text/:id", new GetFiledTranscribedTextsController().index);

routes.post("/train-chatbot/:id", new TrainChatbotController().store);
routes.post("/chat-session/:id", new ChatSessionFlowController().store);
routes.post("/save-chatflow", new SaveChatFlowController().store);

routes.get("/chat-history/:id", new GetChatHistoryController().index);
routes.post("/wppconnection/:id", new StartNewConnectSessionController().store);

export default routes;
