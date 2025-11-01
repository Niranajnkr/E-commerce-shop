import jwt from "jsonwebtoken";

/**
 * Generate access token (short-lived)
 * @param {string} userId - User ID to encode in token
 * @returns {string} JWT access token
 */
export const generateAccessToken = (userId) => {
  return jwt.sign(
    { id: userId, type: "access" },
    process.env.JWT_SECRET,
    { 
      expiresIn: "15m", // 15 minutes for better security
      algorithm: "HS256"
    }
  );
};

/**
 * Generate refresh token (long-lived)
 * @param {string} userId - User ID to encode in token
 * @returns {string} JWT refresh token
 */
export const generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId, type: "refresh" },
    process.env.JWT_REFRESH_SECRET,
    { 
      expiresIn: "7d", // 7 days
      algorithm: "HS256"
    }
  );
};

/**
 * Verify access token
 * @param {string} token - JWT token to verify
 * @returns {object} Decoded token payload
 */
export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"]
    });
  } catch (error) {
    throw new Error("Invalid or expired access token");
  }
};

/**
 * Verify refresh token
 * @param {string} token - JWT refresh token to verify
 * @returns {object} Decoded token payload
 */
export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET, {
      algorithms: ["HS256"]
    });
  } catch (error) {
    throw new Error("Invalid or expired refresh token");
  }
};

/**
 * Set secure cookie options based on environment
 * @param {number} maxAge - Cookie max age in milliseconds
 * @returns {object} Cookie options
 */
export const getCookieOptions = (maxAge = 7 * 24 * 60 * 60 * 1000) => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  // For Render deployment, we need to set secure: true and sameSite: 'none'
  const options = {
    httpOnly: true,
    secure: isProduction, // true in production, false in development
    sameSite: isProduction ? 'none' : 'lax', // 'none' for cross-site in production
    maxAge,
    path: '/',
  };

  // Only set domain in production to avoid issues with localhost
  if (isProduction) {
    options.domain = '.onrender.com'; // Match your Render domain
  }

  return options;
};

/**
 * Generate both access and refresh tokens
 * @param {string} userId - User ID to encode in tokens
 * @returns {object} Object containing both tokens
 */
export const generateTokenPair = (userId) => {
  return {
    accessToken: generateAccessToken(userId),
    refreshToken: generateRefreshToken(userId)
  };
};
