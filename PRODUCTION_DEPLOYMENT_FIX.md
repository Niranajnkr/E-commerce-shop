# Production Deployment Fix Guide

## Issue: Login works on localhost but fails on Render deployment

### Root Causes Fixed:
1. ✅ Cookie domain configuration removed (was hardcoded to `.onrender.com`)
2. ✅ CORS credentials properly configured
3. ✅ SameSite cookie policy set correctly for production

---

## Environment Variables Required on Render

### Backend Service (.env):
```env
NODE_ENV=production
PORT=5000

# Database
MONGODB_URI=your_mongodb_connection_string

# JWT Secrets (MUST be different from development)
JWT_SECRET=your_super_secret_jwt_key_production
JWT_REFRESH_SECRET=your_super_secret_refresh_key_production

# Frontend URL (your deployed frontend)
FRONTEND_URL=https://your-frontend.onrender.com

# Cloudinary
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Seller Credentials
SELLER_EMAIL=admin@example.com
SELLER_PASSWORD=your_secure_seller_password

# Razorpay (if using payments)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

### Frontend Service (.env):
```env
VITE_BACKEND_URL=https://your-backend.onrender.com
```

---

## Render Configuration Steps

### Backend Service:
1. **Build Command**: `npm install`
2. **Start Command**: `npm start` or `node index.js`
3. **Environment**: Node
4. **Auto-Deploy**: Yes

### Frontend Service:
1. **Build Command**: `npm install && npm run build`
2. **Start Command**: `npm run preview` or use static site
3. **Publish Directory**: `dist`

---

## CORS Configuration Checklist

✅ **Backend `index.js` - Update allowed origins:**
```javascript
const allowedOrigins = [
  'http://localhost:5173',
  'https://your-frontend.onrender.com',  // ← Add your actual frontend URL
  process.env.FRONTEND_URL
].filter(Boolean);
```

✅ **CORS options must include:**
- `credentials: true` ✅ (Already set)
- `origin: function` ✅ (Already set)
- `methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']` ✅ (Already set)

---

## Cookie Configuration (Already Fixed)

✅ **Production cookies now use:**
- `httpOnly: true` - Prevents XSS attacks
- `secure: true` - Requires HTTPS (Render provides this)
- `sameSite: 'none'` - Allows cross-origin cookies
- `path: '/'` - Available across entire site
- **NO domain restriction** - Works with any deployment

---

## Frontend API Client Configuration

✅ **Ensure `apiClient.js` has:**
```javascript
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000',
  withCredentials: true,  // ← CRITICAL for cookies
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});
```

---

## Deployment Checklist

### Before Deploying:
- [ ] Set all environment variables on Render
- [ ] Update CORS allowed origins with your frontend URL
- [ ] Ensure MongoDB is accessible (whitelist Render IPs or use 0.0.0.0/0)
- [ ] Verify Cloudinary credentials
- [ ] Test with a simple user registration first

### After Deploying:
- [ ] Check Render logs for any errors
- [ ] Test registration (should work)
- [ ] Test login (should work now)
- [ ] Verify cookies are being set (check browser DevTools → Application → Cookies)
- [ ] Test seller login
- [ ] Test cart functionality

---

## Debugging Production Issues

### Check Browser Console:
1. Open DevTools (F12)
2. Go to **Network** tab
3. Try to login
4. Check the login request:
   - Status should be `200 OK`
   - Response should have `success: true`
   - Check **Cookies** tab in request details

### Check Render Logs:
1. Go to your Render dashboard
2. Click on your backend service
3. Check **Logs** tab
4. Look for:
   - `Login request received:` - Shows login attempts
   - `✅ User authenticated:` - Shows successful auth
   - Any error messages

### Common Issues:

**Issue**: "CORS blocked request"
- **Fix**: Add your frontend URL to `allowedOrigins` in `backend/index.js`

**Issue**: Cookies not being set
- **Fix**: Ensure `withCredentials: true` in frontend `apiClient.js`
- **Fix**: Ensure HTTPS is enabled (Render does this automatically)

**Issue**: "Invalid or expired token"
- **Fix**: Clear browser cookies and try again
- **Fix**: Verify JWT_SECRET is set in Render environment variables

**Issue**: "User not found"
- **Fix**: Register a new user on production (production DB is separate from local)

---

## Testing Production Login

### Step 1: Register a Test User
```
POST https://your-backend.onrender.com/api/user/register
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "test123"
}
```

### Step 2: Login with Test User
```
POST https://your-backend.onrender.com/api/user/login
{
  "email": "test@example.com",
  "password": "test123"
}
```

### Step 3: Verify Authentication
```
GET https://your-backend.onrender.com/api/user/is-auth
```

Should return user data if cookies are working correctly.

---

## Files Modified for Production Fix:

1. ✅ `backend/utils/jwtUtils.js` - Removed hardcoded domain
2. ✅ `backend/controller/user.controller.js` - Added better logging
3. ✅ `client/src/modals/Auth.jsx` - Fixed to use `apiClient` instead of `axios`
4. ✅ `client/src/context/AppContext.jsx` - Added proper error handling
5. ✅ `client/src/utils/auth.js` - Added null checks

---

## Success Indicators:

✅ Login works on localhost  
✅ Login works on production  
✅ Cookies are set correctly  
✅ User stays logged in after page refresh  
✅ Cart data persists  
✅ Protected routes work  

---

## Support

If you still face issues after following this guide:

1. Check Render logs for specific error messages
2. Verify all environment variables are set correctly
3. Ensure your frontend URL is added to CORS allowed origins
4. Clear browser cache and cookies
5. Try in incognito mode to rule out cached data

**Remember**: Production uses a separate database, so you need to register users again on production!
