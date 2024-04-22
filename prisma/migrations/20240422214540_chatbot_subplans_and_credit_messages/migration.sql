-- AlterTable
ALTER TABLE "user-chatbot" ADD COLUMN     "creditMessagesPerMonth" TEXT NOT NULL DEFAULT '0',
ADD COLUMN     "subscriptionPlans" JSONB[];
