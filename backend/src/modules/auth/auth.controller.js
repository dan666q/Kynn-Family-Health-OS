// Auth controller
exports.login = async (req, res, next) => {
  try {
    res.status(200).json({ status: 'success', message: 'Logged in successfully (Mock/Placeholder)' });
  } catch (err) {
    next(err);
  }
};

exports.logout = async (req, res, next) => {
  try {
    res.status(200).json({ status: 'success', message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
};
