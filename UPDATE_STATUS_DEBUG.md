# Update Order Status - Debugging Guide

## Debug Logging Added ✅

### Backend Console Will Show:
```
📝 Update order status request: { orderId: '...', status: '...', note: '...' }
🔍 Finding order: 67...
📦 Current status: Order Placed → New status: Processing
✅ Order status updated successfully
```

### Browser Console Will Show:
```
📝 Updating order status: { orderId: '...', status: 'Processing', note: '...' }
Response: { success: true, message: '...', order: {...} }
```

## How to Test:

### Step 1: Open Browser Console
- Press F12
- Go to Console tab
- Keep it open

### Step 2: Navigate to Seller Orders
1. Login as seller
2. Go to Orders page
3. You should see orders listed

### Step 3: Update Status
1. Click "Update Status" button on any order
2. Modal opens
3. Select new status from dropdown
4. (Optional) Add a note
5. Click "Update Status" button

### Step 4: Check Logs

**Browser Console should show:**
```javascript
📝 Updating order status: {
  orderId: "67abc123...",
  status: "Processing",
  note: "Order being prepared"
}
Response: { success: true, message: "Order status updated successfully", order: {...} }
```

**Backend Console should show:**
```
📝 Update order status request: { orderId: '67abc123...', status: 'Processing', note: 'Order being prepared' }
🔍 Finding order: 67abc123...
📦 Current status: Order Placed → New status: Processing
✅ Order status updated successfully
```

## Common Issues & Solutions:

### Issue 1: "Please select a status" error
**Cause**: No status selected in dropdown
**Solution**: Make sure to select a status before clicking update

### Issue 2: 401 Unauthorized
**Cause**: Not authenticated as seller
**Solution**: 
- Logout and login again as seller
- Check if `sellerToken` cookie exists (DevTools → Application → Cookies)

### Issue 3: 404 Order not found
**Cause**: Invalid order ID
**Solution**: 
- Check backend console for the order ID being sent
- Verify order exists in database

### Issue 4: Modal doesn't close after update
**Cause**: JavaScript error or network issue
**Solution**: 
- Check browser console for errors
- Verify backend response is successful

### Issue 5: Status doesn't change on page
**Cause**: Page not refreshing after update
**Solution**: 
- Check if `fetchOrders()` is being called
- Manually refresh the page

## Expected Flow:

1. **Click "Update Status"** 
   → Modal opens
   → Current status shown
   → Dropdown pre-selected with current status

2. **Select New Status**
   → Dropdown changes
   → Can add optional note

3. **Click "Update Status" Button**
   → Loading state (if implemented)
   → Request sent to backend
   → Backend validates and updates
   → Success toast appears
   → Modal closes
   → Orders list refreshes
   → New status visible

## Status Options Available:

1. ✅ Order Placed
2. ⏳ Processing
3. 📦 Shipped
4. 🚚 Out for Delivery
5. ✔️ Delivered
6. ❌ Cancelled

## Special Behaviors:

### When Status = "Delivered":
- `deliveredAt` timestamp set
- If payment type is COD → `isPaid` set to `true`
- Backend logs: "💰 COD order marked as paid"

### When Status = "Cancelled":
- `cancelledAt` timestamp set
- `cancellationReason` saved
- Backend logs: "🚫 Order cancelled"

## Network Tab Check:

1. Open DevTools (F12)
2. Go to Network tab
3. Click "Update Status"
4. Look for request to `/api/order/update-status`
5. Check:
   - **Method**: POST
   - **Status**: 200 (success)
   - **Request Payload**: Contains orderId, status, note
   - **Response**: `{ success: true, message: "...", order: {...} }`

## If Still Not Working:

### Check 1: Verify Route is Registered
In `backend/routes/order.routes.js`:
```javascript
router.post("/update-status", authSeller, updateOrderStatus);
```

### Check 2: Verify Seller Authentication
Backend console should NOT show:
```
❌ Unauthorized
❌ Forbidden
```

### Check 3: Check Order Model
Order must have `statusHistory` array field.

### Check 4: Database Connection
Verify MongoDB is connected:
```
✅ MongoDB connected successfully
```

### Check 5: Test with Postman
```
POST http://localhost:5000/api/order/update-status
Headers:
  Cookie: sellerToken=YOUR_TOKEN
Body (JSON):
{
  "orderId": "67abc123...",
  "status": "Processing",
  "note": "Test update"
}
```

## Success Indicators:

✅ Modal opens when clicking "Update Status"
✅ Dropdown shows all status options
✅ Can select new status
✅ Can add note (optional)
✅ Backend console shows update logs
✅ Browser console shows request/response
✅ Success toast appears
✅ Modal closes
✅ Orders list refreshes
✅ New status visible in table
✅ Status badge color changes

## Quick Test:

1. Find any order with status "Order Placed"
2. Click "Update Status"
3. Change to "Processing"
4. Add note: "Test update"
5. Click "Update Status"
6. Should see success message
7. Order status should change to "Processing"
8. Status badge should be yellow
