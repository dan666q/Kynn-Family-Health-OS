// Medication controller placeholder
exports.getMedications = async (req, res, next) => {
  try {
    res.status(200).json({ status: 'success', medications: [] });
  } catch (err) {
    next(err);
  }
};
