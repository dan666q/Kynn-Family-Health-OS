const mongoose = require('mongoose');

const medicationLogSchema = new mongoose.Schema({
  medicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Medication',
    required: [true, 'Medication ID is required']
  },
  memberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    required: [true, 'Member ID is required']
  },
  checkedBy: {
    type: String,
    required: [true, 'Name of person who recorded this is required']
  },
  status: {
    type: String,
    enum: ['taken', 'missed', 'skipped'],
    default: 'taken',
    required: true
  },
  timeSlot: {
    type: String,
    required: [true, 'Time slot is required']
  },
  takenAt: {
    type: Date,
    default: Date.now,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('MedicationLog', medicationLogSchema);
