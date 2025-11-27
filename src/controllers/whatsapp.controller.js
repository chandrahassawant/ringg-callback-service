const axios = require("axios");

exports.whatsappWebhook = async (req, res) => {
  try {
    const body = req.body;

    console.log("📩 Incoming WhatsApp Webhook:");
    console.log(JSON.stringify(body, null, 2));

    // ===== 1. Try to extract phone & name (generic patterns) =====

    // Example for Meta Cloud style body:
    const entry = body.entry?.[0];
    const change = entry?.changes?.[0]?.value;

    const msg = change?.messages?.[0];
    const contact = change?.contacts?.[0];

    // WhatsApp number (wa_id or from)
    const fromNumber =
      msg?.from ||
      contact?.wa_id ||
      body.from || // some BSPs send "from" at root
      null;

    const name =
      contact?.profile?.name ||
      contact?.profile?.full_name ||
      body.profile?.name ||
      "Customer";

    if (!fromNumber) {
      console.log("⚠️ Could not detect fromNumber in webhook payload");
      return res.status(200).json({ status: "ignored_no_number" });
    }

    // ===== 2. Detect which button was clicked =====

    // For interactive reply button (Meta Cloud API style)
    const buttonId =
      msg?.interactive?.button_reply?.id ||
      msg?.button?.payload || // some providers use this
      null;

    console.log("🔘 Button ID/Payload:", buttonId);

    // We only act when the specific callback button is pressed
    // Configure your template so the button's ID / payload = "CALLBACK_REQUEST"
    if (buttonId !== "CALLBACK_REQUEST") {
      return res.status(200).json({ status: "ignored_other_event" });
    }

    // ===== 3. Format phone as +E.164 =====
    const formattedPhone = fromNumber.startsWith("+")
      ? fromNumber
      : `+${fromNumber}`;

    console.log("☎ Triggering Ringg call for:", formattedPhone);

    // ===== 4. Trigger Ringg Outbound Call =====
    const payloadRingg = {
      name,
      mobile_number: formattedPhone,
      agent_id: process.env.RINGG_AGENT_ID,
      from_number_id: process.env.RINGG_FROM_NUMBER_ID,
      custom_args_values: {
        callee_name: name,
        whatsapp_number: formattedPhone,
        source: "WhatsApp_Callback_Button"
      }
    };

    await axios.post(process.env.RINGG_OUTBOUND_URL, payloadRingg, {
      headers: {
        "X-API-KEY": process.env.RINGG_API_KEY,
        "Content-Type": "application/json"
      }
    });

    console.log("✅ Ringg call triggered successfully");

    // Respond fast so WhatsApp/BSP doesn’t retry
    return res.status(200).json({ status: "call_triggered" });
  } catch (err) {
    console.error(
      "❌ WhatsApp webhook error:",
      err.response?.data || err.message
    );
    return res.status(500).json({ status: "error" });
  }
};
