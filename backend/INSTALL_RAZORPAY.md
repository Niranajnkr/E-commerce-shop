# Razorpay Installation Guide

## Step 1: Install Razorpay Package

Run this command in the backend directory:

```bash
npm install razorpay
```

## Step 2: Get Razorpay Credentials

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Sign up or log in
3. Go to Settings → API Keys
4. Generate Test/Live API Keys
5. Copy the **Key ID** and **Key Secret**

## Step 3: Update .env File

Replace the placeholder values in `.env`:

```env
RAZORPAY_KEY_ID=rzp_test_your_actual_key_id
RAZORPAY_KEY_SECRET=your_actual_key_secret
```

**Note**: Use `rzp_test_` for testing and `rzp_live_` for production

## Step 4: Install Frontend Razorpay Script

The Razorpay checkout script will be loaded dynamically in the frontend.

## Testing

### Test Card Details (for Test Mode):

- **Card Number**: 4111 1111 1111 1111
- **CVV**: Any 3 digits
- **Expiry**: Any future date
- **Name**: Any name

### Test UPI:
- **UPI ID**: success@razorpay

### Test Netbanking:
- Select any bank and it will succeed

## Webhook Setup (Optional - for production)

1. Go to Razorpay Dashboard → Settings → Webhooks
2. Add webhook URL: `https://yourdomain.com/api/payment/webhook`
3. Select events: `payment.captured`, `payment.failed`
4. Copy webhook secret and add to `.env`

## Security Notes

- ✅ Never expose `RAZORPAY_KEY_SECRET` in frontend
- ✅ Always verify payment signature on backend
- ✅ Use HTTPS in production
- ✅ Enable webhook signature verification
