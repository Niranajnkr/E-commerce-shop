# Token Storage Troubleshooting Guide

## Issue: Tokens Not Being Stored in Cookies

### Quick Fixes Applied:

1. **Changed `sameSite` from "strict" to "lax" in development**
   - "strict" can block cookies in some scenarios
   - "lax" provides good security while allowing cookies to work

2. **Added debug logging**
   - Check backend console for "✅ Tokens set successfully" message
   - Verify cookie options are correct

### How to Test:

#### 1. Check Backend Console
After login, you should see:
```
✅ Tokens set successfully for user: user@example.com
Cookie options: { httpOnly: true, secure: false, sameSite: 'lax', maxAge: 900000, path: '/' }
```

#### 2. Check Browser DevTools
1. Open DevTools (F12)
2. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
3. Click on **Cookies** → `http://localhost:5000`
4. You should see:
   - `accessToken` (expires in 15 min)
   - `refreshToken` (expires in 7 days)

#### 3. Check Network Tab
1. Open DevTools → **Network** tab
2. Login
3. Click on the login request
4. Go to **Response Headers**
5. Look for `Set-Cookie` headers:
```
Set-Cookie: accessToken=eyJhbGc...; Path=/; HttpOnly; SameSite=Lax
Set-Cookie: refreshToken=eyJhbGc...; Path=/; HttpOnly; SameSite=Lax
```

### Common Issues & Solutions:

#### Issue 1: Cookies Not Visible in DevTools
**Cause**: Looking in wrong domain
**Solution**: Check cookies under `localhost:5000` (backend), not `localhost:5173` (frontend)

#### Issue 2: "SameSite" Warning in Console
**Cause**: Browser security policy
**Solution**: Already fixed - using "lax" instead of "strict"

#### Issue 3: Cookies Cleared Immediately
**Cause**: CORS not configured properly
**Solution**: Verify these settings:

**Backend (index.js):**
```javascript
app.use(cors({ 
  origin: ["http://localhost:5173"], 
  credentials: true 
}));
```

**Frontend (AppContext.jsx):**
```javascript
axios.defaults.withCredentials = true;
```

#### Issue 4: "Secure" Cookie on HTTP
**Cause**: `secure: true` requires HTTPS
**Solution**: Already fixed - `secure: false` in development

### Manual Test with cURL:

```bash
# Login and save cookies
curl -X POST http://localhost:5000/api/user/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  -c cookies.txt \
  -v

# Check if cookies were saved
cat cookies.txt

# Use cookies in authenticated request
curl -X GET http://localhost:5000/api/user/is-auth \
  -b cookies.txt \
  -v
```

### Verify in Browser Console:

```javascript
// After login, run this in browser console:
document.cookie

// Should show something like:
// "accessToken=eyJhbGc...; refreshToken=eyJhbGc..."
```

**Note**: HttpOnly cookies won't show in `document.cookie` - this is correct and secure!
To verify they exist, check DevTools → Application → Cookies

### If Still Not Working:

1. **Clear all cookies**: DevTools → Application → Clear storage
2. **Restart backend server**: Stop and start again
3. **Hard refresh frontend**: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
4. **Check for browser extensions**: Disable ad blockers or privacy extensions
5. **Try incognito/private mode**: Rules out extension interference

### Expected Behavior:

✅ Login → Tokens set as httpOnly cookies
✅ API requests → Cookies sent automatically
✅ Token expires → Auto-refresh happens
✅ Logout → Cookies cleared

### Debug Checklist:

- [ ] Backend console shows "✅ Tokens set successfully"
- [ ] Network tab shows `Set-Cookie` headers in login response
- [ ] DevTools shows cookies under `localhost:5000`
- [ ] Subsequent API requests include cookies in headers
- [ ] No CORS errors in console
- [ ] `withCredentials: true` set in axios
- [ ] `credentials: true` set in CORS config

### Still Having Issues?

Check these files match the configuration:

1. **backend/.env**
   ```
   NODE_ENV=development
   ```

2. **backend/index.js**
   ```javascript
   app.use(cors({ origin: ["http://localhost:5173"], credentials: true }));
   ```

3. **client/src/context/AppContext.jsx**
   ```javascript
   axios.defaults.withCredentials = true;
   ```
