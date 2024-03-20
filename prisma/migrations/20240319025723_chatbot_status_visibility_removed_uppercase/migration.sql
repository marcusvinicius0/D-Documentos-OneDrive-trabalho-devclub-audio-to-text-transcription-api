/*
  Warnings:

  - The values [TREINADO,DESATIVADO] on the enum `ChatbotStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [PUBLICO,PRIVADO] on the enum `ChatbotVisibility` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ChatbotStatus_new" AS ENUM ('Treinado', 'Desativado');
ALTER TABLE "user-chatbot" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "user-chatbot" ALTER COLUMN "status" TYPE "ChatbotStatus_new" USING ("status"::text::"ChatbotStatus_new");
ALTER TYPE "ChatbotStatus" RENAME TO "ChatbotStatus_old";
ALTER TYPE "ChatbotStatus_new" RENAME TO "ChatbotStatus";
DROP TYPE "ChatbotStatus_old";
ALTER TABLE "user-chatbot" ALTER COLUMN "status" SET DEFAULT 'Treinado';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "ChatbotVisibility_new" AS ENUM ('Publico', 'Privado');
ALTER TABLE "user-chatbot" ALTER COLUMN "visibility" DROP DEFAULT;
ALTER TABLE "user-chatbot" ALTER COLUMN "visibility" TYPE "ChatbotVisibility_new" USING ("visibility"::text::"ChatbotVisibility_new");
ALTER TYPE "ChatbotVisibility" RENAME TO "ChatbotVisibility_old";
ALTER TYPE "ChatbotVisibility_new" RENAME TO "ChatbotVisibility";
DROP TYPE "ChatbotVisibility_old";
ALTER TABLE "user-chatbot" ALTER COLUMN "visibility" SET DEFAULT 'Publico';
COMMIT;

-- AlterTable
ALTER TABLE "user-chatbot" ALTER COLUMN "status" SET DEFAULT 'Treinado',
ALTER COLUMN "visibility" SET DEFAULT 'Publico';
