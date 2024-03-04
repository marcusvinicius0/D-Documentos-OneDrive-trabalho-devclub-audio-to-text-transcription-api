-- CreateTable
CREATE TABLE "transcribed-messages" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "isFiled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transcribed-messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat-session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "isFiled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chat-session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chatbot-messages" (
    "id" TEXT NOT NULL,
    "chatSessionId" TEXT NOT NULL,
    "sender" JSONB[],
    "bot" JSONB[],
    "isFiled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chatbot-messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "transcribed-messages_id_key" ON "transcribed-messages"("id");

-- CreateIndex
CREATE UNIQUE INDEX "transcribed-messages_author_key" ON "transcribed-messages"("author");

-- CreateIndex
CREATE UNIQUE INDEX "chat-session_id_key" ON "chat-session"("id");

-- CreateIndex
CREATE UNIQUE INDEX "chat-session_userId_key" ON "chat-session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "chatbot-messages_id_key" ON "chatbot-messages"("id");

-- AddForeignKey
ALTER TABLE "chatbot-messages" ADD CONSTRAINT "chatbot-messages_chatSessionId_fkey" FOREIGN KEY ("chatSessionId") REFERENCES "chat-session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
