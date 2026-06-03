// Voice controller placeholder
exports.uploadVoiceNote = async (req, res, next) => {
  try {
    res.status(200).json({ status: 'success', message: 'Voice note uploaded successfully (Mock/Placeholder)' });
  } catch (err) {
    next(err);
  }
};
