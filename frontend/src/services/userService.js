import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users';

// Get all users (admin only)
export const getAllUsers = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Update user role (admin only)
export const updateUserRole = async (id, role) => {
  const response = await axios.put(`${API_URL}/${id}/role`, { role });
  return response.data;
};

// Delete user (admin only)
export const deleteUser = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};