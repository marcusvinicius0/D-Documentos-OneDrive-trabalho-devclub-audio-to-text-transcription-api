/*
  Warnings:

  - The `creditMessagesPerMonth` column on the `user-chatbot` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "user-chatbot" DROP COLUMN "creditMessagesPerMonth",
ADD COLUMN     "creditMessagesPerMonth" INTEGER NOT NULL DEFAULT 0;
