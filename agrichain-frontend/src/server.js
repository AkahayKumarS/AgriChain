const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const twilio = require("twilio");

const app = express();
const port = 3001; // Ensure this matches the frontend fetch URL

// Twilio configuration
const accountSid = process.env.REACT_APP_SID;
const authToken = process.env.REACT_APP_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

// Enable CORS for all routes
app.use(cors());

app.use(bodyParser.json());

app.post("/send-sms", (req, res) => {
  const { to, message } = req.body;

  client.messages
    .create({
      body: message,
      from: "+13204416065",
      to: to,
    })
    .then((message) => res.json({ success: true, messageSid: message.sid }))
    .catch((error) =>
      res.status(500).json({ success: false, error: error.message })
    );
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
