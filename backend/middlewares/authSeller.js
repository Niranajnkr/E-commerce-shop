import { verifyAccessToken } from "../utils/jwtUtils.js";

export const authSeller = async (req, res, next) => {
  try {
    const { sellerToken } = req.cookies;
    
    if (!sellerToken) {
      return res.status(401).json({ 
        message: "Unauthorized. Seller token required.", 
        success: false,
        code: "NO_TOKEN"
      });
    }

    try {
      // Verify seller token
      const decoded = verifyAccessToken(sellerToken);
      
      // Verify it's a seller token and matches the admin email
      if (decoded.id && decoded.id.startsWith("seller_")) {
        const sellerEmail = decoded.id.replace("seller_", "");
        if (sellerEmail === process.env.SELLER_EMAIL) {
          req.seller = sellerEmail;
          return next();
        }
      }
      
      return res.status(403).json({ 
        message: "Forbidden. Invalid seller credentials.", 
        success: false,
        code: "INVALID_CREDENTIALS"
      });
    } catch (tokenError) {
      console.error("Token verification error:", tokenError.message);
      
      if (tokenError.message.includes("expired") || tokenError.name === "TokenExpiredError") {
        return res.status(401).json({ 
          message: "Seller token expired. Please login again.", 
          success: false,
          code: "TOKEN_EXPIRED"
        });
      }
      
      if (tokenError.message.includes("invalid") || tokenError.name === "JsonWebTokenError") {
        return res.status(401).json({ 
          message: "Invalid seller token. Please login again.", 
          success: false,
          code: "INVALID_TOKEN"
        });
      }
      
      throw tokenError;
    }
  } catch (error) {
    console.error("Error in authSeller middleware:", error);
    
    return res.status(401).json({ 
      message: "Authentication failed. Please login again.", 
      success: false,
      code: "AUTH_ERROR"
    });
  }
};
