const Activity = require('./activity.model');
const response = require('../../utils/response');

// Retrieve all activities for the user's family
exports.getActivities = async (req, res, next) => {
  try {
    if (!req.user.familyId) {
      return response.success(res, { activities: [] });
    }

    const activities = await Activity.find({ familyId: req.user.familyId })
      .populate('actorId', 'name email avatar')
      .sort({ createdAt: -1 });

    return response.success(res, { activities });
  } catch (err) {
    next(err);
  }
};

