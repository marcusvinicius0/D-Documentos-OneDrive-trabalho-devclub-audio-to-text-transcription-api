import axios from "axios";
import "dotenv/config";

import FormData from "form-data";

let apiKey = process.env.EDEN_API_KEY;

export const speechToTextEdenAI = async (files) => {
  const transcriptions = await Promise.all(
    files.map(async (file) => {
      const form = new FormData();
      form.append("providers", "openai");
      form.append("file", file.buffer, file.originalname);
      form.append("language", "pt-BR");

      const options = {
        method: "POST",
        url: process.env.EDEN_API_URL,
        headers: {
          Authorization: `Bearer ${apiKey}`,
          ...form.getHeaders(),
        },
        data: form,
      };

      try {
        const response = await axios.request(options);
        return {
          filename: file.originalname,
          transcription: response.data,
        };
      } catch (error) {
        console.error("Error ao realizar transcrições: ", error);
        return {
          filename: file.originalname,
          error: "Failed to transcribe",
        };
      }
    })
  );

  return transcriptions;
};
