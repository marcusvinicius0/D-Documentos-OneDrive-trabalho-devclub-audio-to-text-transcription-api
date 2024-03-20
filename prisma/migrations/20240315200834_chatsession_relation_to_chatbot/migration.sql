-- AlterTable
ALTER TABLE "chat-session" ADD COLUMN     "chatbotId" TEXT NOT NULL DEFAULT '';

-- AddForeignKey
ALTER TABLE "chat-session" ADD CONSTRAINT "chat-session_chatbotId_fkey" FOREIGN KEY ("chatbotId") REFERENCES "user-chatbot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
