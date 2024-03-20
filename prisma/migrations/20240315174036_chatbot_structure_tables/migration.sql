/*
  Warnings:

  - You are about to drop the `transcribed-messages` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ChatbotStatus" AS ENUM ('TREINADO', 'DESATIVADO');

-- CreateEnum
CREATE TYPE "ChatbotVisibility" AS ENUM ('PUBLICO', 'PRIVADO');

-- DropTable
DROP TABLE "transcribed-messages";

-- CreateTable
CREATE TABLE "user-chatbot" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "status" "ChatbotStatus" NOT NULL DEFAULT 'TREINADO',
    "visibility" "ChatbotVisibility" NOT NULL DEFAULT 'PUBLICO',
    "lastTrainedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "model" TEXT NOT NULL DEFAULT '',
    "imageUrl" TEXT DEFAULT '',
    "author" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user-chatbot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "files-for-bot-training" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "fileName" TEXT NOT NULL DEFAULT '',
    "messageLength" INTEGER NOT NULL DEFAULT 0,
    "lastModified" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isFileTrained" BOOLEAN NOT NULL DEFAULT false,
    "chatbotId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "files-for-bot-training_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "texts-for-bot-training" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "isTextTrained" BOOLEAN NOT NULL DEFAULT false,
    "textLength" INTEGER NOT NULL DEFAULT 0,
    "chatbotId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "texts-for-bot-training_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user-chatbot_id_key" ON "user-chatbot"("id");

-- CreateIndex
CREATE UNIQUE INDEX "files-for-bot-training_id_key" ON "files-for-bot-training"("id");

-- CreateIndex
CREATE UNIQUE INDEX "texts-for-bot-training_id_key" ON "texts-for-bot-training"("id");

-- AddForeignKey
ALTER TABLE "files-for-bot-training" ADD CONSTRAINT "files-for-bot-training_chatbotId_fkey" FOREIGN KEY ("chatbotId") REFERENCES "user-chatbot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "texts-for-bot-training" ADD CONSTRAINT "texts-for-bot-training_chatbotId_fkey" FOREIGN KEY ("chatbotId") REFERENCES "user-chatbot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
