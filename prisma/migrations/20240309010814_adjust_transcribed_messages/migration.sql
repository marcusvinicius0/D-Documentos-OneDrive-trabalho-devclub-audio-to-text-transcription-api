-- AlterTable
ALTER TABLE "transcribed-messages" ADD COLUMN     "fileName" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "messageLength" INTEGER NOT NULL DEFAULT 0;
