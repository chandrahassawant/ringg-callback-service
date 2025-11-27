const axios = require("axios");

exports.triggerCallback = async (req, res) => {
  try {
    const phone = req.query.phone;
    const name = req.query.name || "Customer";

    if (!phone) {
      return res.status(400).send("❌ Phone number missing");
    }

    const formattedPhone = phone.startsWith("+") ? phone : `+${phone}`;

    const payload = {
      name: name,
      mobile_number: formattedPhone,
      agent_id: process.env.RINGG_AGENT_ID,
      from_number_id: process.env.RINGG_FROM_NUMBER_ID,
      custom_args_values: {
        callee_name: name,
        mobile_number: formattedPhone
      }
    };

    await axios.post(process.env.RINGG_OUTBOUND_URL, payload, {
      headers: {
        "X-API-KEY": process.env.RINGG_API_KEY,
        "Content-Type": "application/json"
      }
    });

    return res.send(`
      <!DOCTYPE html>
      <html>
        <head><meta charset="utf-8"><title>Call Scheduled</title></head>
        <body style="font-family: Arial; text-align:center; margin-top:60px;">
          <h2>✅ Thank you!</h2>
          <p>Our AI assistant will call you shortly on:</p>
          <h3>${formattedPhone}</h3>
        </body>
      </html>
    `);
  } catch (error) {
    console.error(
      "Error triggering Ringg AI call:",
      error.response?.data || error.message
    );

    return res.status(500).send(`
      <h2>⚠️ Something went wrong</h2>
      <pre>${JSON.stringify(error.response?.data || {}, null, 2)}</pre>
    `);
  }
};
