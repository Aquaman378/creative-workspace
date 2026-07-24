/**
 * Authentication Controller
 */

const jwt = require('jsonwebtoken');
const { auth, userService } = require('../services/firebaseService');

/**
 * Generate JWT Token
 */
const generateToken = (uid, email) => {
  return jwt.sign(
    { uid, email },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

/**
 * Register User
 */
const register = async (req, res) => {
  try {
    const { email, password, fullName } = req.body;

    // Validate inputs
    if (!email || !password || !fullName) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Email, password, and fullName are required',
        },
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'WEAK_PASSWORD',
          message: 'Password must be at least 6 characters',
        },
      });
    }

    // Create user
    const user = await userService.createUser(email, password, { fullName });
    const token = generateToken(user.uid, user.email);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user.uid,
        email: user.email,
        fullName: user.displayName,
      },
    });
  } catch (error) {
    const statusCode = error.message.includes('already exists') ? 409 : 500;
    res.status(statusCode).json({
      success: false,
      error: {
        code: 'REGISTRATION_ERROR',
        message: error.message,
      },
    });
  }
};

/**
 * Login User
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Email and password are required',
        },
      });
    }

    // Firebase doesn't provide password verification directly
    // This is typically handled on the client with Firebase SDK
    // This endpoint assumes the client has already verified credentials
    
    // Get user by email
    const users = await auth.getUserByEmail(email);
    if (!users) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password',
        },
      });
    }

    // Get user data
    const user = await userService.getUserById(users.uid);
    const token = generateToken(users.uid, users.email);

    res.json({
      success: true,
      token,
      user: {
        id: users.uid,
        email: users.email,
        fullName: user.fullName,
      },
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      error: {
        code: 'LOGIN_ERROR',
        message: 'Invalid credentials',
      },
    });
  }
};

/**
 * Verify Token
 */
const verifyToken = async (req, res) => {
  try {
    const user = await userService.getUserById(req.user.uid);
    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      },
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      error: {
        code: 'TOKEN_VERIFICATION_FAILED',
        message: error.message,
      },
    });
  }
};

/**
 * Logout
 */
const logout = (req, res) => {
  // Token-based auth is stateless, so logout is just removing the token on client
  res.json({
    success: true,
    message: 'Logout successful',
  });
};

module.exports = {
  register,
  login,
  verifyToken,
  logout,
};
