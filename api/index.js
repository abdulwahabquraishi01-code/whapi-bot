const axios = require("axios");

const TOKEN = process.env.WHAPI_TOKEN;
const BASE_URL = "https://gate.whapi.cloud";

let users = {};

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(200).send("OK");
  }

  const msg = req.body?.messages?.[0]?.text?.body?.trim();
  const from = req.body?.messages?.[0]?.from;

  if (!msg || !from) return res.status(200).end();

  const text = msg.toLowerCase();

  if (!users[from]) {
    users[from] = { step: "start", order: {} };
  }

  const user = users[from];

  try {
    // START
    if (text === "start" || text === "hi") {
      user.step = "main_menu";

      await send(from,
`👋 Welcome to Telenor Bot

1️⃣ Subscribe Packages
2️⃣ Order SIM
3️⃣ Replace SIM`);

      return res.status(200).end();
    }

    // ORDER NAME
    if (text === "2" && user.step === "main_menu") {
      user.step = "order_name";

      await send(from, "📲 Enter your Name:");
      return res.status(200).end();
    }

    if (user.step === "order_name") {
      user.order.name = msg;
      user.step = "order_city";

      await send(from, "📍 Enter City:");
      return res.status(200).end();
    }

    if (user.step === "order_city") {
      user.order.city = msg;
      user.step = "order_confirm";

      await send(from,
`📋 Order Summary:

👤 ${user.order.name}
📍 ${user.order.city}

1️⃣ Confirm
2️⃣ Cancel`);

      return res.status(200).end();
    }

    // CONFIRM
    if (user.step === "order_confirm" && text === "1") {
      await send(from,
`✅ Order Accepted!
Your SIM will be delivered soon.`);

      user.order = {};
      user.step = "main_menu";

      return res.status(200).end();
    }

    // CANCEL
    if (user.step === "order_confirm" && text === "2") {
      user.order = {};
      user.step = "main_menu";

      await send(from, "❌ Order Cancelled");
      return res.status(200).end();
    }

    return res.status(200).end();

  } catch (e) {
    console.log(e.message);
    return res.status(500).end();
  }
};

// SEND FUNCTION
async function send(to, body) {
  await axios.post(
    `${BASE_URL}/messages/text`,
    { to, body },
    {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json"
      }
    }
  );
    }
const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Bot is running");
});

app.post("/webhook", (req, res) => {
  console.log(req.body);
  res.send("OK");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});

module.exports = async (req, res) => {
  return res.status(200).send("Webhook Working ✅");
};
