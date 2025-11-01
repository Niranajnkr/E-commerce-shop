import { generateAccessToken, getCookieOptions } from "../utils/jwtUtils.js";

// seller login :/api/seller/login
export const sellerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Input validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Check credentials against environment variables
    if (password !== process.env.SELLER_PASSWORD || email !== process.env.SELLER_EMAIL) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate secure access token with seller identifier
    const token = generateAccessToken(`seller_${email}`);
    
    // Set HTTP-only secure cookie
    res.cookie("sellerToken", token, {
      ...getCookieOptions(7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production'
    });
    
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        email: email,
        role: 'seller'
      }
    });
    
  } catch (error) {
    console.error("Error in sellerLogin:", error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during login. Please try again.'
    });
  }
};

// check seller auth  : /api/seller/is-auth
export const checkAuth = async (req, res) => {
  try {
    // The authSeller middleware has already verified the token
    // and attached the seller email to req.seller
    const sellerEmail = req.seller;
    
    // In a real app, you might want to fetch additional seller data here
    res.status(200).json({
      success: true,
      user: {
        email: sellerEmail || process.env.SELLER_EMAIL,
        role: 'seller',
        isAuthenticated: true
      }
    });
  } catch (error) {
    console.error("Error in checkAuth:", error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify authentication status'
    });
  }
};
// logout seller: /api/seller/logout
export const sellerLogout = async (req, res) => {
  try {
    res.clearCookie("sellerToken", getCookieOptions(0));
    
    return res.status(200).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error in logout:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
