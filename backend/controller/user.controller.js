import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { 
  generateTokenPair, 
  getCookieOptions,
  verifyRefreshToken 
} from "../utils/jwtUtils.js";

// register user: /api/user/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please fill all the fields", success: false });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists", success: false });
    }

    const hashedPassword = await bcrypt.hash(password, 12); // Increased cost factor for better security
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });
    await user.save();

    // Don't create tokens on registration - user must login
    res.status(201).json({
      message: "User registered successfully. Please login to continue.",
      success: true,
    });
  } catch (error) {
    console.error("Error in registerUser:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// login user: /api/user/login

export const loginUser = async (req, res) => {
  try {
    console.log('Login request received:', { 
      email: req.body.email,
      origin: req.headers.origin,
      userAgent: req.headers['user-agent']
    });
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      console.log('Missing credentials');
      return res.status(400).json({ 
        success: false,
        message: 'Please provide both email and password' 
      });
    }

    // Find user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Invalid password for user:', email);
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    try {
      // Generate tokens
      const { accessToken, refreshToken } = generateTokenPair(user._id);
      
      // Update user with refresh token
      user.refreshToken = await bcrypt.hash(refreshToken, 10);
      user.lastLogin = new Date();
      await user.save();

      // Set secure cookies
      const accessTokenCookieOptions = getCookieOptions(15 * 60 * 1000); // 15 minutes
      const refreshTokenCookieOptions = getCookieOptions(7 * 24 * 60 * 60 * 1000); // 7 days
      
      console.log('Setting cookies with options:', { 
        accessTokenCookieOptions, 
        refreshTokenCookieOptions 
      });

      res.cookie('accessToken', accessToken, accessTokenCookieOptions);
      res.cookie('refreshToken', refreshToken, refreshTokenCookieOptions);

      // Remove sensitive data before sending response
      user.password = undefined;
      user.refreshToken = undefined;

      console.log('Login successful for user:', user.email);
      
      res.status(200).json({
        success: true,
        message: 'Logged in successfully',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (tokenError) {
      console.error('Token generation error:', tokenError);
      return res.status(500).json({
        success: false,
        message: 'Error generating authentication tokens'
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'An error occurred during login. Please try again later.' 
    });
  }
};

// check auth : /api/user/is-auth
export const checkAuth = async (req, res) => {
  try {
    const userId = req.user;
    console.log(`🔍 checkAuth - User ID from token: ${userId}`);

    if (!userId) {
      console.log('❌ No user ID found in request');
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required',
        code: 'UNAUTHORIZED'
      });
    }

    const user = await User.findById(userId).select("-password -refreshToken");
    if (!user) {
      console.log(`❌ User not found with ID: ${userId}`);
      return res.status(404).json({ 
        success: false,
        message: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    console.log(`✅ User authenticated: ${user.email}`);
    res.status(200).json({ 
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        cart: user.cartItems || {},
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('❌ Error in checkAuth:', error);
    res.status(500).json({ 
      success: false, 
      message: 'An error occurred while verifying authentication',
      code: 'AUTH_VERIFICATION_FAILED',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// refresh token: /api/user/refresh-token
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({ 
        message: "Refresh token not found", 
        success: false 
      });
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);
    
    // Find user and verify stored refresh token
    const user = await User.findById(decoded.id);
    if (!user || !user.refreshToken) {
      return res.status(401).json({ 
        message: "Invalid refresh token", 
        success: false 
      });
    }

    // Verify the refresh token matches the stored one
    const isValidRefreshToken = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!isValidRefreshToken) {
      return res.status(401).json({ 
        message: "Invalid refresh token", 
        success: false 
      });
    }

    // Generate new token pair
    const { accessToken, refreshToken: newRefreshToken } = generateTokenPair(user._id);

    // Update refresh token in database
    user.refreshToken = await bcrypt.hash(newRefreshToken, 10);
    await user.save();

    // Set new cookies
    res.cookie("accessToken", accessToken, getCookieOptions(15 * 60 * 1000));
    res.cookie("refreshToken", newRefreshToken, getCookieOptions(7 * 24 * 60 * 60 * 1000));

    res.status(200).json({
      message: "Token refreshed successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error in refreshToken:", error);
    res.status(401).json({ 
      message: "Invalid or expired refresh token", 
      success: false 
    });
  }
};

// logout user: /api/user/logout
export const logout = async (req, res) => {
  try {
    const userId = req.user;

    // Clear refresh token from database
    if (userId) {
      await User.findByIdAndUpdate(userId, { 
        refreshToken: null 
      });
    }

    // Clear cookies
    res.clearCookie("accessToken", getCookieOptions(0));
    res.clearCookie("refreshToken", getCookieOptions(0));

    return res.status(200).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error in logout:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
