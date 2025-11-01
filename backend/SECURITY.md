# JWT Security Implementation

## Overview
This application implements a secure JWT-based authentication system with the following features:

## Security Features

### 1. **Dual Token System (Access + Refresh)**
- **Access Token**: Short-lived (15 minutes) for API requests
- **Refresh Token**: Long-lived (7 days) for obtaining new access tokens
- Reduces exposure window if tokens are compromised

### 2. **Strong Cryptographic Secrets**
- 256-bit cryptographically secure JWT secrets
- Separate secrets for access and refresh tokens
- Stored securely in environment variables

### 3. **Enhanced Password Security**
- bcrypt with cost factor of 12 for password hashing
- Refresh tokens are hashed before storing in database
- No plaintext sensitive data in database

### 4. **Secure Cookie Configuration**
- `httpOnly`: Prevents XSS attacks by blocking JavaScript access
- `secure`: HTTPS-only in production
- `sameSite`: CSRF protection (strict in dev, none in production for cross-origin)
- Proper path and maxAge settings

### 5. **Token Validation**
- Type checking (access vs refresh tokens)
- Algorithm specification (HS256)
- Expiration validation
- Signature verification

### 6. **Automatic Token Refresh**
- Frontend axios interceptor detects expired tokens
- Automatically refreshes using refresh token
- Queues failed requests during refresh
- Seamless user experience

### 7. **Token Rotation**
- New refresh token issued on each refresh
- Old refresh token invalidated
- Prevents token reuse attacks

### 8. **Secure Logout**
- Clears refresh token from database
- Clears all authentication cookies
- Prevents token reuse after logout

### 9. **User Activity Tracking**
- `lastLogin` timestamp
- `createdAt` and `updatedAt` timestamps
- Audit trail for security monitoring

## API Endpoints

### User Authentication
```
POST /api/user/register     - Register new user (no auto-login)
POST /api/user/login         - Login and receive tokens
POST /api/user/refresh-token - Refresh access token
GET  /api/user/is-auth       - Check authentication status (requires auth)
GET  /api/user/logout        - Logout and clear tokens (requires auth)
```

### Seller Authentication
```
POST /api/seller/login       - Seller login
GET  /api/seller/is-auth     - Check seller auth (requires auth)
GET  /api/seller/logout      - Seller logout (requires auth)
```

## Token Flow

### Registration Flow
1. User submits registration form
2. Password hashed with bcrypt (cost: 12)
3. User saved to database
4. **No tokens issued** - user must login separately
5. Frontend redirects to login form

### Login Flow
1. User submits credentials
2. Password verified with bcrypt
3. Access token (15min) and refresh token (7d) generated
4. Refresh token hashed and stored in database
5. Both tokens set as httpOnly cookies
6. User data returned (without password)

### Token Refresh Flow
1. Access token expires during API request
2. Frontend interceptor catches 401 with TOKEN_EXPIRED code
3. Automatic refresh token request sent
4. Backend verifies refresh token against database
5. New token pair generated and issued
6. Original request retried with new access token
7. Process transparent to user

### Logout Flow
1. User initiates logout
2. Refresh token cleared from database
3. All auth cookies cleared
4. User redirected to home

## Environment Variables

Required in `.env`:
```env
JWT_SECRET=<256-bit-hex-string>
JWT_REFRESH_SECRET=<256-bit-hex-string>
NODE_ENV=development|production
```

## Security Best Practices Implemented

✅ Separation of concerns (access vs refresh tokens)
✅ Short-lived access tokens minimize exposure
✅ Refresh tokens stored hashed in database
✅ HttpOnly cookies prevent XSS attacks
✅ SameSite cookies prevent CSRF attacks
✅ Secure flag for HTTPS in production
✅ Token type validation
✅ Algorithm specification prevents attacks
✅ Automatic token rotation
✅ Proper error codes for client handling
✅ Password hashing with high cost factor
✅ No sensitive data in JWT payload
✅ Token invalidation on logout
✅ Activity tracking for audit

## Error Codes

Frontend can handle these error codes:
- `NO_TOKEN`: No access token found
- `TOKEN_EXPIRED`: Access token expired (triggers refresh)
- `INVALID_TOKEN_TYPE`: Wrong token type used
- `INVALID_TOKEN`: Malformed or invalid token

## Monitoring & Maintenance

### Regular Tasks
- Rotate JWT secrets periodically (every 90 days recommended)
- Monitor failed authentication attempts
- Review user activity logs
- Update bcrypt cost factor as hardware improves

### Security Alerts
- Multiple failed login attempts
- Refresh token reuse attempts
- Unusual login patterns
- Token validation failures

## Additional Recommendations

1. **Rate Limiting**: Implement rate limiting on auth endpoints
2. **IP Tracking**: Log IP addresses for suspicious activity detection
3. **2FA**: Consider adding two-factor authentication
4. **Password Policy**: Enforce strong password requirements
5. **Session Management**: Add ability to view/revoke active sessions
6. **Audit Logs**: Comprehensive logging of all auth events
7. **Token Blacklist**: Consider Redis-based token blacklist for immediate revocation

## Testing

Test the following scenarios:
- [ ] Registration without auto-login
- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Access protected route with valid token
- [ ] Access protected route with expired token (auto-refresh)
- [ ] Access protected route with no token
- [ ] Logout and attempt to use old tokens
- [ ] Refresh token after access token expires
- [ ] Concurrent requests during token refresh

## Compliance

This implementation helps meet requirements for:
- OWASP Top 10 security standards
- GDPR data protection requirements
- PCI DSS authentication requirements
- SOC 2 access control standards
