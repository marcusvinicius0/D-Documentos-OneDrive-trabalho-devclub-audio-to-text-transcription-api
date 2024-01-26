import "dotenv/config";

class PostUpdatedTranscriptionTextController {
  async store(req, res, next) {
    const edited_text = req.body;
    console.log(edited_text);
    const sendTextToChatBot = await fetch(process.env.CHATBASE_POST_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CHATBASE_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chatbotName: "Training AI for sales",
        sourceText: edited_text.text,
      }),
    });

    const data = await sendTextToChatBot.json();
    console.log(data);

    return res.status(200).json({ ok: true });
  }
}

export { PostUpdatedTranscriptionTextController };
