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
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please fill all the fields", success: false });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "User does not exist", success: false });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Invalid credentials", success: false });
    }

    // Generate secure token pair
    const { accessToken, refreshToken } = generateTokenPair(user._id);

    // Store refresh token in database (hashed for security)
    user.refreshToken = await bcrypt.hash(refreshToken, 10);
    user.lastLogin = new Date();
    await user.save();

    // Set secure cookies
    const cookieOptions = getCookieOptions(15 * 60 * 1000);
    res.cookie("accessToken", accessToken, cookieOptions);
    res.cookie("refreshToken", refreshToken, getCookieOptions(7 * 24 * 60 * 60 * 1000));

    console.log("✅ Tokens set successfully for user:", user.email);
    console.log("Cookie options:", cookieOptions);

    res.status(200).json({
      message: "Logged in successfully",
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error in loginUser:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// check auth : /api/user/is-auth
export const checkAuth = async (req, res) => {
  try {
    const userId = req.user;

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error in checkAuth:", error);
    res.status(500).json({ message: "Internal server error" });
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
