// Timeline controller placeholder
exports.getActivities = async (req, res, next) => {
  try {
    res.status(200).json({ status: 'success', activities: [] });
  } catch (err) {
    next(err);
  }
};
