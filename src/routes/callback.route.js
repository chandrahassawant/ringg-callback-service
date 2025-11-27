// D:\Ring AI\src\routes\callback.route.js
const express = require("express");
const router = express.Router();

const { triggerCallback } = require("../controllers/callback.controller");

// URL: GET /ringg-callback?phone=...&name=...
router.get("/ringg-callback", triggerCallback);

module.exports = router;
