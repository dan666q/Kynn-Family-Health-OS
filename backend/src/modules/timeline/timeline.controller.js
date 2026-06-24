const Activity = require('./activity.model');
const Member = require('../member/member.model');
const response = require('../../utils/response');
const socketConfig = require('../../config/socket');

const emitSocketEvent = (familyId, eventName, data) => {
  const io = socketConfig.getIO();
  if (io && familyId) {
    io.to(familyId.toString()).emit(eventName, data);
  }
};

// Retrieve all activities for the user's family
exports.getActivities = async (req, res, next) => {
  try {
    if (!req.user.familyId) {
      return response.success(res, { activities: [] });
    }

    const activities = await Activity.find({ familyId: req.user.familyId })
      .populate('actorId', 'name username avatar')
      .sort({ createdAt: -1 });

    return response.success(res, { activities });
  } catch (err) {
    next(err);
  }
};

// Log member symptoms
exports.logSymptom = async (req, res, next) => {
  try {
    if (!req.user.familyId) {
      return response.error(res, 'You must join or create a family first', 400);
    }

    const { memberId, symptoms, temperature, notes } = req.body;

    if (!memberId || !symptoms) {
      return response.error(res, 'Member ID and symptoms details are required', 400);
    }

    const member = await Member.findOne({ _id: memberId, familyId: req.user.familyId });
    if (!member) {
      return response.error(res, 'Member not found in your family', 403);
    }

    const symptomsText = Array.isArray(symptoms) ? symptoms.join(', ') : symptoms;
    let message = `${req.user.name} đã ghi nhận triệu chứng cho ${member.fullName}: ${symptomsText}`;
    if (temperature) {
      message += ` (Thân nhiệt: ${temperature}°C)`;
    }
    if (notes) {
      message += `. Ghi chú: ${notes}`;
    }

    const activity = await Activity.create({
      familyId: req.user.familyId,
      actorId: req.user._id,
      type: 'symptom_logged',
      targetId: memberId,
      message,
      metadata: {
        memberId,
        symptoms,
        temperature,
        notes
      }
    });

    emitSocketEvent(req.user.familyId, 'timeline_updated');

    // Populate actor for consistency in feed
    const populated = await Activity.findById(activity._id).populate('actorId', 'name username avatar');

    return response.success(res, { activity: populated }, 201);
  } catch (err) {
    next(err);
  }
};
