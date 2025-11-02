import express from "express";
import authUser from "../middlewares/authUser.js";
import {
  getAllOrders,
  getUserOrders,
  placeOrderCOD,
  updateOrderStatus,
  getOrderById,
  cancelOrder,
  getSellerOrders,
} from "../controller/order.controller.js";
import { authSeller } from "../middlewares/authSeller.js";

const router = express.Router();

// User routes
router.post("/cod", authUser, placeOrderCOD);
router.get("/user", authUser, getUserOrders);
router.post("/cancel", authUser, cancelOrder);

// Seller routes (must come before /:id to avoid conflicts)
router.get("/seller", authSeller, getSellerOrders);
router.post("/update-status", authSeller, updateOrderStatus);

// Dynamic route (must be last)
router.get("/:id", authUser, getOrderById);

export default router;
