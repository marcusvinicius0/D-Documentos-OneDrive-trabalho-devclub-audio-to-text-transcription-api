-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "chatbotId" TEXT NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_id_key" ON "user"("id");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_chatbotId_fkey" FOREIGN KEY ("chatbotId") REFERENCES "user-chatbot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
