const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const TOKEN = process.env.WHAPI_TOKEN; 
const BASE_URL = "https://gate.whapi.cloud";

let users = {};

app.post("/webhook", async (req, res) => {
  const msg = req.body?.messages?.[0]?.text?.body?.trim();
  const from = req.body?.messages?.[0]?.from;

  if (!msg || !from) return res.sendStatus(200);
  const text = msg.toLowerCase();

  if (!users[from]) users[from] = { step: "start" };
  const user = users[from];

  try {
    if (text === "help" || text === "agent" || text === "4pm") {
      await send(from, `🙋‍♀️ *Telenor Live Support*\nHamari live support team rozana shaam *4:00 PM se 10:00 PM* tak active hoti hai.`);
      return res.sendStatus(200);
    }

    if (text === "start" || text === "hi" || text === "hello") {
      user.step = "terms";
      await send(from, `👋 Welcome to Telenor 5G\n\n📄 Terms & Conditions\n1️⃣ Accept\n2️⃣ Exit`);
      return res.sendStatus(200);
    }

    if (user.step === "terms") {
      if (text === "1") {
        user.step = "main_menu";
        await sendMainLayout(from);
      } else {
        await send(from, "❌ Exited. Dobara shuru karne ke liye *Hi* likhein.");
        user.step = "start";
      }
      return res.sendStatus(200);
    }

    if (text === "0") {
      user.step = "main_menu";
      await sendMainLayout(from);
      return res.sendStatus(200);
    }

    if (user.step === "main_menu") {
      if (text === "1") {
        user.step = "subscribe_menu";
        await send(from, `📦 Subscribe Packages\n\n1️⃣ Monthly Offers\n2️⃣ Weekly Offers\n3️⃣ Daily Offers\n---\n0️⃣ Back`);
      } else if (text === "2") {
        user.step = "order_sim_menu";
        await send(from, `🆔 *Order New SIM*\n\n1️⃣ Pre-paid SIM (Rs. 300)\n2️⃣ Post-paid SIM (Rs. 750)\n---\n0️⃣ Back`);
      } else if (text === "3") {
        user.step = "replace_sim_menu";
        await send(from, `🔄 *Replace a SIM*\n\n1️⃣ SIM Lost / Stolen\n2️⃣ SIM Damaged\n---\n0️⃣ Back`);
      }
      return res.sendStatus(200);
    }

    await send(from, "👋 Welcome! Menu dekhne ke liye *Hi* likhein.");
    res.sendStatus(200);

  } catch (e) {
    console.log("Error:", e.message);
    res.sendStatus(500);
  }
});

async function sendMainLayout(from) {
  await send(from, `👋 Main Menu\n\n1️⃣ Subscribe Packages\n2️⃣ Order a New SIM\n3️⃣ Replace a SIM`);
}

async function send(to, body) {
  if (!TOKEN) {
    console.log("Error: WHAPI_TOKEN missing!");
    return;
  }
  try {
    await axios.post(`${BASE_URL}/messages/text`, { to, body }, {
      headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" }
    });
  } catch (error) {
    console.log("Send Error:", error.message);
  }
}

// Railway server listen 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
