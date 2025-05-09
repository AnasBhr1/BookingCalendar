const express = require('express');
const router = express.Router();
const { 
  createAvailabilitySlot, 
  getAvailabilitySlots, 
  updateAvailabilitySlot, 
  deleteAvailabilitySlot 
} = require('../controllers/availabilityController');
const { auth, adminAuth } = require('../middleware/auth');

// Create availability slot (admin only)
router.post('/', auth, adminAuth, createAvailabilitySlot);

// Get all availability slots
router.get('/', getAvailabilitySlots);

// Update availability slot (admin only)
router.put('/:id', auth, adminAuth, updateAvailabilitySlot);

// Delete availability slot (admin only)
router.delete('/:id', auth, adminAuth, deleteAvailabilitySlot);

module.exports = router;