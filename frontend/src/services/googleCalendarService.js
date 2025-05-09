import axios from 'axios';

const API_URL = 'http://localhost:5000/api/google';

// Get Google OAuth URL
export const getGoogleAuthUrl = async () => {
  const response = await axios.get(`${API_URL}/auth-url`);
  return response.data;
};

// Sync booking to Google Calendar
export const syncBookingToGoogle = async (bookingId) => {
  const response = await axios.post(`${API_URL}/sync/${bookingId}`);
  return response.data;
};

// Disconnect Google Calendar
export const disconnectGoogleCalendar = async () => {
  const response = await axios.post(`${API_URL}/disconnect`);
  return response.data;
};

// Get Google Calendar connection status
export const getGoogleStatus = async () => {
  const response = await axios.get(`${API_URL}/status`);
  return response.data;
};