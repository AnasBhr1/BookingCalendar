const express = require('express');
const router = express.Router();
const { 
  getGoogleAuthUrl, 
  handleCallback, 
  syncBookingToGoogle,
  disconnectGoogleCalendar,
  getGoogleStatus
} = require('../controllers/googleCalendarController');
const { auth } = require('../middleware/auth');

// Get Google OAuth URL
router.get('/auth-url', auth, getGoogleAuthUrl);

// Handle OAuth callback
router.get('/callback', auth, handleCallback);

// Sync booking to Google Calendar
router.post('/sync/:bookingId', auth, syncBookingToGoogle);

// Disconnect Google Calendar
router.post('/disconnect', auth, disconnectGoogleCalendar);

// Get Google Calendar connection status
router.get('/status', auth, getGoogleStatus);

module.exports = router;