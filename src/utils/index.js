export function splitMessages(text) {
  const pattern =
    /(?:http[s]?:\/\/[^\s]+)|(?:www\.[^\s]+)|[^.?!]+(?:[.?!]+["']?|$)/g;
  const matches = text.match(pattern);
  return matches ?? [];
}

export async function sendMessagesWithDelay({
  messages,
  client,
  targetNumber,
}) {
  for (const [, msg] of messages.entries()) {
    const dynamicDelay = msg.length * 100;
    await new Promise((resolve) => setTimeout(resolve, dynamicDelay));
    client
      .sendText(targetNumber, msg.trimStart())
      .then((result) => {
      })
      .catch((error) => {
        console.error("Erro ao enviar mensagem:", error);
      });
  }
}
