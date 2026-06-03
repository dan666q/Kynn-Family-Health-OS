const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  familyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Family',
    required: [true, 'Family ID is required']
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    enum: ['Ông', 'Bà', 'Ba', 'Mẹ', 'Anh', 'Chị', 'Em', 'Bé', 'Khác'],
    trim: true
  },
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  birthday: {
    type: Date,
    default: null
  },
  bloodType: {
    type: String,
    enum: ['A', 'B', 'AB', 'O', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Không rõ'],
    default: 'Không rõ'
  },
  allergies: {
    type: [String],
    default: []
  },
  chronicDiseases: {
    type: [String],
    default: []
  },
  emergencyContact: {
    name: { type: String, default: '' },
    phone: { type: String, default: '' },
    relationship: { type: String, default: '' }
  },
  avatar: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Member', memberSchema);
