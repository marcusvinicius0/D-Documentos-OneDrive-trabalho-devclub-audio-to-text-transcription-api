import { createSaveTranscribedTextsService } from "../../utils/services.js";

class SaveTrancribedTexts {
  async store(req, res, next) {
    try {
      const { messageTranscribed } = req.body;

      createSaveTranscribedTextsService;
      await createSaveTranscribedTextsService.execute({
        messageTranscribed,
      });

      return res
        .status(201)
        .json({ message: "Texto transcrito salvo com sucesso." });
    } catch (error) {
      next(error);
    }
  }
}

export { SaveTrancribedTexts };
