# Seller Orders Debugging Guide

## Issue Fixed:
✅ Route conflict resolved - `/api/order/seller` was being matched by `/:id` route

## Changes Made:

### 1. Backend Routes (`routes/order.routes.js`)
- Moved specific routes BEFORE dynamic `:id` route
- This prevents `/seller` from being treated as an ID parameter

### 2. Added Debug Logging
- Frontend: Console logs in Orders.jsx
- Backend: Console logs in order.controller.js

## How to Debug:

### Step 1: Check Backend Console
When you access the seller orders page, you should see:
```
📦 Fetching all orders for seller...
✅ Found X orders
```

### Step 2: Check Browser Console (F12)
You should see:
```
Fetching seller orders...
Orders response: { success: true, orders: [...] }
✅ Loaded X orders
```

### Step 3: Check Network Tab
1. Open DevTools (F12)
2. Go to Network tab
3. Refresh seller orders page
4. Look for request to `/api/order/seller`
5. Check:
   - Status: Should be 200
   - Response: Should have `success: true` and `orders` array

## Common Issues & Solutions:

### Issue 1: 401 Unauthorized
**Cause**: Not logged in as seller
**Solution**: 
1. Go to `/seller-login`
2. Login with seller credentials
3. Try again

### Issue 2: Empty Orders Array
**Cause**: No orders in database
**Solution**: 
1. Login as customer
2. Place a test order (COD or Online)
3. Go back to seller dashboard
4. Orders should now appear

### Issue 3: 500 Internal Server Error
**Cause**: Database connection or query issue
**Solution**: Check backend console for error details

### Issue 4: CORS Error
**Cause**: Frontend can't reach backend
**Solution**: 
1. Verify backend is running on port 5000
2. Check CORS settings in `backend/index.js`
3. Ensure `credentials: true` is set

## Test Checklist:

- [ ] Backend server is running
- [ ] Logged in as seller
- [ ] At least one order exists in database
- [ ] Browser console shows no errors
- [ ] Network request returns 200 status
- [ ] Orders appear on the page

## Expected Behavior:

1. **Login as Seller** → Redirected to `/seller`
2. **Click "Orders" in sidebar** → Navigate to `/seller/orders`
3. **Page loads** → Shows:
   - Statistics cards (Total, Pending, In Transit, Delivered)
   - Filter tabs
   - Orders table with all orders
4. **Click "Update Status"** → Modal opens
5. **Change status and save** → Order updates, page refreshes

## Seller Credentials:

Check your `.env` file:
```env
SELLER_EMAIL="admin@gmail.com"
SELLER_PASSWORD="admin123"
```

## API Endpoints:

```
GET  /api/order/seller          - Get all orders (seller only)
POST /api/order/update-status   - Update order status (seller only)
```

## Still Not Working?

1. **Restart backend server** (Ctrl+C, then `npm run dev`)
2. **Clear browser cache** (Ctrl+Shift+Delete)
3. **Check if seller is authenticated**:
   - Open DevTools → Application → Cookies
   - Look for `sellerToken` cookie
   - Should exist and not be expired

4. **Verify database connection**:
   - Check backend console for MongoDB connection message
   - Ensure MONGO_URI is correct in `.env`

5. **Test with Postman/Thunder Client**:
   ```
   GET http://localhost:5000/api/order/seller
   Headers:
   - Cookie: sellerToken=YOUR_TOKEN
   ```

## Success Indicators:

✅ Backend console: "📦 Fetching all orders for seller..."
✅ Backend console: "✅ Found X orders"
✅ Browser console: "✅ Loaded X orders"
✅ Page shows statistics and orders table
✅ Can filter orders by status
✅ Can update order status
