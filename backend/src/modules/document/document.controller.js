const Document = require('./document.model');
const Member = require('../member/member.model');
const Activity = require('../timeline/activity.model');
const response = require('../../utils/response');
const socketConfig = require('../../config/socket');
const fs = require('fs');
const path = require('path');

const emitSocketEvent = (familyId, eventName, data) => {
  const io = socketConfig.getIO();
  if (io && familyId) {
    io.to(familyId.toString()).emit(eventName, data);
  }
};

// Retrieve all medical documents for the family members
exports.getDocuments = async (req, res, next) => {
  try {
    if (!req.user.familyId) {
      return response.success(res, { documents: [] });
    }

    const members = await Member.find({ familyId: req.user.familyId });
    const memberIds = members.map(m => m._id);

    const documents = await Document.find({ memberId: { $in: memberIds } })
      .populate('memberId')
      .sort({ createdAt: -1 });

    return response.success(res, { documents });
  } catch (err) {
    next(err);
  }
};

// Upload and create a new medical document
exports.createDocument = async (req, res, next) => {
  try {
    if (!req.user.familyId) {
      return response.error(res, 'You must join or create a family first', 400);
    }

    if (!req.file) {
      return response.error(res, 'No file uploaded', 400);
    }

    const { memberId, type, fileName, expiryDate, notes } = req.body;

    if (!memberId) {
      // Cleanup uploaded file
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return response.error(res, 'Member ID is required', 400);
    }

    // Verify member belongs to family
    const member = await Member.findOne({ _id: memberId, familyId: req.user.familyId });
    if (!member) {
      // Cleanup uploaded file
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return response.error(res, 'Member not found in your family', 403);
    }

    const document = await Document.create({
      memberId,
      uploadedBy: req.user._id,
      type: type || 'khac',
      fileUrl: `/uploads/${req.file.filename}`,
      fileName: fileName || req.file.originalname,
      expiryDate: expiryDate ? new Date(expiryDate) : null,
      notes: notes || ''
    });

    // Log Activity
    await Activity.create({
      familyId: req.user.familyId,
      actorId: req.user._id,
      type: 'document_uploaded',
      targetId: document._id.toString(),
      message: `${req.user.name} đã tải lên tài liệu "${document.fileName}" cho ${member.fullName}`
    });

    emitSocketEvent(req.user.familyId, 'document_updated');
    emitSocketEvent(req.user.familyId, 'timeline_updated');

    const populated = await Document.findById(document._id).populate('memberId');

    return response.success(res, { document: populated }, 201);
  } catch (err) {
    // Cleanup uploaded file if error occurs
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    next(err);
  }
};

// Delete a document
exports.deleteDocument = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!req.user.familyId) {
      return response.error(res, 'Unauthorized', 403);
    }

    const document = await Document.findById(id).populate('memberId');
    if (!document) {
      return response.error(res, 'Document not found', 404);
    }

    // Verify ownership
    if (!document.memberId || document.memberId.familyId.toString() !== req.user.familyId.toString()) {
      return response.error(res, 'Unauthorized access to this document', 403);
    }

    const member = document.memberId;

    // Delete database record
    await Document.findByIdAndDelete(id);

    // Delete physical file
    const fileBasename = path.basename(document.fileUrl);
    const filePath = path.join(__dirname, '../../uploads', fileBasename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Log Activity
    await Activity.create({
      familyId: req.user.familyId,
      actorId: req.user._id,
      type: 'document_deleted',
      targetId: id,
      message: `${req.user.name} đã xóa tài liệu "${document.fileName}" của ${member.fullName}`
    });

    emitSocketEvent(req.user.familyId, 'document_updated');
    emitSocketEvent(req.user.familyId, 'timeline_updated');

    return response.success(res, { message: 'Document deleted successfully' });
  } catch (err) {
    next(err);
  }
};
