// Global Error Handling Middleware
module.exports = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(`[Error Handler] ${err.message}`, err);

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
};
