require("dotenv").config();
const express = require("express");
const cors = require("cors");

const callbackRoute = require("./routes/callback.route");

const app = express();

app.use(cors());
app.use(express.json());

// Simple health route (optional but useful)
app.get("/", (req, res) => {
  res.send("Ringg Callback Service is running");
});

// Routes
app.use("/", callbackRoute);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
