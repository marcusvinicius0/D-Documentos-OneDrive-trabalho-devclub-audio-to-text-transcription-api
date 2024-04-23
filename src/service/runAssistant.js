import OpenAI from "openai";
import dotenv from "dotenv";
import fs from "fs";
import prismaClient from "../prisma/connect.js";
import { AppError } from "../errors/app.error.js";

dotenv.config();

let assistantDetails;
const secretKey = process.env.OPENAI_KEY;
const openai = new OpenAI({ apiKey: secretKey });

export async function runAssistant(chatbot_id) {
  try {
    const assistantConfig = {
      name: "Dynamic bot",
      instructions:
        "I want you to act as a dynamic bot. You will receive instructions and texts for your training, so you need to adapt with these trainings. If the instructions and the texts you received for training is about being a general support, then you will be a general support based on the texts and instructions. And so on. If the questions received is not included in your training data, say exactly: 'Hmm, Eu não tenho certeza, consegue me perguntar de outra forma?'. Refuse to answer any question not about the info.",
      tools: [{ type: "retrieval" }],
      model: "gpt-3.5-turbo",
    };

    const assistant = await openai.beta.assistants.create(assistantConfig);
    assistantDetails = { assistantId: assistant.id, ...assistantConfig };

    const findChatbot = await prismaClient.chatbot.findFirst({
      where: {
        id: chatbot_id,
      },
      select: {
        id: true,
      },
    });

    if (!findChatbot) {
      throw new AppError(`Chatbot com o ID ${chatbot_id} não encontrado.`, 404);
    }

    const chatbotId = findChatbot.id || "";

    await prismaClient.chatbot.update({
      where: {
        id: chatbotId,
      },
      data: {
        assistantId: assistant.id,
      },
    });

    console.log(
      `Olá, Sou seu assistente pessoal. Você me deu deu essas instruções:\n${assistantDetails.instructions}`
    );

    const filepath = "./src/utils/chatbot-content.txt";

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
    console.error(error);
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

  const getAssistantId = await prismaClient.chatbot.findFirst({
    where: {
      id: chatbotId,
    },
    select: {
      assistantId: true,
    },
  });

  await openai.beta.threads.messages.create(getAssistantThreadId.threadId, {
    role: "user",
    content: currentMessage,
  });

  const run = await openai.beta.threads.runs.create(
    getAssistantThreadId.threadId,
    {
      assistant_id: getAssistantId.assistantId,
    }
  );

  let runStatus = await openai.beta.threads.runs.retrieve(
    getAssistantThreadId.threadId,
    run.id
  );

  while (runStatus.status !== "completed") {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    runStatus = await openai.beta.threads.runs.retrieve(
      getAssistantThreadId.threadId,
      run.id
    );

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
