const jwt = require('jsonwebtoken');
const env = require('../config/env');
const User = require('../modules/auth/user.model');
const response = require('../utils/response');

module.exports = async (req, res, next) => {
  try {
    let token;
    
    // Check if authorization header exists and starts with Bearer
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return response.error(res, 'Access denied. No token provided.', 401);
    }

    // Verify token
    const decoded = jwt.verify(token, env.JWT_SECRET);
    
    // Find user in database
    const user = await User.findById(decoded.id);
    if (!user) {
      return response.error(res, 'User not found or session invalid.', 401);
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return response.error(res, 'Invalid token.', 401);
    }
    if (err.name === 'TokenExpiredError') {
      return response.error(res, 'Token has expired.', 401);
    }
    next(err);
  }
};

