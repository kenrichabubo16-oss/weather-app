const User = require('../models/User');
const ApiResponse = require('../utils/responses');
const { AppError } = require('../middleware/errorHandler');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('Email already registered', 400);
    }

    //  Hash password before creating user
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user with hashed password
    const user = await User.create({ 
      name, 
      email, 
      password: hashedPassword 
    });

    ApiResponse.created(res, { user }, 'Registration successful!');
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user and include password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new AppError('Invalid email or password', 401);
    }

    // Remove password from response
    user.password = undefined;

    ApiResponse.success(res, { user }, 'Login successful!');
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login };