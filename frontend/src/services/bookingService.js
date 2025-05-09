import axios from 'axios';

const API_URL = 'http://localhost:5000/api/bookings';

// Create a new booking
export const createBooking = async (bookingData) => {
  const response = await axios.post(API_URL, bookingData);
  return response.data;
};

// Get user bookings
export const getUserBookings = async () => {
  const response = await axios.get(`${API_URL}/me`);
  return response.data;
};

// Get all bookings (admin only)
export const getAllBookings = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Update booking
export const updateBooking = async (id, bookingData) => {
  const response = await axios.put(`${API_URL}/${id}`, bookingData);
  return response.data;
};

// Delete booking
export const deleteBooking = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};