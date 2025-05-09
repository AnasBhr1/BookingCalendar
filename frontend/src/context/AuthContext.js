import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if token exists and is valid
    if (token) {
      try {
        // Set auth token header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Fetch current user
        fetchCurrentUser();
      } catch (error) {
        console.error('Token verification failed:', error);
        logout();
      }
    } else {
      setLoading(false);
    }
  }, [token]);

  // Fetch current user data
  const fetchCurrentUser = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/auth/me');
      setCurrentUser(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Fetch user error:', error);
      logout();
    }
  };

  // Register user
  const register = async (userData) => {
    try {
      setError(null);
      const res = await axios.post('http://localhost:5000/api/auth/register', userData);
      
      // Set token in local storage
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setCurrentUser(res.data.user);
      
      return true;
    } catch (error) {
      setError(
        error.response?.data?.error || 
        'Registration failed. Please try again.'
      );
      return false;
    }
  };

  // Login user
  const login = async (userData) => {
    try {
      setError(null);
      const res = await axios.post('http://localhost:5000/api/auth/login', userData);
      
      // Set token in local storage
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setCurrentUser(res.data.user);
      
      return true;
    } catch (error) {
      setError(
        error.response?.data?.error || 
        'Login failed. Please check your credentials.'
      );
      return false;
    }
  };

  // Logout user
  const logout = () => {
    // Remove token from local storage
    localStorage.removeItem('token');
    setToken(null);
    setCurrentUser(null);
    
    // Remove auth header
    delete axios.defaults.headers.common['Authorization'];
  };

  // Check if user is admin
  const isAdmin = () => {
    return currentUser?.role === 'admin';
  };

  // Check if token is expired
  const isTokenExpired = () => {
    if (!token) return true;
    
    try {
      const decoded = jwtDecode(token);
      return decoded.exp < Date.now() / 1000;
    } catch (error) {
      return true;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        error,
        register,
        login,
        logout,
        isAdmin,
        isTokenExpired
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};