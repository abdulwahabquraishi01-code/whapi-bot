import axios from "axios";

const TOKEN = process.env.TOKEN;
const BASE_URL = "https://gate.whapi.cloud";

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(200).send("OK");
  }

  const msg = req.body?.messages?.[0]?.text?.body;
  const from = req.body?.messages?.[0]?.from;

  if (!msg || !from) {
    return res.status(200).end();
  }

  let reply = "❌ Invalid Option";

  if (msg.toLowerCase() === "start") {
    reply = `👋 Welcome to Telenor 5G
1️⃣ Subscribe Packages
2️⃣ Order SIM`;
  }

  await axios.post(
    `${BASE_URL}/messages/text`,
    {
      to: from,
      body: reply
    },
    {
      headers: {
        Authorization: `Bearer ${TOKEN}`
      }
    }
  );

  res.status(200).json({ success: true });
}
