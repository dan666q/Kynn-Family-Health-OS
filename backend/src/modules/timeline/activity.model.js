const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  familyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Family',
    required: [true, 'Family ID is required']
  },
  actorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Actor User ID is required']
  },
  type: {
    type: String,
    required: [true, 'Activity type is required'],
    enum: [
      'medication_taken',
      'medication_missed',
      'medication_added',
      'medication_updated',
      'medication_deleted',
      'document_uploaded',
      'document_deleted',
      'symptom_logged',
      'voice_added',
      'member_created',
      'member_updated',
      'appointment_created',
      'appointment_deleted'
    ]
  },
  targetId: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    required: [true, 'Activity message description is required'],
    trim: true
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Activity', activitySchema);
