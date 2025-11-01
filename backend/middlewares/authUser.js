import { verifyAccessToken } from "../utils/jwtUtils.js";

const authUser = async (req, res, next) => {
  try {
    console.log('🔍 Auth middleware - Request headers:', req.headers);
    console.log('🔍 Auth middleware - Cookies:', req.cookies);
    
    // Check for token in cookies first, then in Authorization header
    let accessToken = req.cookies?.accessToken;
    
    // If not in cookies, check Authorization header
    if (!accessToken && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith('Bearer ')) {
        accessToken = authHeader.split(' ')[1];
      }
    }
    
    if (!accessToken) {
      console.log("❌ No access token found in cookies or Authorization header");
      return res.status(401).json({ 
        message: "Authentication required. Please login.", 
        success: false,
        code: "NO_TOKEN"
      });
    }

    try {
      // Verify access token
      const decoded = verifyAccessToken(accessToken);
      
      // Verify token type
      if (decoded.type !== "access") {
        console.log("❌ Invalid token type:", decoded.type);
        return res.status(401).json({ 
          message: "Invalid token type. Please login again.", 
          success: false,
          code: "INVALID_TOKEN_TYPE"
        });
      }

      // Attach user ID to request
      req.user = decoded.id;
      console.log(`✅ User authenticated: ${decoded.id}`);
      next();
    } catch (tokenError) {
      console.error("❌ Token verification failed:", tokenError);
      
      // Handle specific JWT errors
      if (tokenError.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          message: "Your session has expired. Please login again.", 
          success: false,
          code: "TOKEN_EXPIRED"
        });
      }
      
      if (tokenError.name === 'JsonWebTokenError') {
        return res.status(401).json({ 
          message: "Invalid authentication token. Please login again.", 
          success: false,
          code: "INVALID_TOKEN"
        });
      }
      
      // For other token-related errors
      return res.status(401).json({ 
        message: "Authentication failed. Please login again.", 
        success: false,
        code: "AUTH_FAILED",
        error: process.env.NODE_ENV === 'development' ? tokenError.message : undefined
      });
    }
  } catch (error) {
    console.error("❌ Auth middleware error:", error);
    
    // For unexpected errors
    res.status(500).json({ 
      message: "An unexpected error occurred. Please try again.", 
      success: false,
      code: "SERVER_ERROR",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export default authUser;
