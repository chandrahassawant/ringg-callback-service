require("dotenv").config();
const axios = require("axios");

const API_KEY = process.env.RINGG_API_KEY;

async function getWorkspaceNumbers() {
  try {
    const res = await axios.get(
      "https://prod-api.ringg.ai/ca/api/v0/workspace/numbers",
      {
        headers: {
          "X-API-KEY": API_KEY
        }
      }
    );

    console.log("✅ Workspace Numbers Response:\n");
    console.log(JSON.stringify(res.data, null, 2));
    console.log(
      "\n👉 Copy the `id` field of the number you want to use and set it as RINGG_FROM_NUMBER_ID in .env"
    );
  } catch (err) {
    console.error("Error fetching workspace numbers:", err.response?.data || err.message);
  }
}

getWorkspaceNumbers();
