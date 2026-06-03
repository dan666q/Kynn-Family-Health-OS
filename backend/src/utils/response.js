// API standard response formatter
module.exports = {
  success: (res, data, statusCode = 200) => {
    return res.status(statusCode).json({
      status: 'success',
      data
    });
  },
  error: (res, message, statusCode = 500) => {
    return res.status(statusCode).json({
      status: 'error',
      message
    });
  }
};
