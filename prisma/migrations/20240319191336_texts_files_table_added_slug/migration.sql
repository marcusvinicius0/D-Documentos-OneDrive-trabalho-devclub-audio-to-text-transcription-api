-- AlterTable
ALTER TABLE "files-for-bot-training" ADD COLUMN     "slug" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "texts-for-bot-training" ADD COLUMN     "slug" TEXT NOT NULL DEFAULT '';
