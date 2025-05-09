const AvailabilitySlot = require('../models/AvailabilitySlot');

// Create availability slot
const createAvailabilitySlot = async (req, res) => {
  try {
    const { start, end, recurring, daysOfWeek } = req.body;
    
    const slot = new AvailabilitySlot({
      start,
      end,
      recurring,
      daysOfWeek: recurring ? daysOfWeek : [],
      createdBy: req.user._id
    });
    
    await slot.save();
    
    // Emit socket event for real-time updates
    const io = req.app.get('io');
    if (io) {
      io.emit('availabilityUpdated', {
        action: 'create',
        slot: slot
      });
    }
    
    res.status(201).json(slot);
  } catch (error) {
    console.error('Create availability error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all availability slots
const getAvailabilitySlots = async (req, res) => {
  try {
    const slots = await AvailabilitySlot.find();
    res.json(slots);
  } catch (error) {
    console.error('Get availability error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update availability slot
const updateAvailabilitySlot = async (req, res) => {
  try {
    const { start, end, recurring, daysOfWeek } = req.body;
    
    const slot = await AvailabilitySlot.findById(req.params.id);
    
    if (!slot) {
      return res.status(404).json({ error: 'Availability slot not found' });
    }
    
    if (start) slot.start = start;
    if (end) slot.end = end;
    if (recurring !== undefined) {
      slot.recurring = recurring;
      // Reset daysOfWeek if not recurring
      if (!recurring) {
        slot.daysOfWeek = [];
      }
    }
    if (daysOfWeek && recurring) {
      slot.daysOfWeek = daysOfWeek;
    }
    
    await slot.save();
    
    // Emit socket event for real-time updates
    const io = req.app.get('io');
    if (io) {
      io.emit('availabilityUpdated', {
        action: 'update',
        slot: slot
      });
    }
    
    res.json(slot);
  } catch (error) {
    console.error('Update availability error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete availability slot
const deleteAvailabilitySlot = async (req, res) => {
  try {
    const slot = await AvailabilitySlot.findById(req.params.id);
    
    if (!slot) {
      return res.status(404).json({ error: 'Availability slot not found' });
    }
    
    await slot.remove();
    
    // Emit socket event for real-time updates
    const io = req.app.get('io');
    if (io) {
      io.emit('availabilityUpdated', {
        action: 'delete',
        slotId: req.params.id
      });
    }
    
    res.json({ message: 'Availability slot removed' });
  } catch (error) {
    console.error('Delete availability error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  createAvailabilitySlot,
  getAvailabilitySlots,
  updateAvailabilitySlot,
  deleteAvailabilitySlot
};