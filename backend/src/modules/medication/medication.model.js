const mongoose = require('mongoose');

const medicationSchema = new mongoose.Schema({
  memberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    required: [true, 'Member ID is required']
  },
  name: {
    type: String,
    required: [true, 'Medication name is required'],
    trim: true
  },
  dosage: {
    type: String,
    required: [true, 'Dosage is required'],
    trim: true
  },
  frequency: {
    type: String,
    required: [true, 'Frequency is required'],
    enum: ['daily', 'weekly', 'custom'],
    default: 'daily'
  },
  schedule: {
    type: [String],
    required: [true, 'Schedule slot is required'] // e.g. ['08:00', '20:00'] or ['Khi khò khè / Khó thở']
  },
  notes: {
    type: String,
    default: ''
  },
  active: {
    type: Boolean,
    default: true
  },
  voiceNoteUrl: {
    type: String,
    default: ''
  },
  voiceDuration: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Medication', medicationSchema);
