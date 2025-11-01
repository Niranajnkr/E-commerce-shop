import mongoose from "mongoose";
const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, ref: "User" },
    items: [
      {
        product: { type: String, required: true, ref: "Product" },
        quantity: { type: Number, required: true },
      },
    ],
    amount: { type: Number, required: true },
    address: { type: String, required: true, ref: "Address" },
    
    // Order Status Tracking
    status: { 
      type: String, 
      enum: ["Order Placed", "Processing", "Shipped", "Out for Delivery", "Delivered", "Cancelled"],
      default: "Order Placed" 
    },
    
    // Payment Details
    paymentType: { 
      type: String, 
      enum: ["COD", "Online"],
      required: true 
    },
    isPaid: { type: Boolean, default: false },
    
    // Razorpay Payment Details
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    
    // Order Tracking Timeline
    statusHistory: [{
      status: { type: String },
      timestamp: { type: Date, default: Date.now },
      note: { type: String }
    }],
    
    // Delivery Details
    estimatedDelivery: { type: Date },
    deliveredAt: { type: Date },
    trackingNumber: { type: String },
    
    // Cancellation
    cancelledAt: { type: Date },
    cancellationReason: { type: String },
  },
  { timestamps: true }
);

// Add index for faster queries
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ status: 1 });

const Order = mongoose.model("Order", orderSchema);
export default Order;
