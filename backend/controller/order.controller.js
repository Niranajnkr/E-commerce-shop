import Order from "../models/order.model.js";
import Product from "../models/product.model.js";

// Place order COD: /api/order/place
export const placeOrderCOD = async (req, res) => {
  try {
    const userId = req.user;
    const { items, address } = req.body;
    if (!address || !items || items.length === 0) {
      return res
        .status(400)
        .json({ message: "Invalid order details", success: false });
    }
    // calculate amount using items;
    let amount = await items.reduce(async (acc, item) => {
      const product = await Product.findById(item.product);
      return (await acc) + product.offerPrice * item.quantity;
    }, 0);

    // Add tax charge 2%
    amount += Math.floor((amount * 2) / 100);
    
    // Generate tracking number
    const trackingNumber = `TRK${Date.now()}${Math.floor(Math.random() * 1000)}`;
    
    const order = await Order.create({
      userId,
      items,
      address,
      amount,
      paymentType: "COD",
      isPaid: false,
      trackingNumber,
      statusHistory: [{
        status: "Order Placed",
        timestamp: new Date(),
        note: "Order placed successfully via COD"
      }],
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });
    
    res.status(201).json({ 
      message: "Order placed successfully", 
      success: true,
      orderId: order._id,
      trackingNumber: order.trackingNumber
    });
  } catch (error) {
    console.error("Error placing COD order:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// oredr details for individual user :/api/order/user
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user;
    const orders = await Order.find({
      userId,
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// get all orders for admin :/api/order/seller
export const getAllOrders = async (req, res) => {
  try {
    console.log("📦 Fetching all orders for seller...");
    const orders = await Order.find({
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });
    
    console.log(`✅ Found ${orders.length} orders`);
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("❌ Error fetching all orders:", error);
    res.status(500).json({ 
      message: "Internal Server Error",
      success: false,
      error: error.message 
    });
  }
};

// Update order status: /api/order/update-status
export const updateOrderStatus = async (req, res) => {
  try {
    console.log("📝 Update order status request:", req.body);
    const { orderId, status, note } = req.body;

    const validStatuses = ["Order Placed", "Processing", "Shipped", "Out for Delivery", "Delivered", "Cancelled"];
    if (!validStatuses.includes(status)) {
      console.log("❌ Invalid status:", status);
      return res.status(400).json({ 
        message: "Invalid status", 
        success: false 
      });
    }

    console.log(`🔍 Finding order: ${orderId}`);
    const order = await Order.findById(orderId);
    if (!order) {
      console.log("❌ Order not found");
      return res.status(404).json({ 
        message: "Order not found", 
        success: false 
      });
    }

    console.log(`📦 Current status: ${order.status} → New status: ${status}`);
    
    // Update status
    order.status = status;
    order.statusHistory.push({
      status,
      timestamp: new Date(),
      note: note || `Order status updated to ${status}`
    });

    // Update specific fields based on status
    if (status === "Delivered") {
      order.deliveredAt = new Date();
      if (order.paymentType === "COD") {
        order.isPaid = true;
        console.log("💰 COD order marked as paid");
      }
    } else if (status === "Cancelled") {
      order.cancelledAt = new Date();
      order.cancellationReason = note || "Cancelled by seller";
      console.log("🚫 Order cancelled");
    }

    await order.save();
    console.log("✅ Order status updated successfully");

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order
    });
  } catch (error) {
    console.error("❌ Error updating order status:", error);
    res.status(500).json({ 
      message: "Internal Server Error",
      success: false,
      error: error.message 
    });
  }
};

// Get order by ID with full details: /api/order/:id
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id)
      .populate("items.product address");

    if (!order) {
      return res.status(404).json({ 
        message: "Order not found", 
        success: false 
      });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Cancel order: /api/order/cancel
export const cancelOrder = async (req, res) => {
  try {
    const userId = req.user;
    const { orderId, reason } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ 
        message: "Order not found", 
        success: false 
      });
    }

    // Verify user owns this order
    if (order.userId.toString() !== userId) {
      return res.status(403).json({ 
        message: "Unauthorized", 
        success: false 
      });
    }

    // Can only cancel if not shipped yet
    if (["Shipped", "Out for Delivery", "Delivered"].includes(order.status)) {
      return res.status(400).json({ 
        message: "Cannot cancel order that is already shipped", 
        success: false 
      });
    }

    order.status = "Cancelled";
    order.cancelledAt = new Date();
    order.cancellationReason = reason || "Cancelled by customer";
    order.statusHistory.push({
      status: "Cancelled",
      timestamp: new Date(),
      note: reason || "Cancelled by customer"
    });

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully"
    });
  } catch (error) {
    console.error("Error cancelling order:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Auto-delete delivered orders older than 1 week
export const cleanupOldDeliveredOrders = async () => {
  try {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    const result = await Order.deleteMany({
      status: "Delivered",
      deliveredAt: { $lt: oneWeekAgo }
    });

    if (result.deletedCount > 0) {
      console.log(`🗑️ Auto-cleanup: Deleted ${result.deletedCount} delivered orders older than 1 week`);
    }
    
    return result.deletedCount;
  } catch (error) {
    console.error("Error in cleanup:", error);
    return 0;
  }
};

// Get seller orders with auto-cleanup: /api/order/seller
export const getSellerOrders = async (req, res) => {
  try {
    // Run cleanup before fetching orders
    await cleanupOldDeliveredOrders();
    
    // Fetch all orders (excluding old delivered ones that were just deleted)
    const orders = await Order.find({})
      .populate("items.product")
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ 
      success: true, 
      orders,
      message: "Orders fetched successfully"
    });
  } catch (error) {
    console.error("Error fetching seller orders:", error);
    res.status(500).json({ 
      message: "Internal Server Error",
      success: false 
    });
  }
};
