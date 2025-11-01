# 🚀 RENDER SETUP - Step by Step Guide

## ⚠️ CRITICAL: You MUST do these steps on Render Dashboard!

The code is deployed, but **environment variables are NOT set automatically**. You must set them manually on Render.

---

## 📋 Step-by-Step Instructions

### STEP 1: Go to Render Dashboard
1. Open: https://dashboard.render.com/
2. Login to your account
3. You should see your services listed

---

### STEP 2: Configure Backend Service

#### A. Click on your Backend service
- Service name: `e-commerce-shop-tal7` (or similar)
- Type: Web Service

#### B. Go to "Environment" Tab
- Click on **"Environment"** in the left sidebar

#### C. Add These Environment Variables

Click **"Add Environment Variable"** and add each one:

```
Key: NODE_ENV
Value: production
```

```
Key: PORT
Value: 5000
```

```
Key: MONGO_URI
Value: mongodb+srv://niranjan:2oNhCTamztsaPzEa@cluster0.ikcxhi8.mongodb.net/?appName=Cluster0
```

```
Key: JWT_SECRET
Value: 8f3a9b2c7d1e6f4a5b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a
```

```
Key: JWT_REFRESH_SECRET
Value: 2b7e151628aed2a6abf7158809cf4f3c762e7160f38b4da56a784d9045190cfe
```

```
Key: FRONTEND_URL
Value: https://grocery-store-j1we.onrender.com
```

```
Key: CLOUDINARY_CLOUD_NAME
Value: dpuqnbikq
```

```
Key: CLOUDINARY_API_KEY
Value: 475778881531154
```

```
Key: CLOUDINARY_API_SECRET
Value: vRS9Jg_OV86WifoujBAN4G_VYac
```

```
Key: RAZORPAY_KEY_ID
Value: rzp_test_RYRg4JzB8LBUcB
```

```
Key: RAZORPAY_KEY_SECRET
Value: oX0lhvq7GYtiGfQEqbBzsweB
```

```
Key: SELLER_EMAIL
Value: admin@gmail.com
```

```
Key: SELLER_PASSWORD
Value: admin123
```

#### D. Save Changes
- Click **"Save Changes"** button at the bottom
- Render will automatically redeploy your backend

---

### STEP 3: Configure Frontend Service

#### A. Click on your Frontend service
- Service name: `grocery-store-j1we` (or similar)
- Type: Static Site or Web Service

#### B. Go to "Environment" Tab

#### C. Add This Environment Variable

```
Key: VITE_BACKEND_URL
Value: https://e-commerce-shop-tal7.onrender.com
```

#### D. Save and Redeploy
- Click **"Save Changes"**
- Click **"Manual Deploy"** → **"Deploy latest commit"**

---

### STEP 4: Wait for Deployment

Both services will redeploy. This takes 2-5 minutes.

**Watch the "Logs" tab** to see deployment progress:
- ✅ "Build successful"
- ✅ "Deploy live"
- ✅ "Server is running on port 5000"

---

### STEP 5: Test Your Application

#### A. Test Health Check
Visit: `https://e-commerce-shop-tal7.onrender.com/health`

Should show:
```json
{
  "status": "OK",
  "environment": "production",  ← MUST be "production"
  "timestamp": "2025-11-01T...",
  "allowedOrigins": [
    "http://localhost:5173",
    "https://grocery-store-j1we.onrender.com",
    "https://e-commerce-shop-tal7.onrender.com"
  ]
}
```

**If it shows `"environment": "development"` → You didn't set NODE_ENV correctly!**

#### B. Test Frontend
Visit: `https://grocery-store-j1we.onrender.com`

#### C. Test Registration
1. Click "Sign up here" or "Register"
2. Fill in:
   - Name: Test User
   - Email: test@example.com
   - Password: test123
3. Click "Create Account"
4. Should show success message

#### D. Test Login
1. Click "Login"
2. Fill in:
   - Email: test@example.com
   - Password: test123
3. Click "Login"
4. Should login successfully and close modal

#### E. Check Browser Console
1. Press F12
2. Go to Console tab
3. Should see:
   - `🔐 Attempting login with: { email: "test@example.com" }`
   - `🔐 Login result: { success: true, message: "..." }`

#### F. Check Cookies
1. Press F12
2. Go to Application tab
3. Click Cookies → `https://grocery-store-j1we.onrender.com`
4. Should see:
   - `accessToken` cookie
   - `refreshToken` cookie

---

## 🔍 Troubleshooting

### Problem: Health check shows "development"
**Solution**: You didn't set `NODE_ENV=production` on Render
- Go back to Step 2C and add it
- Make sure you clicked "Save Changes"

### Problem: CORS error in console
**Solution**: Frontend URL not in allowed origins
- Check that `FRONTEND_URL` is set correctly on backend
- Check Render logs for "CORS blocked request from origin"

### Problem: "Something went wrong" on login
**Solution**: Check these in order:
1. Health check shows `"environment": "production"` ✅
2. `FRONTEND_URL` is set on backend ✅
3. `VITE_BACKEND_URL` is set on frontend ✅
4. Both services have redeployed ✅
5. You registered a user on production ✅

### Problem: No error in console
**Solution**: Open browser console BEFORE clicking login
- F12 → Console tab
- Then try to login
- Logs will appear

### Problem: Cookies not being set
**Solution**: 
1. Check health endpoint shows `production`
2. Clear all cookies (F12 → Application → Clear storage)
3. Try in incognito mode

---

## 📊 Render Dashboard Checklist

### Backend Service (`e-commerce-shop-tal7`)

**Environment Tab:**
- [ ] NODE_ENV = production
- [ ] PORT = 5000
- [ ] MONGO_URI = (your MongoDB connection)
- [ ] JWT_SECRET = (your secret)
- [ ] JWT_REFRESH_SECRET = (your secret)
- [ ] FRONTEND_URL = https://grocery-store-j1we.onrender.com
- [ ] CLOUDINARY_CLOUD_NAME = dpuqnbikq
- [ ] CLOUDINARY_API_KEY = 475778881531154
- [ ] CLOUDINARY_API_SECRET = (your secret)
- [ ] RAZORPAY_KEY_ID = (your key)
- [ ] RAZORPAY_KEY_SECRET = (your secret)
- [ ] SELLER_EMAIL = admin@gmail.com
- [ ] SELLER_PASSWORD = admin123

**Settings Tab:**
- [ ] Build Command: `npm install`
- [ ] Start Command: `npm start` or `node index.js`
- [ ] Auto-Deploy: Yes

**Logs Tab:**
- [ ] Shows "Server is running on port 5000"
- [ ] No error messages

### Frontend Service (`grocery-store-j1we`)

**Environment Tab:**
- [ ] VITE_BACKEND_URL = https://e-commerce-shop-tal7.onrender.com

**Settings Tab:**
- [ ] Build Command: `npm install && npm run build`
- [ ] Publish Directory: `dist`
- [ ] Auto-Deploy: Yes

---

## 🎯 Why This Happens

**Local `.env` files are NOT uploaded to Render!**

When you push to GitHub:
- ✅ Code is pushed
- ❌ `.env` files are NOT pushed (they're in `.gitignore`)

So on Render:
- ✅ Your code is there
- ❌ Environment variables are EMPTY

**You MUST set them manually on Render dashboard!**

---

## ✅ Success Indicators

After setting all environment variables:

1. **Health check shows:**
   ```json
   { "environment": "production" }
   ```

2. **Can register new user** ✅

3. **Can login with that user** ✅

4. **No "Something went wrong" error** ✅

5. **Cookies visible in DevTools** ✅

6. **Console shows login logs** ✅

7. **User stays logged in after refresh** ✅

---

## 📞 Still Not Working?

### Check Render Logs:
1. Go to backend service
2. Click "Logs" tab
3. Look for error messages
4. Share the error here

### Check Browser Console:
1. F12 → Console
2. Try to login
3. Share the console output

### Check Network Tab:
1. F12 → Network
2. Try to login
3. Find the `login` request
4. Check status code and response

---

## 🔑 Key Points

1. **Environment variables MUST be set on Render dashboard**
2. **NODE_ENV MUST be "production"** (most important!)
3. **FRONTEND_URL MUST match your frontend URL**
4. **VITE_BACKEND_URL MUST match your backend URL**
5. **Both services must redeploy after setting variables**
6. **Production database is empty - register new users**

---

## 📝 Quick Reference

**Backend URL**: https://e-commerce-shop-tal7.onrender.com
**Frontend URL**: https://grocery-store-j1we.onrender.com
**Health Check**: https://e-commerce-shop-tal7.onrender.com/health

**Test User** (after registration):
- Email: test@example.com
- Password: test123

**Seller Login**:
- Email: admin@gmail.com
- Password: admin123

---

**Remember**: The #1 reason login fails is `NODE_ENV` not being set to `production` on Render!
