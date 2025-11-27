const axios = require("axios");

// In-memory store to avoid duplicate calls in a short time window
// NOTE: This resets when the server restarts, but is fine for now
const lastCallByNumber = {};
const COOLDOWN_MS = 60 * 1000; // 1 minute (adjust if needed)

exports.triggerCallback = async (req, res) => {
  try {
    const { phone, name } = req.query;

    if (!phone) {
      return res.status(400).json({ error: "phone is required" });
    }

    const formattedPhone = phone.startsWith("+") ? phone : `+${phone}`;
    const callerName = name || "Customer";

    const now = Date.now();
    const last = lastCallByNumber[formattedPhone];

    // 🔒 If we recently triggered a call for this number, skip it
    if (last && now - last < COOLDOWN_MS) {
      console.log(
        `⏱ Skipping duplicate call for ${formattedPhone} (cooldown active)`
      );
      return res.status(200).json({
        status: "duplicate_ignored",
        message: "Call already triggered recently. Please wait a moment."
      });
    }

    // Save timestamp BEFORE calling Ringg (to avoid race conditions)
    lastCallByNumber[formattedPhone] = now;

    const payloadRingg = {
      name: callerName,
      mobile_number: formattedPhone,
      agent_id: process.env.RINGG_AGENT_ID,
      from_number_id: process.env.RINGG_FROM_NUMBER_ID,
      custom_args_values: {
        callee_name: callerName,
        mobile_number: formattedPhone
      }
    };

    console.log("📞 Triggering Ringg outbound call:", payloadRingg);

    const response = await axios.post(
      process.env.RINGG_OUTBOUND_URL,
      payloadRingg,
      {
        headers: {
          "X-API-KEY": process.env.RINGG_API_KEY,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("✅ Ringg response:", response.data);

    return res.status(200).json({
      status: "call_triggered",
      ringg_response: response.data
    });
  } catch (err) {
    console.error(
      "❌ Error triggering Ringg AI call:",
      err.response?.data || err.message
    );
    return res.status(500).json({
      status: "error",
      message: "Failed to trigger call"
    });
  }
};
