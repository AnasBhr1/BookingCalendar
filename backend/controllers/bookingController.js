const Booking = require('../models/Booking');
const AvailabilitySlot = require('../models/AvailabilitySlot');
const moment = require('moment');

// Create a new booking
const createBooking = async (req, res) => {
  try {
    const { title, start, end, notes } = req.body;
    
    // Check if slot is available
    const isAvailable = await checkAvailability(start, end);
    if (!isAvailable) {
      return res.status(400).json({ error: 'Selected time slot is not available' });
    }
    
    // Create booking
    const booking = new Booking({
      title,
      start,
      end,
      notes,
      user: req.user._id
    });
    
    await booking.save();
    
    // Emit socket event for real-time updates
    const io = req.app.get('io');
    if (io) {
      io.emit('bookingUpdated', {
        action: 'create',
        booking: booking
      });
    }
    
    res.status(201).json(booking);
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all bookings for the current user
const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id });
    res.json(bookings);
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all bookings (admin only)
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate('user', 'name email');
    res.json(bookings);
  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update booking
const updateBooking = async (req, res) => {
  try {
    const { title, start, end, notes, status } = req.body;
    
    // Find booking
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    // Check if user is authorized
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    // Check if new time slot is available (if time was changed)
    if (start && end && (start !== booking.start || end !== booking.end)) {
      const isAvailable = await checkAvailability(start, end, booking._id);
      if (!isAvailable) {
        return res.status(400).json({ error: 'Selected time slot is not available' });
      }
    }
    
    // Update booking
    if (title) booking.title = title;
    if (start) booking.start = start;
    if (end) booking.end = end;
    if (notes) booking.notes = notes;
    if (status) booking.status = status;
    
    await booking.save();
    
    // Emit socket event for real-time updates
    const io = req.app.get('io');
    if (io) {
      io.emit('bookingUpdated', {
        action: 'update',
        booking: booking
      });
    }
    
    res.json(booking);
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete booking
const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    // Check if user is authorized
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    await booking.remove();
    
    // Emit socket event for real-time updates
    const io = req.app.get('io');
    if (io) {
      io.emit('bookingUpdated', {
        action: 'delete',
        bookingId: req.params.id
      });
    }
    
    res.json({ message: 'Booking removed' });
  } catch (error) {
    console.error('Delete booking error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Helper function to check if a time slot is available
const checkAvailability = async (start, end, excludeBookingId = null) => {
  const startTime = new Date(start);
  const endTime = new Date(end);
  
  // Check if there are any overlapping bookings
  const query = {
    $and: [
      { status: { $ne: 'canceled' } },
      { 
        $or: [
          // New booking starts during an existing booking
          { start: { $lte: startTime }, end: { $gt: startTime } },
          // New booking ends during an existing booking
          { start: { $lt: endTime }, end: { $gte: endTime } },
          // New booking completely contains an existing booking
          { start: { $gte: startTime }, end: { $lte: endTime } }
        ] 
      }
    ]
  };
  
  // Exclude the current booking if we're updating
  if (excludeBookingId) {
    query._id = { $ne: excludeBookingId };
  }
  
  const existingBookings = await Booking.countDocuments(query);
  
  if (existingBookings > 0) {
    return false;
  }
  
  // Check if there are available slots that cover this time
  const dayOfWeek = moment(startTime).day();
  
  const availabilityQuery = {
    $or: [
      // One-time availability that covers the requested time
      {
        recurring: false,
        start: { $lte: startTime },
        end: { $gte: endTime }
      },
      // Recurring availability that covers the requested time
      {
        recurring: true,
        daysOfWeek: dayOfWeek,
        start: { $lte: moment(startTime).startOf('day').toDate() },
        end: { $gte: moment(endTime).startOf('day').toDate() }
      }
    ]
  };
  
  const availableSlots = await AvailabilitySlot.countDocuments(availabilityQuery);
  
  return availableSlots > 0;
};

module.exports = {
  createBooking,
  getUserBookings,
  getAllBookings,
  updateBooking,
  deleteBooking
};