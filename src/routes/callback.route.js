const express = require("express");
const router = express.Router();

const { triggerCallback } = require("../controllers/callback.controller");
const { handleRinggWebhook } = require("../controllers/ringgWebhook.controller");

// Existing
router.get("/ringg-callback", triggerCallback);

// NEW: Ringg webhook listener
router.post("/ringg-webhook", handleRinggWebhook);

module.exports = router;
