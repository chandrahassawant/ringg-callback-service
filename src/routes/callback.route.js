const express = require("express");
const router = express.Router();

const { triggerCallback } = require("../controllers/callback.controller");
const { handleRinggWebhook } = require("../controllers/ringgWebhook.controller");
const { whatsappWebhook } = require("../controllers/whatsapp.controller");

// 1) Manual / URL-based trigger (what you're using now)
router.get("/ringg-callback", triggerCallback);

// 2) WhatsApp → your server → Ringg (auto callback via reply button)
router.post("/whatsapp-webhook", whatsappWebhook);

// 3) Ringg → your server (call status, transcript, etc.)
router.post("/ringg-webhook", handleRinggWebhook);

module.exports = router;
