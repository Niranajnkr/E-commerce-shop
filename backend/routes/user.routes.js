import express from "express";
import {
  checkAuth,
  loginUser,
  logout,
  registerUser,
  refreshToken,
} from "../controller/user.controller.js";
import authUser from "../middlewares/authUser.js";
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh-token", refreshToken);
router.get("/is-auth", authUser, checkAuth);
router.get("/logout", authUser, logout);

export default router;
