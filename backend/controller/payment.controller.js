import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";

// Lazy initialize Razorpay (only when needed, after env vars are loaded)
let razorpayInstance = null;

const getRazorpayInstance = () => {
  if (!razorpayInstance) {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error("Razorpay credentials not found in environment variables");
    }
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpayInstance;
};

// Create Razorpay Order: /api/payment/create-order
export const createRazorpayOrder = async (req, res) => {
  try {
    const userId = req.user;
    const { items, address } = req.body;

    if (!address || !items || items.length === 0) {
      return res.status(400).json({ 
        message: "Invalid order details", 
        success: false 
      });
    }

    // Calculate amount using items
    let amount = await items.reduce(async (acc, item) => {
      const product = await Product.findById(item.product);
      if (!product) {
        throw new Error(`Product not found: ${item.product}`);
      }
      return (await acc) + product.offerPrice * item.quantity;
    }, 0);

    // Add tax charge 2%
    amount += Math.floor((amount * 2) / 100);

    // Convert to paise (Razorpay accepts amount in smallest currency unit)
    const amountInPaise = Math.round(amount * 100);

    // Create Razorpay order
    const razorpay = getRazorpayInstance();
    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId: userId,
        itemCount: items.length,
      },
    });

    // Create order in database with pending payment
    const order = await Order.create({
      userId,
      items,
      address,
      amount,
      paymentType: "Online",
      isPaid: false,
      razorpayOrderId: razorpayOrder.id,
      statusHistory: [{
        status: "Order Placed",
        timestamp: new Date(),
        note: "Order created, awaiting payment"
      }],
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    });

    res.status(201).json({
      success: true,
      orderId: razorpayOrder.id,
      amount: amountInPaise,
      currency: "INR",
      key: process.env.RAZORPAY_KEY_ID,
      orderDbId: order._id,
      message: "Razorpay order created successfully",
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ 
      message: error.message || "Internal Server Error",
      success: false 
    });
  }
};

// Verify Razorpay Payment: /api/payment/verify
export const verifyRazorpayPayment = async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      orderDbId 
    } = req.body;

    // Verify signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({ 
        message: "Invalid payment signature", 
        success: false 
      });
    }

    // Update order with payment details
    const order = await Order.findById(orderDbId);
    if (!order) {
      return res.status(404).json({ 
        message: "Order not found", 
        success: false 
      });
    }

    order.isPaid = true;
    order.razorpayPaymentId = razorpay_payment_id;
    order.razorpaySignature = razorpay_signature;
    order.status = "Processing";
    order.statusHistory.push({
      status: "Processing",
      timestamp: new Date(),
      note: "Payment received successfully"
    });

    await order.save();

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      orderId: order._id,
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ 
      message: "Internal Server Error",
      success: false 
    });
  }
};

// Handle Payment Failure: /api/payment/failure
export const handlePaymentFailure = async (req, res) => {
  try {
    const { orderDbId, reason } = req.body;

    const order = await Order.findById(orderDbId);
    if (order) {
      order.status = "Cancelled";
      order.cancelledAt = new Date();
      order.cancellationReason = reason || "Payment failed";
      order.statusHistory.push({
        status: "Cancelled",
        timestamp: new Date(),
        note: reason || "Payment failed"
      });
      await order.save();
    }

    res.status(200).json({
      success: true,
      message: "Payment failure recorded",
    });
  } catch (error) {
    console.error("Error handling payment failure:", error);
    res.status(500).json({ 
      message: "Internal Server Error",
      success: false 
    });
  }
};
