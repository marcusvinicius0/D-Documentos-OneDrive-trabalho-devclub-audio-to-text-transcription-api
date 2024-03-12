import { DeleteChatHistoryService } from "../database/services/chatbase/DeleteChatHistoryService.js";
import { GetChatHistoryService } from "../database/services/chatbase/GetChatHistoryService.js";
import { GetFiledTranscribedTextsService } from "../database/services/chatbase/GetFiledTranscribedTextsService.js";
import { GetTranscribedTextsService } from "../database/services/chatbase/GetTranscribedTextsService.js";
import { SaveOrCreateChatFlowService } from "../database/services/chatbase/SaveOrCreateChatFlowService.js";
import { SaveTranscribedTextsService } from "../database/services/chatbase/SaveTranscribedTextsService.js";
import { TrainChatbotService } from "../database/services/chatbase/TrainChatbotService.js";

export const createSaveTranscribedTextsService = new SaveTranscribedTextsService();
export const createGetTranscribedTextsService = new GetTranscribedTextsService();
export const createTrainChatbotService = new TrainChatbotService();
export const createSaveOrCreateChatFlowService = new SaveOrCreateChatFlowService();
export const createGetChatHistoryService = new GetChatHistoryService();
export const createGetFiledTranscribedTextsService = new GetFiledTranscribedTextsService();
export const createDeleteChatHistoryService = new DeleteChatHistoryService();