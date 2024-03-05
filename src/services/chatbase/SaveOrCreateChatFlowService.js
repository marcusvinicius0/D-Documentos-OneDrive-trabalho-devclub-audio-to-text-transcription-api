import prismaClient from "../../prisma/connect.js";

class SaveOrCreateChatFlowService {
  async execute({ latestMessages }) {
    const author = latestMessages[0];
    const bot = latestMessages[1];

    let isSessionActive = await prismaClient.chatSession.findFirst({
      where: {
        userId: author.email,
        isFiled: false,
      },
    });

    if (!isSessionActive) {
      await prismaClient.chatSession.create({
        data: {
          userId: author.email,
          isFiled: false,
        },
      });
    }

    const chat_session_id = isSessionActive.id;

    const saveChatFlow = await prismaClient.chatbotMessages.create({
      data: {
        chatSessionId: chat_session_id,
        sender: author,
        bot: bot,
        isFiled: false,
      },
    });

    return saveChatFlow;
  }
}

export { SaveOrCreateChatFlowService };
