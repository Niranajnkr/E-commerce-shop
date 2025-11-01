import { verifyAccessToken } from "../utils/jwtUtils.js";

const authUser = async (req, res, next) => {
  try {
    const { accessToken } = req.cookies;
    
    console.log("🔍 Auth middleware - Cookies received:", Object.keys(req.cookies));
    
    if (!accessToken) {
      console.log("❌ No access token found in cookies");
      return res.status(401).json({ 
        message: "Access token not found. Please login.", 
        success: false,
        code: "NO_TOKEN"
      });
    }

    // Verify access token
    const decoded = verifyAccessToken(accessToken);
    
    // Verify token type
    if (decoded.type !== "access") {
      return res.status(401).json({ 
        message: "Invalid token type", 
        success: false,
        code: "INVALID_TOKEN_TYPE"
      });
    }

    // Attach user ID to request
    req.user = decoded.id;
    next();
  } catch (error) {
    console.error("Error in authUser middleware:", error);
    
    // Check if token is expired
    if (error.message.includes("expired")) {
      return res.status(401).json({ 
        message: "Access token expired. Please refresh.", 
        success: false,
        code: "TOKEN_EXPIRED"
      });
    }
    
    return res.status(401).json({ 
      message: "Invalid or malformed token", 
      success: false,
      code: "INVALID_TOKEN"
    });
  }
};

export default authUser;
