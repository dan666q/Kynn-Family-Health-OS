const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  memberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    required: [true, 'Member ID is required']
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Uploader User ID is required']
  },
  type: {
    type: String,
    required: [true, 'Document type is required'],
    enum: ['toa_thuoc', 'xet_nghiem', 'bhyt', 'cccd', 'ho_so_benh_vien', 'khac'],
    default: 'khac'
  },
  fileUrl: {
    type: String,
    required: [true, 'File URL is required']
  },
  fileName: {
    type: String,
    required: [true, 'File name is required']
  },
  expiryDate: {
    type: Date,
    default: null
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Document', documentSchema);
