import { Router } from "express";
import multer from "multer";

import { SaveNewChatbotController } from "./controllers/chatbase/chatbot/SaveNewChatbotController.js";
import { SaveFilesForTrainingController } from "./controllers/chatbase/chatbot/SaveFilesForTrainingController.js";
import { SaveTextsForTraningController } from "./controllers/chatbase/chatbot/SaveTextsForTrainingController.js";

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
import { UpdateChatbotWithFilesController } from "./controllers/chatbase/chatbot/UpdateChatbotWithFilesController.js";
import { UpdateChatbotWithTextController } from "./controllers/chatbase/chatbot/UpdateChatbotWithTextController.js";
import { DeleteChatbotController } from "./controllers/chatbase/chatbot/DeleteChatbotController.js";
import { SaveNewAssistantController } from "./controllers/chatbase/chatbot/SaveNewAssistantController.js";
import { SaveNewAssistantForRetrainingController } from "./controllers/chatbase/chatbot/SaveNewAssistantForRetrainingController.js";

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
routes.post("/chatbot/new", new SaveNewChatbotController().store);
routes.post("/chatbot/files-for-training/:id", multer_config.array("files"), new SaveFilesForTrainingController().store);
routes.post("/chatbot/texts-for-training/:id", new SaveTextsForTraningController().store);
routes.delete("/chatbot/delete/:id", new DeleteChatbotController().delete);
routes.post("/chatbot/new/assistant/:id", new SaveNewAssistantController().store);
routes.post("/chatbot/retrain-assistant/:id", new SaveNewAssistantForRetrainingController().store);

routes.get("/chatbots/:id", new GetChatbotsController().index);
routes.get("/chatbot/:id", new GetUniqueChatbotController().show);
routes.get("/chatbot/files-for-training/:id", new GetTrainedFilesController().index);
routes.get("/chatbot/texts-for-training/:id", new GetTrainedTextsController().index);
routes.post("/chatbot/files-retraining/:id", multer_config.array("files-retraining"),  new UpdateChatbotWithFilesController().store);
routes.post("/chatbot/texts-retraining/:id", new UpdateChatbotWithTextController().store);

routes.post("/chatbot/chat-session/:id", new ChatSessionFlowController().store);
routes.post("/chatbot/save-chatflow/:id", new SaveChatFlowController().store);
routes.get("/chatbot/chat-history/:id", new GetChatHistoryController().index);
routes.delete("/chatbot/chat-history/:id", new DeleteChatHistoryController().delete);

routes.post("/chatbot/wppconnection/:id", new StartNewConnectSessionController().store);

export default routes;
