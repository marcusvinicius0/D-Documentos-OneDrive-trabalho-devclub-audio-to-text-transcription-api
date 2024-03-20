/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `user-chatbot` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "user-chatbot_slug_key" ON "user-chatbot"("slug");
