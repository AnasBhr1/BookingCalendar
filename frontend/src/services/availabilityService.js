import axios from 'axios';

const API_URL = 'http://localhost:5000/api/availability';

// Create availability slot (admin only)
export const createAvailabilitySlot = async (slotData) => {
  const response = await axios.post(API_URL, slotData);
  return response.data;
};

// Get all availability slots
export const getAvailabilitySlots = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Update availability slot (admin only)
export const updateAvailabilitySlot = async (id, slotData) => {
  const response = await axios.put(`${API_URL}/${id}`, slotData);
  return response.data;
};

// Delete availability slot (admin only)
export const deleteAvailabilitySlot = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};