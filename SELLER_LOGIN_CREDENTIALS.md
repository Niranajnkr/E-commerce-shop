# 🔐 Seller Login Credentials

## ⚠️ IMPORTANT: Use These Credentials on Production

### Seller Login Credentials (From .env):
```
Email: admin@gmail.com
Password: admin123
```

**NOT**: `mohammedsohail243@gmail.com` ❌

---

## Why Your Login Failed

You tried to login with: `mohammedsohail243@gmail.com`

But the seller credentials set in your `.env` file are:
- `SELLER_EMAIL=admin@gmail.com`
- `SELLER_PASSWORD=admin123`

---

## How Seller Login Works

The seller login is **NOT a database user**. It's hardcoded credentials from environment variables.

### Backend Code (`seller.controller.js`):
```javascript
export const loginSeller = async (req, res) => {
  const { email, password } = req.body;
  
  // Check against environment variables
  if (email === process.env.SELLER_EMAIL && 
      password === process.env.SELLER_PASSWORD) {
    // Login successful
  } else {
    // Login failed
  }
}
```

---

## ✅ Correct Login Steps

### On Production (Render):

1. Go to: `https://grocery-store-j1we.onrender.com/seller`

2. Use these credentials:
   ```
   Email: admin@gmail.com
   Password: admin123
   ```

3. Click "Login to Dashboard"

4. Should login successfully

---

## 🔍 If Still Not Working

### Check Render Environment Variables:

Make sure these are set on your **backend service**:

```
SELLER_EMAIL=admin@gmail.com
SELLER_PASSWORD=admin123
```

### Check Browser Console:

1. Press F12
2. Go to Console tab
3. Try to login
4. Look for:
   - `🔐 Seller login attempt: { email: "..." }`
   - `🔐 Seller login response: { ... }`
   - Any error messages

### Check Backend Logs on Render:

1. Go to Render dashboard
2. Click backend service
3. Click "Logs" tab
4. Try to login
5. Look for seller login logs

---

## 📝 Different Credentials for Different Environments

### Local Development:
```
Email: admin@gmail.com
Password: admin123
```

### Production (Render):
```
Email: admin@gmail.com
Password: admin123
```

(Same credentials, but must be set as environment variables on Render)

---

## 🔄 To Change Seller Credentials

### 1. Update on Render:
- Go to backend service
- Environment tab
- Update `SELLER_EMAIL` and `SELLER_PASSWORD`
- Save and redeploy

### 2. Update local `.env`:
```env
SELLER_EMAIL=your_new_email@example.com
SELLER_PASSWORD=your_new_password
```

---

## ✅ Test Seller Login

### Step 1: Try with correct credentials
```
Email: admin@gmail.com
Password: admin123
```

### Step 2: Check console logs
Should see:
```
🔐 Seller login attempt: { email: "admin@gmail.com" }
🔐 Seller login response: { success: true, message: "..." }
```

### Step 3: Should redirect to seller dashboard
URL should change to: `/seller/dashboard` or `/seller/products`

---

## 🚨 Common Mistakes

### ❌ Wrong Email
Using `mohammedsohail243@gmail.com` instead of `admin@gmail.com`

### ❌ Environment Variables Not Set
`SELLER_EMAIL` and `SELLER_PASSWORD` not set on Render

### ❌ Wrong Password
Password doesn't match `SELLER_PASSWORD` environment variable

### ❌ Typos
Extra spaces or wrong capitalization

---

## 📞 Still Having Issues?

### Debug Checklist:

1. **Check Render environment variables**:
   - [ ] `SELLER_EMAIL` is set
   - [ ] `SELLER_PASSWORD` is set
   - [ ] Values match what you're typing

2. **Check browser console**:
   - [ ] See login attempt log
   - [ ] See response log
   - [ ] Check for error messages

3. **Check backend logs on Render**:
   - [ ] See login request received
   - [ ] Check for authentication errors

4. **Try exact credentials**:
   ```
   admin@gmail.com
   admin123
   ```

---

## 🎯 Summary

**Use these credentials on production:**
- Email: `admin@gmail.com`
- Password: `admin123`

**Make sure these are set on Render backend:**
- `SELLER_EMAIL=admin@gmail.com`
- `SELLER_PASSWORD=admin123`

**Then login should work!** ✅
