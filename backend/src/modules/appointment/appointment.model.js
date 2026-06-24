const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  memberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    required: [true, 'Member ID is required']
  },
  hospital: {
    type: String,
    required: [true, 'Hospital/Clinic name is required'],
    trim: true
  },
  doctor: {
    type: String,
    default: '',
    trim: true
  },
  appointmentDate: {
    type: Date,
    required: [true, 'Appointment date and time are required']
  },
  notes: {
    type: String,
    default: '',
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Created by User ID is required']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Appointment', appointmentSchema);
