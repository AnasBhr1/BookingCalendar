const express = require('express');
const router = express.Router();
const { 
  createBooking, 
  getUserBookings, 
  getAllBookings, 
  updateBooking, 
  deleteBooking 
} = require('../controllers/bookingController');
const { auth, adminAuth } = require('../middleware/auth');

// Create booking (protected route)
router.post('/', auth, createBooking);

// Get user bookings (protected route)
router.get('/me', auth, getUserBookings);

// Get all bookings (admin only)
router.get('/', auth, adminAuth, getAllBookings);

// Update booking (protected route)
router.put('/:id', auth, updateBooking);

// Delete booking (protected route)
router.delete('/:id', auth, deleteBooking);

module.exports = router;