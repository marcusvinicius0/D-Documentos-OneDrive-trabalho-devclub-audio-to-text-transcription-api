-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_chatbotId_fkey";

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "chatbotId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_chatbotId_fkey" FOREIGN KEY ("chatbotId") REFERENCES "user-chatbot"("id") ON DELETE SET NULL ON UPDATE CASCADE;
