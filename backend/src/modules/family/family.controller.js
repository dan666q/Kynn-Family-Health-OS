// Family controller placeholder
exports.getFamily = async (req, res, next) => {
  try {
    res.status(200).json({ status: 'success', family: { id: 'fam-1', name: 'Hoang Family' } });
  } catch (err) {
    next(err);
  }
};
