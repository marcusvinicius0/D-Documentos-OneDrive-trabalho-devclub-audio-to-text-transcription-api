import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

let assistant;
let openai = OpenAI;
const activeChats = new Map();

import fs from "node:fs";

export async function initializeNewAIChatSession(chatId) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY,
  });

  assistant = await openai.beta.assistants.retrieve(
    process.env.OPENAI_ASSISTANT
  );

  if (activeChats.has(chatId)) return;

  const fileDataPath = "./src/utils/chatbot-content.js";

  const currentDataForTraining = fs.readFileSync(fileDataPath, {
    encoding: "utf-8",
  });

  const thread = await openai.beta.threads.create({
    messages: [{ role: "user", content: currentDataForTraining }],
  });

  activeChats.set(chatId, thread);
}

export async function mainOpenAI({ currentMessage, chatId }) {
  const thread = activeChats.get(chatId);
  await openai.beta.threads.messages.create(thread.id, {
    role: "user",
    content: currentMessage,
  });

  const run = await openai.beta.threads.runs.create(thread.id, {
    assistant_id: assistant.id,
    instructions: assistant.instructions,
  });

  const messages = await checkRunStatus({ threadId: thread.id, runId: run.id });
  const responseAI = messages.data[0].content[0];
  return responseAI.text.value;
}

async function checkRunStatus({ threadId, runId }) {
  return await new Promise((resolve, _reject) => {
    const verify = async () => {
      const runStatus = await openai.beta.threads.runs.retrieve(
        threadId,
        runId
      );

      if (runStatus.status === "completed") {
        const messages = await openai.beta.threads.messages.list(threadId);
        resolve(messages);
      } else {
        console.log("Aguardando resposta da OpenAI...");
        setTimeout(verify, 3000);
      }
    };

    verify();
  });
}
