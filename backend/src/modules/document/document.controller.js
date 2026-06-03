// Document controller placeholder
exports.getDocuments = async (req, res, next) => {
  try {
    res.status(200).json({ status: 'success', documents: [] });
  } catch (err) {
    next(err);
  }
};
