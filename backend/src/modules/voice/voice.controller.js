const response = require('../../utils/response');

exports.uploadVoiceNote = async (req, res, next) => {
  try {
    if (!req.file) {
      return response.error(res, 'No audio file uploaded', 400);
    }

    const { duration } = req.body;
    const fileUrl = `/uploads/${req.file.filename}`;

    return response.success(res, {
      url: fileUrl,
      duration: duration ? parseInt(duration) : 0
    }, 201);
  } catch (err) {
    next(err);
  }
};

