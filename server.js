// server.js
const express = require('express');
const cors = require('cors');
const twilio = require('twilio');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;  // Using 5000 to avoid conflicts with React's 3000

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Twilio configuration
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const apiKey = process.env.TWILIO_API_KEY;
const apiSecret = process.env.TWILIO_API_SECRET;

// Generate Access Token
app.get('/token', (req, res) => { 
  // Get identity from query string
  const identity = req.query.identity || 'user';

  const AccessToken = twilio.jwt.AccessToken;
  const ChatGrant = AccessToken.ChatGrant;

  // Create an access token
  const token = new AccessToken(
    accountSid,
    apiKey,
    apiSecret,
    { identity: identity }
  );

  // Create a Conversations grant and add it to the token
  const conversationsGrant = new ChatGrant({
    serviceSid: process.env.TWILIO_CONVERSATIONS_SERVICE_SID,
  });
  
  token.addGrant(conversationsGrant);

  // Return the token as a simple text response
  res.send(token.toJwt());
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});