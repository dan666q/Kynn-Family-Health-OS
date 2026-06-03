const User = require('./user.model');
const jwt = require('jsonwebtoken');
const env = require('../../config/env');
const response = require('../../utils/response');

// Generate JWT token helper
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN
  });
};

// Register User
exports.register = async (req, res, next) => {
  try {
    const { email, password, name, avatar } = req.body;

    if (!email || !password || !name) {
      return response.error(res, 'Email, password, and name are required', 400);
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return response.error(res, 'Email is already registered', 400);
    }

    // Create user
    const user = await User.create({
      email,
      password,
      name,
      avatar: avatar || ''
    });

    // Remove password from output
    user.password = undefined;

    // Generate token
    const token = generateToken(user._id);

    return response.success(res, { user, token }, 201);
  } catch (err) {
    next(err);
  }
};

// Login User
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return response.error(res, 'Email and password are required', 400);
    }

    // Find user and explicitly select password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return response.error(res, 'Invalid email or password', 401);
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return response.error(res, 'Invalid email or password', 401);
    }

    // Remove password from response
    user.password = undefined;

    // Generate token
    const token = generateToken(user._id);

    return response.success(res, { user, token });
  } catch (err) {
    next(err);
  }
};

// Get current user profile (Me)
exports.getMe = async (req, res, next) => {
  try {
    // req.user was populated by auth middleware
    return response.success(res, { user: req.user });
  } catch (err) {
    next(err);
  }
};

// Logout User
exports.logout = async (req, res, next) => {
  try {
    return response.success(res, { message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
};

