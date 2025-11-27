require("dotenv").config();
const axios = require("axios");

const API_KEY = process.env.RINGG_API_KEY;

async function getMeta() {
  try {
    // Get all assistants (optional – just for info)
    const agentsRes = await axios.get(
      "https://prod-api.ringg.ai/ca/api/v0/agent/all",
      {
        headers: { "X-API-KEY": API_KEY }
      }
    );

    console.log("✅ Assistants:");
    console.log(JSON.stringify(agentsRes.data, null, 2));

    // Get workspace numbers (we need id from here)
    const numbersRes = await axios.get(
      "https://prod-api.ringg.ai/ca/api/v0/workspace/numbers",
      {
        headers: { "X-API-KEY": API_KEY }
      }
    );

    console.log("\n✅ Workspace Numbers:");
    console.log(JSON.stringify(numbersRes.data, null, 2));
    console.log("\nPick the 'id' of the number you want, and put it in RINGG_FROM_NUMBER_ID in .env");
  } catch (err) {
    console.error("Error:", err.response?.data || err.message);
  }
}

getMeta();
