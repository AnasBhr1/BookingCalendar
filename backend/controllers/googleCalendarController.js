const User = require('../models/User');
const Booking = require('../models/Booking');
const { getAuthUrl, getTokens, getCalendarApi } = require('../config/googleOAuth');
const moment = require('moment');

// Get Google OAuth URL
const getGoogleAuthUrl = (req, res) => {
  try {
    const url = getAuthUrl();
    res.json({ url });
  } catch (error) {
    console.error('Get Google Auth URL error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Handle OAuth callback
const handleCallback = async (req, res) => {
  try {
    const { code } = req.query;
    const userId = req.user._id;
    
    // Exchange code for tokens
    const tokens = await getTokens(code);
    
    // Update user with Google tokens
    await User.findByIdAndUpdate(userId, {
      googleTokens: tokens,
      googleCalendarEnabled: true
    });
    
    // Redirect to frontend
    res.redirect(`${process.env.FRONTEND_URL}/calendar?google_sync=success`);
  } catch (error) {
    console.error('Google OAuth callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/calendar?google_sync=error`);
  }
};

// Sync booking to Google Calendar
const syncBookingToGoogle = async (req, res) => {
  try {
    const { bookingId } = req.params;
    
    // Get user and booking
    const user = await User.findById(req.user._id);
    const booking = await Booking.findById(bookingId);
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    if (!user.googleCalendarEnabled || !user.googleTokens) {
      return res.status(400).json({ error: 'Google Calendar not connected' });
    }
    
    // Create Google Calendar client
    const calendar = getCalendarApi(user.googleTokens);
    
    // Create event
    const event = {
      summary: booking.title,
      description: booking.notes || '',
      start: {
        dateTime: moment(booking.start).format(),
        timeZone: 'UTC'
      },
      end: {
        dateTime: moment(booking.end).format(),
        timeZone: 'UTC'
      },
      reminders: {
        useDefault: true
      }
    };
    
    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event
    });
    
    // Update booking with Google event ID
    booking.googleEventId = response.data.id;
    await booking.save();
    
    res.json({ success: true, eventId: response.data.id });
  } catch (error) {
    console.error('Sync to Google error:', error);
    
    // Check if token expired
    if (error.code === 401) {
      // Token expired, update user
      await User.findByIdAndUpdate(req.user._id, {
        googleCalendarEnabled: false
      });
      return res.status(401).json({ error: 'Google Calendar authorization expired' });
    }
    
    res.status(500).json({ error: 'Failed to sync with Google Calendar' });
  }
};

// Disconnect Google Calendar
const disconnectGoogleCalendar = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      googleTokens: null,
      googleCalendarEnabled: false
    });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Disconnect Google error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get Google Calendar connection status
const getGoogleStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    res.json({
      connected: user.googleCalendarEnabled,
      email: user.email
    });
  } catch (error) {
    console.error('Get Google status error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getGoogleAuthUrl,
  handleCallback,
  syncBookingToGoogle,
  disconnectGoogleCalendar,
  getGoogleStatus
};