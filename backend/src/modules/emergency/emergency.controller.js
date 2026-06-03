// Emergency controller placeholder
exports.getEmergencyCard = async (req, res, next) => {
  try {
    res.status(200).json({ status: 'success', emergencyCard: {} });
  } catch (err) {
    next(err);
  }
};
