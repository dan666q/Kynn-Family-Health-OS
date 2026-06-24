const User = require('./user.model');
const Family = require('../family/family.model');
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
    const { username, password, name, avatar } = req.body;

    if (!username || !password || !name) {
      return response.error(res, 'Username, password, and name are required', 400);
    }

    const cleanUsername = username.trim().toLowerCase();

    // Check if user already exists
    const existingUser = await User.findOne({ username: cleanUsername });
    if (existingUser) {
      return response.error(res, 'Tên đăng nhập đã tồn tại', 400);
    }

    // Create user
    const user = await User.create({
      username: cleanUsername,
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
    const { username, password } = req.body;

    if (!username || !password) {
      return response.error(res, 'Username and password are required', 400);
    }

    const cleanUsername = username.trim().toLowerCase();

    // Find user and explicitly select password
    const user = await User.findOne({ username: cleanUsername }).select('+password');
    if (!user) {
      return response.error(res, 'Tên đăng nhập hoặc mật khẩu không đúng', 401);
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return response.error(res, 'Tên đăng nhập hoặc mật khẩu không đúng', 401);
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

// Change Password
exports.changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return response.error(res, 'Mật khẩu cũ và mật khẩu mới là bắt buộc', 400);
    }

    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return response.error(res, 'Không tìm thấy người dùng', 404);
    }

    // Check if old password matches
    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return response.error(res, 'Mật khẩu cũ không chính xác', 400);
    }

    // Set and save new password
    user.password = newPassword;
    await user.save();

    return response.success(res, { message: 'Đổi mật khẩu thành công!' });
  } catch (err) {
    next(err);
  }
};

// Forgot Password via Family Invite Code Verification (Local Recovery)
exports.forgotPassword = async (req, res, next) => {
  try {
    const { username, inviteCode, newPassword } = req.body;

    if (!username || !inviteCode || !newPassword) {
      return response.error(res, 'Tên đăng nhập, mã mời và mật khẩu mới là bắt buộc', 400);
    }

    const cleanUsername = username.trim().toLowerCase();

    // Find user and populate family to match invite code
    const user = await User.findOne({ username: cleanUsername }).populate('familyId');
    if (!user) {
      return response.error(res, 'Tên đăng nhập không tồn tại', 400);
    }

    if (!user.familyId) {
      return response.error(res, 'Tài khoản chưa gia nhập gia đình nào để thực hiện khôi phục', 400);
    }

    const family = await Family.findById(user.familyId);
    if (!family || family.inviteCode !== inviteCode.trim()) {
      return response.error(res, 'Mã mời gia đình không hợp lệ', 400);
    }

    // Set new password
    user.password = newPassword;
    await user.save();

    return response.success(res, { message: 'Đặt lại mật khẩu thành công!' });
  } catch (err) {
    next(err);
  }
};
