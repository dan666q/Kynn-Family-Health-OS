const mongoose = require('mongoose');

const voiceNoteSchema = new mongoose.Schema({
  medicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Medication',
    default: null
  },
  memberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    required: [true, 'Member ID is required']
  },
  recordedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID who recorded this is required']
  },
  audioUrl: {
    type: String,
    required: [true, 'Audio file URL is required']
  },
  duration: {
    type: Number,
    required: [true, 'Audio duration is required'],
    default: 0
  },
  transcript: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('VoiceNote', voiceNoteSchema);
