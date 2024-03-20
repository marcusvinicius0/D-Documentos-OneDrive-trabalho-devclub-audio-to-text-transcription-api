/*
  Warnings:

  - You are about to drop the column `author` on the `user-chatbot` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[authorEmail]` on the table `user-chatbot` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `authorName` to the `user-chatbot` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user-chatbot" DROP COLUMN "author",
ADD COLUMN     "authorEmail" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "authorName" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "user-chatbot_authorEmail_key" ON "user-chatbot"("authorEmail");
