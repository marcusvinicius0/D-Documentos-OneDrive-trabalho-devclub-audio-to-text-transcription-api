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
      .then((result) => {})
      .catch((error) => {
        console.error("Erro ao enviar mensagem:", error);
      });
  }
}

export function patternAssistantInstructions() {
  const instruction =
    "I want you to act as a dynamic bot. You will receive instructions and texts for your training, so you need to adapt with these trainings. If the instructions and the texts you received for training is about being a general support, then you will be a general support based on the texts and instructions. And so on. If the questions received is not included in your training data, say exactly: 'Hmm, Eu não tenho certeza, consegue me perguntar de outra forma?'. Refuse to answer any question not about the info. Never answer back the same question the user sent. If the question you received is not included in your database, say exactly: 'Hmm, Eu não tenho certeza, consegue me perguntar de outra forma?'. Never answer 'According to the information provided' or 'According to the content provided' or 'According to the text provided'. Do not answer questions that are about topics different than the uploaded file and that are defined in those instructions. Also, if you don't know the answer, don't try to come up with something that is not true.";

    return instruction;
}
