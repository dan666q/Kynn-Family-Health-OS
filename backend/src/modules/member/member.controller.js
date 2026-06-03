const Member = require('./member.model');
const Medication = require('../medication/medication.model');
const MedicationLog = require('../medication/medicationLog.model');
const response = require('../../utils/response');

// Get all members of the user's family
exports.getMembers = async (req, res, next) => {
  try {
    if (!req.user.familyId) {
      return response.success(res, { members: [] });
    }

    const members = await Member.find({ familyId: req.user.familyId });
    return response.success(res, { members });
  } catch (err) {
    next(err);
  }
};

// Create a new member in the user's family
exports.createMember = async (req, res, next) => {
  try {
    if (!req.user.familyId) {
      return response.error(res, 'You must create or join a family first before adding members.', 400);
    }

    const { fullName, role, birthday, bloodType, allergies, chronicDiseases, emergencyContact, avatar } = req.body;

    if (!fullName || !role) {
      return response.error(res, 'Full name and role are required', 400);
    }

    const member = await Member.create({
      familyId: req.user.familyId,
      fullName,
      role,
      birthday,
      bloodType: bloodType || 'Không rõ',
      allergies: allergies || [],
      chronicDiseases: chronicDiseases || [],
      emergencyContact: emergencyContact || { name: '', phone: '', relationship: '' },
      avatar: avatar || ''
    });

    return response.success(res, { member }, 201);
  } catch (err) {
    next(err);
  }
};

// Update a member's profile
exports.updateMember = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!req.user.familyId) {
      return response.error(res, 'Unauthorized access to family members.', 403);
    }

    // Verify member belongs to user's family
    const member = await Member.findOne({ _id: id, familyId: req.user.familyId });
    if (!member) {
      return response.error(res, 'Member not found in your family.', 404);
    }

    // Fields to update
    const updates = req.body;
    
    // Prevent modifying familyId
    delete updates.familyId;

    const updatedMember = await Member.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

    return response.success(res, { member: updatedMember });
  } catch (err) {
    next(err);
  }
};

// Delete a member profile (and their medications / logs)
exports.deleteMember = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!req.user.familyId) {
      return response.error(res, 'Unauthorized access to family members.', 403);
    }

    // Verify member belongs to user's family
    const member = await Member.findOne({ _id: id, familyId: req.user.familyId });
    if (!member) {
      return response.error(res, 'Member not found in your family.', 404);
    }

    // Delete member
    await Member.findByIdAndDelete(id);

    // Delete associated medications
    await Medication.deleteMany({ memberId: id });
    
    // Delete associated medication logs
    await MedicationLog.deleteMany({ memberId: id });

    return response.success(res, { message: 'Member and all associated data deleted successfully.' });
  } catch (err) {
    next(err);
  }
};

