// src/controllers/ringgWebhook.controller.js
exports.handleRinggWebhook = async (req, res) => {
  try {
    const event = req.body;

    console.log("🔔 Ringg Webhook Received:", event.event_type);
    console.log("Call ID:", event.call_id);
    console.log("Status:", event.status);
    console.log("To:", event.to_number, "From:", event.from_number);
    console.log("Custom Args:", event.custom_args_values);

    switch (event.event_type) {
      case "call_completed":
        console.log("✅ Call completed, duration:", event.call_duration);
        // TODO: save in DB / Google Sheet as lead history
        break;

      case "recording_completed":
        console.log("🎧 Recording URL:", event.recording_url);
        // TODO: save recording_url for later listening
        break;

      case "platform_analysis_completed":
        console.log("📊 Summary:", event.analysis_data.summary);
        console.log("Classification:", event.analysis_data.classification);
        // TODO: mark lead as qualified / not qualified, etc.
        break;

      case "client_analysis_completed":
        console.log("⭐ Lead quality:", event.analysis_data.lead_quality);
        // TODO: use this for prioritising leads
        break;

      default:
        console.log("ℹ️ Unknown event type:", event.event_type);
    }

    // Always acknowledge
    return res.status(200).json({ received: true });
  } catch (err) {
    console.error("Ringg webhook error:", err);
    return res.status(500).json({ received: false });
  }
};
