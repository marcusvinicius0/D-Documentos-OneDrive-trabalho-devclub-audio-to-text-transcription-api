import OpenAI from "openai";
import dotenv from "dotenv";
import fs from "fs";

import prismaClient from "../prisma/connect.js";
import { AppError } from "../errors/app.error.js";
import { patternAssistantInstructions } from "../utils/index.js";

dotenv.config();

let assistantDetails;
const secretKey = process.env.OPENAI_KEY;
const openai = new OpenAI({ apiKey: secretKey, defaultHeaders: {"OpenAI-Beta": "assistants=v1" }});

let filepath = "./src/utils/chatbot-content.txt";

export async function runAssistant(chatbot) {
  try {
    let instructions = chatbot.instructions
      ? chatbot.instructions
      : patternAssistantInstructions();

    const assistantConfigForTrain = {
      name: chatbot.name,
      instructions: instructions,
      tools: [{ type: "retrieval" }],
      model: "gpt-3.5-turbo",
      temperature: chatbot.temperature,
    };

    const assistant = await openai.beta.assistants.create(
      assistantConfigForTrain
    );
    assistantDetails = {
      assistantId: assistant.id,
      ...assistantConfigForTrain,
    };

    const findChatbot = await prismaClient.chatbot.findFirst({
      where: {
        id: chatbot.id,
      },
      select: {
        id: true,
      },
    });

    if (!findChatbot) {
      throw new AppError("Não foi possível encontrar o chatbot.", 404);
    }

    const chatbotId = findChatbot.id || "";

    await prismaClient.chatbot.update({
      where: {
        id: chatbotId,
      },
      data: {
        assistantId: assistant.id,
        instructions: instructions,
      },
    });

    console.log(
      `Olá, Sou seu assistente pessoal. Você me deu deu essas instruções:\n${assistantDetails.instructions}`
    );

    const file = await openai.files.create({
      file: fs.createReadStream(filepath),
      purpose: "assistants",
    });

    fs.writeFileSync(filepath, "");

    let existingFileIds = assistantDetails.files_ids || [];

    await openai.beta.assistants.update(assistantDetails.assistantId, {
      file_ids: [...existingFileIds, file.id],
    });

    assistantDetails.files_ids = [...existingFileIds, file.id];

    console.log(
      "O arquivo foi carregado e adicionado com sucesso ao assistente\n"
    );

    const thread = await openai.beta.threads.create();

    await prismaClient.chatbot.update({
      where: {
        id: chatbotId,
      },
      data: {
        threadId: thread.id,
      },
    });
  } catch (error) {
    console.error("Erro ao configurar e criar assistente: ", error);
  }
}

export async function startChatWithAssistant({ currentMessage, chatbotId }) {
  const getAssistantThreadId = await prismaClient.chatbot.findFirst({
    where: {
      id: chatbotId,
    },
    select: {
      threadId: true,
    },
  });

  const threadId = getAssistantThreadId.threadId;

  const getAssistantId = await prismaClient.chatbot.findFirst({
    where: {
      id: chatbotId,
    },
    select: {
      assistantId: true,
    },
  });

  await openai.beta.threads.messages.create(threadId, {
    role: "user",
    content: currentMessage,
  });

  const run = await openai.beta.threads.runs
    .create(threadId, {
      assistant_id: getAssistantId.assistantId,
    })


    let runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);

  while (runStatus.status !== "completed") {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);

    if (["failed", "cancelled", "expired"].includes(runStatus.status)) {
      console.log(
        `Status do run é '${runStatus.status}'. Incapaz de completar a requisição.`
      );
      break;
    }
  }

  const messages = await openai.beta.threads.messages.list(
    getAssistantThreadId.threadId
  );

  const lastMessageForRun = messages.data
    .filter(
      (message) => message.run_id === run.id && message.role === "assistant"
    )
    .pop();

  if (lastMessageForRun) {
    console.log(`${lastMessageForRun.content[0].text.value} \n`);
  } else if (!["failed", "cancelled", "expired"].includes(runStatus.status)) {
    console.log("Nenhuma resposta recebida do assistente.");
  }

  const response = messages.data[0].content[0].text.value;

  let pattern = /【\d+(:\d+)?(†fonte|†source)】/g;

  let cleanedText = response.replace(pattern, "", response);

  return cleanedText;
}

export async function runAssistantForRetraining(chatId) {
  try {
    const findChatbot = await prismaClient.chatbot.findFirst({
      where: {
        id: chatId,
      },
      select: {
        id: true,
        assistantId: true,
        threadId: true,
        name: true,
        instructions: true,
        temperature: true,
        Files: true,
        Texts: true,
        updatedAt: true,
        lastTrainedAt: true,
      },
    });

    if (!findChatbot) {
      throw new AppError("Não foi possível encontrar o chatbot.", 404);
    }
    const assistantConfigForRetrain = {
      name: findChatbot.name,
      instructions: findChatbot.instructions,
      tools: [{ type: "retrieval" }],
      model: "gpt-3.5-turbo",
      temperature: findChatbot.temperature,
    };

    const assistant = await openai.beta.assistants.create(
      assistantConfigForRetrain
    );
    assistantDetails = {
      assistantId: assistant.id,
      ...assistantConfigForRetrain,
    };

    const chatbotId = findChatbot.id;

    await prismaClient.chatbot.update({
      where: {
        id: chatbotId,
      },
      data: {
        assistantId: assistant.id,
        lastTrainedAt: new Date(),
      },
    });

    const files = findChatbot.Files.map((file) => file.message).join("\n");
    const texts = findChatbot.Texts.map((text) => text.text).join("\n");
    const combinedFileText = files + texts;

    fs.writeFileSync(filepath, JSON.stringify(combinedFileText, null, 2), {
      encoding: "utf-8",
    });

    const file = await openai.files.create({
      file: fs.createReadStream(filepath),
      purpose: "assistants",
    });

    fs.writeFileSync(filepath, "");

    let existingFileIds = assistantDetails.files_ids || [];

    await openai.beta.assistants.update(assistantDetails.assistantId, {
      file_ids: [...existingFileIds, file.id],
    });

    assistantDetails.files_ids = [...existingFileIds, file.id];

    console.log(
      "O arquivo foi carregado e adicionado com sucesso ao assistente\n"
    );

    const thread = await openai.beta.threads.create();

    await prismaClient.chatbot.update({
      where: {
        id: chatbotId,
      },
      data: {
        threadId: thread.id,
      },
    });
  } catch (error) {
    console.error("Erro ao configurar e criar assistente: ", error);
  }
}

export async function deleteAssistant(assistantId) {
  try {
    if (!assistantId) {
      throw new AppError("Nenhuma credencial foi encontrada.", 401);
    }

    const response = await openai.beta.assistants.del(assistantId);

    return response;
  } catch (error) {
    console.error("Erro ao deletar assistente: ", error);
  }
}
