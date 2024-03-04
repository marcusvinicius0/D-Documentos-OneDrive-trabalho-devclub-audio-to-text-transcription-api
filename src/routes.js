import { Router } from "express";
import multer from "multer";
import path from "path";
import { speechToText } from "./edenai/speech-to-text.js";
import { SaveTrancribedTexts } from "./controllers/chatbase/SaveTranscribedTextsController.js";
import { GetTranscribedTexts } from "./controllers/chatbase/GetTranscribedTextsController.js";

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

routes.post("/transcribed-text", new SaveTrancribedTexts().store);
routes.get("/transcribed-text/:id", new GetTranscribedTexts().index);

export default routes;
