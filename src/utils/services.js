import { GetTranscribedTextsService } from "../services/chatbase/GetTranscribedTextsService.js";
import { SaveTranscribedTextsService } from "../services/chatbase/SaveTranscribedTextsService.js";

export const createSaveTranscribedTextsService = new SaveTranscribedTextsService();
export const createGetTranscribedTextsService = new GetTranscribedTextsService();