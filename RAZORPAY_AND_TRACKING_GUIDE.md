# 🚀 Razorpay Payment & Order Tracking System - Complete Guide

## 📋 Table of Contents
1. [Installation](#installation)
2. [Features Implemented](#features-implemented)
3. [Backend Setup](#backend-setup)
4. [Frontend Setup](#frontend-setup)
5. [Testing Guide](#testing-guide)
6. [API Endpoints](#api-endpoints)
7. [Order Status Flow](#order-status-flow)

---

## 🔧 Installation

### Step 1: Install Razorpay Package

```bash
cd backend
npm install razorpay
```

### Step 2: Get Razorpay Credentials

1. Visit [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Sign up or log in
3. Navigate to: **Settings → API Keys**
4. Generate **Test Mode** keys
5. Copy **Key ID** and **Key Secret**

### Step 3: Update Environment Variables

Edit `backend/.env`:

```env
RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_KEY_SECRET
```

⚠️ **Important**: Use `rzp_test_` for testing, `rzp_live_` for production

---

## ✨ Features Implemented

### 🛒 **Customer Features**

#### Payment Options
- ✅ **Cash on Delivery (COD)** - Traditional payment method
- ✅ **Online Payment (Razorpay)** - UPI, Cards, Net Banking, Wallets

#### Order Management
- ✅ View all orders with detailed information
- ✅ Real-time order tracking with timeline
- ✅ Track order status updates
- ✅ Cancel orders (before shipping)
- ✅ View payment status (Paid/Pending)
- ✅ Tracking number for each order
- ✅ Estimated delivery date

#### Order Tracking Modal
- ✅ Complete order history timeline
- ✅ Status icons and color-coded badges
- ✅ Timestamp for each status change
- ✅ Notes from seller for each update

### 🏪 **Seller Features**

#### Order Management Dashboard
- ✅ **Statistics Cards**: Total, Pending, In Transit, Delivered
- ✅ **Filter by Status**: All, Order Placed, Processing, Shipped, etc.
- ✅ **Comprehensive Order Table** with:
  - Order ID & Tracking Number
  - Customer details
  - Product preview
  - Amount & Payment status
  - Current status
  - Update actions

#### Order Status Updates
- ✅ Update order status with modal
- ✅ Add notes for each status change
- ✅ Automatic status history tracking
- ✅ Auto-mark COD as paid when delivered
- ✅ Real-time status badges

#### Status Options
1. **Order Placed** - Initial status
2. **Processing** - Order being prepared
3. **Shipped** - Order dispatched
4. **Out for Delivery** - On the way
5. **Delivered** - Successfully delivered
6. **Cancelled** - Order cancelled

---

## 🔙 Backend Setup

### Files Created/Modified

#### 1. **Order Model** (`models/order.model.js`)
Enhanced with:
- Payment details (Razorpay IDs)
- Status tracking with history
- Tracking number
- Estimated delivery
- Cancellation details

#### 2. **Payment Controller** (`controller/payment.controller.js`)
- `createRazorpayOrder` - Create payment order
- `verifyRazorpayPayment` - Verify payment signature
- `handlePaymentFailure` - Handle failed payments

#### 3. **Order Controller** (`controller/order.controller.js`)
- `placeOrderCOD` - Enhanced with tracking
- `updateOrderStatus` - Update order status
- `getOrderById` - Get single order details
- `cancelOrder` - Cancel order by customer

#### 4. **Routes**
- `/api/payment/*` - Payment routes
- `/api/order/*` - Order routes with new endpoints

---

## 🎨 Frontend Setup

### Files Modified

#### 1. **Cart.jsx**
- Razorpay script loading
- Online payment integration
- Payment verification
- Error handling

#### 2. **MyOrders.jsx** (Customer)
- Modern order cards design
- Order tracking modal
- Status timeline
- Cancel order functionality
- Color-coded status badges

#### 3. **Orders.jsx** (Seller)
- Order management dashboard
- Statistics cards
- Status filtering
- Update status modal
- Comprehensive order table

---

## 🧪 Testing Guide

### Test Razorpay Payment

#### Test Cards
```
Card Number: 4111 1111 1111 1111
CVV: Any 3 digits
Expiry: Any future date
Name: Any name
```

#### Test UPI
```
UPI ID: success@razorpay
```

#### Test Net Banking
- Select any bank
- Will automatically succeed

### Test Order Flow

1. **Place Order**
   - Add products to cart
   - Select address
   - Choose "Online Payment"
   - Complete Razorpay checkout
   - Verify payment success

2. **Track Order (Customer)**
   - Go to "My Orders"
   - Click "Track Order"
   - View timeline and status

3. **Manage Order (Seller)**
   - Login as seller
   - Go to Orders page
   - Filter by status
   - Click "Update Status"
   - Change status and add note

4. **Cancel Order (Customer)**
   - Go to "My Orders"
   - Click "Cancel Order" (only before shipping)
   - Confirm cancellation

---

## 📡 API Endpoints

### Payment Endpoints

```
POST /api/payment/create-order
- Create Razorpay order
- Body: { items, address }
- Returns: { orderId, amount, key, orderDbId }

POST /api/payment/verify
- Verify payment signature
- Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderDbId }
- Returns: { success, message }

POST /api/payment/failure
- Handle payment failure
- Body: { orderDbId, reason }
- Returns: { success, message }
```

### Order Endpoints

```
POST /api/order/cod
- Place COD order
- Body: { items, address }
- Returns: { success, orderId, trackingNumber }

GET /api/order/user
- Get user orders
- Returns: { success, orders }

GET /api/order/:id
- Get order by ID
- Returns: { success, order }

POST /api/order/cancel
- Cancel order
- Body: { orderId, reason }
- Returns: { success, message }

GET /api/order/seller
- Get all orders (seller)
- Returns: { success, orders }

POST /api/order/update-status
- Update order status (seller)
- Body: { orderId, status, note }
- Returns: { success, order }
```

---

## 📊 Order Status Flow

```
┌─────────────────┐
│  Order Placed   │ ← Initial status
└────────┬────────┘
         ↓
┌─────────────────┐
│   Processing    │ ← Seller preparing order
└────────┬────────┘
         ↓
┌─────────────────┐
│     Shipped     │ ← Order dispatched
└────────┬────────┘
         ↓
┌─────────────────┐
│ Out for Delivery│ ← On the way
└────────┬────────┘
         ↓
┌─────────────────┐
│    Delivered    │ ← Final status (COD marked as paid)
└─────────────────┘

         OR
         
┌─────────────────┐
│    Cancelled    │ ← Can cancel before shipping
└─────────────────┘
```

---

## 🎯 Key Features Breakdown

### Security Features
✅ Payment signature verification
✅ Server-side payment validation
✅ Secure cookie handling
✅ HTTPS in production
✅ No sensitive data in frontend

### User Experience
✅ Loading states during payment
✅ Error handling with toast notifications
✅ Automatic token refresh
✅ Responsive design
✅ Real-time status updates

### Order Tracking
✅ Unique tracking number per order
✅ Complete status history
✅ Timestamp for each update
✅ Seller notes visible to customers
✅ Estimated delivery date

### Seller Dashboard
✅ Order statistics
✅ Status-based filtering
✅ Quick status updates
✅ Customer information
✅ Payment status tracking

---

## 🚨 Important Notes

### Production Checklist
- [ ] Replace test Razorpay keys with live keys
- [ ] Set `NODE_ENV=production`
- [ ] Enable HTTPS
- [ ] Set up webhook for payment notifications
- [ ] Configure proper CORS origins
- [ ] Add rate limiting
- [ ] Set up monitoring and logging

### Security Best Practices
- ✅ Never expose `RAZORPAY_KEY_SECRET` in frontend
- ✅ Always verify payment signature on backend
- ✅ Use environment variables for sensitive data
- ✅ Implement rate limiting on payment endpoints
- ✅ Log all payment transactions
- ✅ Set up webhook signature verification

---

## 📞 Support & Troubleshooting

### Common Issues

**Payment not working?**
- Check Razorpay credentials in `.env`
- Verify script is loading (check browser console)
- Ensure backend is running
- Check CORS configuration

**Order status not updating?**
- Verify seller authentication
- Check network tab for API errors
- Ensure order ID is correct

**Tracking not showing?**
- Refresh orders list
- Check if statusHistory exists
- Verify order was placed successfully

---

## 🎉 Success!

Your grocery store now has:
- ✅ Secure online payments via Razorpay
- ✅ Comprehensive order tracking
- ✅ Professional seller dashboard
- ✅ Real-time status updates
- ✅ Customer order management

**Ready for production!** 🚀
