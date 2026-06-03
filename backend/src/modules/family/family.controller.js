const Family = require('./family.model');
const User = require('../auth/user.model');
const response = require('../../utils/response');

// Helper to generate a 6-character random uppercase invite code
const generateInviteCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// Create Family
exports.createFamily = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name) {
      return response.error(res, 'Family name is required', 400);
    }

    // Check if user already has a family
    if (req.user.familyId) {
      return response.error(res, 'User is already in a family. Leave or delete the existing family first.', 400);
    }

    // Generate unique invite code
    let inviteCode = generateInviteCode();
    let codeExists = await Family.findOne({ inviteCode });
    while (codeExists) {
      inviteCode = generateInviteCode();
      codeExists = await Family.findOne({ inviteCode });
    }

    // Create family
    const family = await Family.create({
      name,
      ownerId: req.user._id,
      inviteCode
    });

    // Link family to user
    await User.findByIdAndUpdate(req.user._id, { familyId: family._id });
    req.user.familyId = family._id;

    return response.success(res, { family }, 201);
  } catch (err) {
    next(err);
  }
};

// Join Family by Invite Code
exports.joinFamily = async (req, res, next) => {
  try {
    const { inviteCode } = req.body;

    if (!inviteCode) {
      return response.error(res, 'Invite code is required', 400);
    }

    // Check if user already has a family
    if (req.user.familyId) {
      return response.error(res, 'User is already in a family.', 400);
    }

    // Find family by invite code
    const family = await Family.findOne({ inviteCode: inviteCode.trim().toUpperCase() });
    if (!family) {
      return response.error(res, 'Invalid invite code. Family not found.', 404);
    }

    // Link family to user
    await User.findByIdAndUpdate(req.user._id, { familyId: family._id });
    req.user.familyId = family._id;

    return response.success(res, { message: `Joined ${family.name} successfully`, family });
  } catch (err) {
    next(err);
  }
};

// Get current user's family
exports.getFamily = async (req, res, next) => {
  try {
    if (!req.user.familyId) {
      return response.success(res, { family: null }, 200);
    }

    const family = await Family.findById(req.user.familyId);
    if (!family) {
      return response.error(res, 'Family not found.', 404);
    }

    return response.success(res, { family });
  } catch (err) {
    next(err);
  }
};

