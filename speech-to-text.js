import axios from "axios";
import fs from "fs";
import "dotenv/config";

import FormData from "form-data";

export const speechToText = async (file) => {
  const apiKey = process.env.EDEN_API_KEY;

  const form = new FormData();
  form.append("providers", "openai");
  form.append("file", fs.createReadStream(file));
  form.append("language", "pt-BR");

  const options = {
    method: "POST",
    url: process.env.EDEN_API_URL,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "multipart/form-data; boundary=" + form.getBoundary(),
    },
    data: form,
  };

  const res = axios
    .request(options)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error(error);
    });

    return res;
};
