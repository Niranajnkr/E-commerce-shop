import express from "express";
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
  handlePaymentFailure,
} from "../controller/payment.controller.js";
import authUser from "../middlewares/authUser.js";

const router = express.Router();

router.post("/create-order", authUser, createRazorpayOrder);
router.post("/verify", authUser, verifyRazorpayPayment);
router.post("/failure", authUser, handlePaymentFailure);

export default router;
