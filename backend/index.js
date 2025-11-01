import dotenv from "dotenv";
// Load environment variables FIRST before any other imports
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/connectDB.js";
import userRoutes from "./routes/user.routes.js";
import sellerRoutes from "./routes/seller.routes.js";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import addressRoutes from "./routes/address.routes.js";
import orderRoutes from "./routes/order.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import { connectCloudinary } from "./config/cloudinary.js";

const app = express();

await connectCloudinary();
// Allow multiple origins with development support
const allowedOrigins = [
  // Local development
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  
  // Production domains
  'https://grocery-store-j1we.onrender.com',
  'https://e-commerce-shop-tal7.onrender.com',
  
  // Environment variables
  process.env.FRONTEND_URL,
  process.env.BACKEND_URL,
  
  // Common production patterns
  /^\.?grocery-store\..+\.onrender\.com$/,
  /^\.?e-commerce-shop\..+\.onrender\.com$/
].filter(Boolean);

// Enhanced CORS configuration with better logging
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowedOrigins
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (typeof allowedOrigin === 'string') {
        return origin === allowedOrigin;
      } else if (allowedOrigin instanceof RegExp) {
        return allowedOrigin.test(origin);
      }
      return false;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.warn('CORS blocked request from origin:', origin);
      console.warn('Allowed origins:', allowedOrigins);
      callback(new Error('Not allowed by CORS policy'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Logging middleware for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// Api endpoints
app.use("/images", express.static("uploads"));
app.use("/api/user", userRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/category", categoryRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
  console.log(`Razorpay configured: ${process.env.RAZORPAY_KEY_ID ? '✅' : '❌'}`);
});
