import { DeleteChatHistoryService } from "../database/services/chatbase/DeleteChatHistoryService.js";
import { GetChatHistoryService } from "../database/services/chatbase/GetChatHistoryService.js";
import { GetChatbotsService } from "../database/services/chatbase/GetChatbotsService.js";
import { GetTrainedFilesService } from "../database/services/chatbase/GetTrainedFilesService.js";
import { GetTrainedTextsService } from "../database/services/chatbase/GetTrainedTextsService.js";
import { GetUniqueChatbotService } from "../database/services/chatbase/GetUniqueChatbotService.js";
import { SaveFilesForTrainingService } from "../database/services/chatbase/SaveFilesForTrainingService.js";
import { SaveNewChatbotService } from "../database/services/chatbase/SaveNewChatbotService.js";
import { SaveOrCreateChatFlowService } from "../database/services/chatbase/SaveOrCreateChatFlowService.js";
import { SaveTextsForTrainingService } from "../database/services/chatbase/SaveTextsForTrainingService.js";
import { TrainChatbotService } from "../database/services/chatbase/TrainChatbotService.js";

export const createTrainChatbotService = new TrainChatbotService();

export const createSaveNewChatbotService = new SaveNewChatbotService();
export const createSaveFilesForTrainingService = new SaveFilesForTrainingService();
export const createSaveTextsForTrainingService = new SaveTextsForTrainingService();

export const createSaveOrCreateChatFlowService = new SaveOrCreateChatFlowService();
export const createGetChatHistoryService = new GetChatHistoryService();
export const createDeleteChatHistoryService = new DeleteChatHistoryService();
export const createGetChatbotsService = new GetChatbotsService();
export const createGetUniqueChatbotService = new GetUniqueChatbotService();
export const createGetTrainedFilesService = new GetTrainedFilesService();
export const createGetTrainedTextsService = new GetTrainedTextsService();