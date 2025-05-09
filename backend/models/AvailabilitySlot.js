const mongoose = require('mongoose');

const availabilitySlotSchema = new mongoose.Schema({
  start: {
    type: Date,
    required: true
  },
  end: {
    type: Date,
    required: true
  },
  recurring: {
    type: Boolean,
    default: false
  },
  daysOfWeek: {
    type: [Number], // 0 = Sunday, 1 = Monday, etc.
    default: []
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const AvailabilitySlot = mongoose.model('AvailabilitySlot', availabilitySlotSchema);

module.exports = AvailabilitySlot;