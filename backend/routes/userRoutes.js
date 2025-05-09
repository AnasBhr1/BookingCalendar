const express = require('express');
const router = express.Router();
const { 
  getAllUsers, 
  updateUserRole, 
  deleteUser 
} = require('../controllers/userController');
const { auth, adminAuth } = require('../middleware/auth');

// Get all users (admin only)
router.get('/', auth, adminAuth, getAllUsers);

// Update user role (admin only)
router.put('/:id/role', auth, adminAuth, updateUserRole);

// Delete user (admin only)
router.delete('/:id', auth, adminAuth, deleteUser);

module.exports = router;