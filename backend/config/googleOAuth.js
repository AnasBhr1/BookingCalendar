const { google } = require('googleapis');
const dotenv = require('dotenv');

dotenv.config();

// Configure OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URL
);

// Generate a URL for user to get authorization
const getAuthUrl = () => {
  const scopes = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events'
  ];

  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent'
  });
};

// Exchange authorization code for tokens
const getTokens = async (code) => {
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
};

// Create Google Calendar API client
const getCalendarApi = (tokens) => {
  oauth2Client.setCredentials(tokens);
  return google.calendar({ version: 'v3', auth: oauth2Client });
};

module.exports = {
  getAuthUrl,
  getTokens,
  getCalendarApi
};