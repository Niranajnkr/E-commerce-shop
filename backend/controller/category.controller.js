import Category from "../models/category.model.js";
import { v2 as cloudinary } from "cloudinary";

// Get all categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ success: false, message: "Failed to fetch categories" });
  }
};

// Get single category
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }
    
    res.status(200).json({ success: true, category });
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({ success: false, message: "Failed to fetch category" });
  }
};

// Create new category (Admin only)
export const createCategory = async (req, res) => {
  try {
    const { text, path, bgColor } = req.body;
    const image = req.file;

    if (!text || !path || !image) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Check if category path already exists
    const existingCategory = await Category.findOne({ path });
    if (existingCategory) {
      return res.status(400).json({ success: false, message: "Category path already exists" });
    }

    // Upload image to cloudinary
    const imageUpload = await cloudinary.uploader.upload(image.path, {
      resource_type: "image",
      folder: "categories",
    });

    const newCategory = new Category({
      text,
      path,
      image: imageUpload.secure_url,
      bgColor: bgColor || "#F0F5DE",
    });

    await newCategory.save();
    res.status(201).json({ success: true, message: "Category created successfully", category: newCategory });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ success: false, message: "Failed to create category" });
  }
};

// Update category (Admin only)
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, path, bgColor } = req.body;
    const image = req.file;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    // Check if new path conflicts with existing category
    if (path && path !== category.path) {
      const existingCategory = await Category.findOne({ path });
      if (existingCategory) {
        return res.status(400).json({ success: false, message: "Category path already exists" });
      }
    }

    // Update fields
    if (text) category.text = text;
    if (path) category.path = path;
    if (bgColor) category.bgColor = bgColor;

    // Upload new image if provided
    if (image) {
      // Delete old image from cloudinary if it exists
      if (category.image) {
        const publicId = category.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`categories/${publicId}`);
      }

      const imageUpload = await cloudinary.uploader.upload(image.path, {
        resource_type: "image",
        folder: "categories",
      });
      category.image = imageUpload.secure_url;
    }

    await category.save();
    res.status(200).json({ success: true, message: "Category updated successfully", category });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ success: false, message: "Failed to update category" });
  }
};

// Delete category (Admin only)
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    // Delete image from cloudinary
    if (category.image) {
      const publicId = category.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`categories/${publicId}`);
    }

    await Category.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ success: false, message: "Failed to delete category" });
  }
};

// Toggle category status (Admin only)
export const toggleCategoryStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    category.isActive = !category.isActive;
    await category.save();

    res.status(200).json({ 
      success: true, 
      message: `Category ${category.isActive ? 'activated' : 'deactivated'} successfully`,
      category 
    });
  } catch (error) {
    console.error("Error toggling category status:", error);
    res.status(500).json({ success: false, message: "Failed to toggle category status" });
  }
};
