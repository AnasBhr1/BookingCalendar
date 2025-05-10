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

export const updateUserProfile = async (userData) => {
  try {
    const response = await fetch(`http://localhost:5000/api/users/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      throw new Error('Failed to update profile');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

export const updateUserPassword = async (passwordData) => {
  try {
    const response = await fetch(`http://localhost:5000/api/users/password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(passwordData)
    });

    if (!response.ok) {
      throw new Error('Failed to update password');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating user password:', error);
    throw error;
  }
};