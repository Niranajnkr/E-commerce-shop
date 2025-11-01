import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";
import apiClient from "../utils/apiClient";

// Global state for token refresh
let isRefreshing = false;
let failedQueue = [];

export const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response interceptor to handle token expiration
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is due to expired access token
    if (error.response?.status === 401 && 
        error.response?.data?.code === "TOKEN_EXPIRED" && 
        !originalRequest._retry) {
      
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          return apiClient(originalRequest);
        }).catch((err) => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to refresh the token
        await apiClient.post("/api/user/refresh-token");
        processQueue(null);
        isRefreshing = false;
        
        // Retry the original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;
        
        // If refresh fails, redirect to login
        toast.error("Session expired. Please login again.");
        window.location.href = "/";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const AppContext = createContext(null);

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [isSellerLoading, setIsSellerLoading] = useState(true);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  // check seller status
  const fetchSeller = async () => {
    try {
      setIsSellerLoading(true);
      const { data } = await apiClient.get("/api/seller/is-auth");
      if (data.success) {
        setIsSeller(true);
      } else {
        setIsSeller(false);
      }
    } catch (error) {
      // Only set to false if it's not a token-related error
      if (error.response?.data?.code === "NO_TOKEN" || 
          error.response?.data?.code === "TOKEN_EXPIRED" ||
          error.response?.data?.code === "INVALID_TOKEN") {
        setIsSeller(false);
      } else {
        // For other errors, don't change the state
        console.error("Seller auth check error:", error);
        setIsSeller(false);
      }
    } finally {
      setIsSellerLoading(false);
    }
  };

  // fetch user auth status, user Data and cart items
  const fetchUser = async () => {
    try {
      const { data } = await apiClient.get("/api/user/is-auth");
      if (data.success) {
        setUser(data.user);
        setCartItems(data.user.cart);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Failed to fetch user data");
    }
  };

  // fetch products
  const fetchProducts = async () => {
    try {
      const { data } = await apiClient.get("/api/product/list");
      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Failed to fetch products");
    }
  };
  // add product to cart
  const addToCart = (itemId) => {
    let cartData = structuredClone(cartItems || {}); // safeguard for undefined

    if (cartData[itemId]) {
      cartData[itemId] += 1;
    } else {
      cartData[itemId] = 1;
    }

    setCartItems(cartData);
    toast.success("Added to cart");
  };

  // update cart item quantity
  const updateCartItem = (itemId, quantity) => {
    let cartData = structuredClone(cartItems);
    if (quantity === 0) {
      delete cartData[itemId];
      toast.success(`Removed from cart`);
    } else {
      cartData[itemId] = quantity;
      toast.success(`Cart updated`);
    }
    setCartItems(cartData);
  };

  // total cart items
  const cartCount = () => {
    let totalCount = 0;
    for (const item in cartItems) {
      const product = products.find((p) => p._id === item);
      if (product?.unit === 'kg') {
        // For weight-based products, count as 1 item regardless of weight
        totalCount += 1;
      } else {
        // For piece-based products, add the quantity
        totalCount += cartItems[item];
      }
    }
    return totalCount;
  };
  // total cart amount
  const totalCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);
      if (cartItems[items] > 0) {
        // For weight-based products (kg), calculate price based on grams
        if (itemInfo.unit === 'kg') {
          // cartItems[items] is in grams, price is per kg
          totalAmount += (cartItems[items] / 1000) * itemInfo.offerPrice;
        } else {
          // For piece-based products, multiply quantity by price
          totalAmount += cartItems[items] * itemInfo.offerPrice;
        }
      }
    }
    return Math.floor(totalAmount * 100) / 100;
  };
  // remove product from cart
  const removeFromCart = (itemId) => {
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId] -= 1;
      if (cartData[itemId] === 0) {
        delete cartData[itemId];
      }
      toast.success(`remove from cart`);
      setCartItems(cartData);
    }
  };
  useEffect(() => {
    fetchSeller();
    fetchProducts();
    fetchUser();
  }, []);

  // update database cart items
  useEffect(() => {
    const updateCart = async () => {
      try {
        const { data } = await apiClient.post("/api/cart/update", { cartItems });

        if (!data.success) {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || error.message || "Failed to update cart");
      }
    };

    if (user) {
      updateCart();
    }
  }, [cartItems, user]);
  const value = {
    navigate,
    user,
    setUser,
    isSeller,
    setIsSeller,
    isSellerLoading,
    showUserLogin,
    setShowUserLogin,
    products,
    cartItems,
    addToCart,
    updateCartItem,
    removeFromCart,
    searchQuery,
    setSearchQuery,
    cartCount,
    totalCartAmount,
    apiClient,
    fetchProducts,
    setCartItems,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};


