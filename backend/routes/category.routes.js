import express from "express";
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus,
} from "../controller/category.controller.js";
import { authSeller } from "../middlewares/authSeller.js";
import { upload } from "../config/multer.js";

const categoryRouter = express.Router();

// Public routes
categoryRouter.get("/list", getAllCategories);
categoryRouter.get("/:id", getCategoryById);

// Admin/Seller protected routes
categoryRouter.post("/create", authSeller, upload.single("image"), createCategory);
categoryRouter.put("/update/:id", authSeller, upload.single("image"), updateCategory);
categoryRouter.delete("/delete/:id", authSeller, deleteCategory);
categoryRouter.patch("/toggle/:id", authSeller, toggleCategoryStatus);

export default categoryRouter;
