import { Router } from "express";
import multer from "multer";

import { SaveNewChatbotController } from "./controllers/chatbase/chatbot/SaveNewChatbotController.js";
import { SaveFilesForTrainingController } from "./controllers/chatbase/chatbot/SaveFilesForTrainingController.js";
import { SaveTextsForTraningController } from "./controllers/chatbase/chatbot/SaveTextsForTrainingController.js";

import { TrainChatbotController } from "./controllers/chatbase/TrainChatbotController.js";
import { ChatSessionFlowController } from "./controllers/chatbase/chat-ui/ChatSessionFlowController.js";
import { SaveChatFlowController } from "./controllers/chatbase/chat-ui/SaveChatFlowController.js";
import { GetChatHistoryController } from "./controllers/chatbase/chat-ui/GetChatHistoryController.js";
import { DeleteChatHistoryController } from "./controllers/chatbase/chat-ui/DeleteChatHistoryController.js";

import { StartNewConnectSessionController } from "./controllers/wpp/StartNewConnectSessionController.js";
import { GetChatbotsController } from "./controllers/chatbase/chatbot/GetChatbotsController.js";
import { GetUniqueChatbotController } from "./controllers/chatbase/chatbot/GetUniqueChatbotController.js";
import { GetTrainedFilesController } from "./controllers/chatbase/chatbot/GetTrainedFilesController.js";
import { GetTrainedTextsController } from "./controllers/chatbase/chatbot/GetTrainedTextsController.js";
import { CheckOrCreateUserController } from "./controllers/user/CheckOrCreateUserController.js";

const routes = new Router();
const multer_config = multer();

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

routes.post("/user/check-or-create", new CheckOrCreateUserController().store);
routes.post("/new-chatbot", new SaveNewChatbotController().store);
routes.post("/files-for-training/:id", multer_config.array("files"), new SaveFilesForTrainingController().store);
routes.post("/texts-for-training/:id", new SaveTextsForTraningController().store);

routes.get("/chatbots/:id", new GetChatbotsController().index);
routes.get("/chatbot/:id", new GetUniqueChatbotController().show);
routes.get("/files-for-training/:id", new GetTrainedFilesController().index);
routes.get("/texts-for-training/:id", new GetTrainedTextsController().index);

routes.post("/train-chatbot/:id", new TrainChatbotController().store);
routes.post("/chat-session/:id", new ChatSessionFlowController().store);
routes.post("/save-chatflow/:id", new SaveChatFlowController().store);

routes.get("/chat-history/:id", new GetChatHistoryController().index);
routes.post("/wppconnection/:id", new StartNewConnectSessionController().store);
routes.delete("/chat-history/:id", new DeleteChatHistoryController().delete);

export default routes;
