import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

import fs from "node:fs";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });
const activeChats = new Map();

export const getOrCreateChatSession = (chatId) => {
  if (activeChats.has(chatId)) {
    const currentHistory = activeChats.get(chatId);

    return model.startChat({
      history: currentHistory,
    });
  }

  const currentDataForTraining = fs.readFileSync('./src/utils/chatbot-content.js', { encoding: 'utf-8' });

  const history = [
    {
      role: "user",
      parts: currentDataForTraining ?? "Olá",
    },
    {
      role: "model",
      parts: "Olá, certo!",
    },
  ];
  
  activeChats.set(chatId, history);
  return model.startChat({
    history,
  });
};

export const mainGoogle = async ({ currentUserMessage, chatId }) => {
  const chat = getOrCreateChatSession(chatId);
  const prompt = currentUserMessage;
  const result = await chat.sendMessage(prompt);
  const response = await result.response;
  const text = response.text();

  activeChats.set(chatId, [
    ...activeChats.get(chatId),
    {
      role: "user",
      parts: prompt,
    },
    {
      role: "model",
      parts: text,
    },
  ]);

  return text;
};
