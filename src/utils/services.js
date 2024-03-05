import { GetChatHistoryService } from "../services/chatbase/GetChatHistoryService.js";
import { GetFiledTranscribedTextsService } from "../services/chatbase/GetFiledTranscribedTextsService.js";
import { GetTranscribedTextsService } from "../services/chatbase/GetTranscribedTextsService.js";
import { SaveOrCreateChatFlowService } from "../services/chatbase/SaveOrCreateChatFlowService.js";
import { SaveTranscribedTextsService } from "../services/chatbase/SaveTranscribedTextsService.js";
import { TrainChatbotService } from "../services/chatbase/TrainChatbotService.js";

export const createSaveTranscribedTextsService = new SaveTranscribedTextsService();
export const createGetTranscribedTextsService = new GetTranscribedTextsService();
export const createTrainChatbotService = new TrainChatbotService();
export const createSaveOrCreateChatFlowService = new SaveOrCreateChatFlowService();
export const createGetChatHistoryService = new GetChatHistoryService();
export const createGetFiledTranscribedTextsService = new GetFiledTranscribedTextsService();