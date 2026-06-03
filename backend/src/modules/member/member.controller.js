// Member controller placeholder
exports.getMembers = async (req, res, next) => {
  try {
    res.status(200).json({ status: 'success', members: [] });
  } catch (err) {
    next(err);
  }
};
