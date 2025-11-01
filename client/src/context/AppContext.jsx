import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";
import apiClient from "../utils/apiClient";

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

  // login user
  const loginUser = async (credentials) => {
    try {
      console.log("Attempting login...");
      const { data } = await apiClient.post("/api/user/login", credentials);
      console.log("Login response:", data);
      
      if (data.success) {
        // Fetch user data after successful login
        await fetchUser();
        return { success: true, message: data.message };
      } else {
        console.error("Login failed:", data.message);
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || "Login failed"
      };
    }
  };

  // fetch user auth status, user Data and cart items
  const fetchUser = async () => {
    try {
      console.log("Fetching user data...");
      const { data } = await apiClient.get("/api/user/is-auth");
      console.log("User data response:", data);
      
      if (data && data.success && data.user) {
        setUser(data.user);
        // Safely handle cart data
        const userCart = data.user.cart;
        if (userCart && typeof userCart === 'object') {
          setCartItems(userCart);
        } else {
          setCartItems({});
        }
        console.log("User data loaded successfully");
      } else {
        console.log("No user data in response");
        setUser(null);
        setCartItems({});
      }
    } catch (error) {
      // Silently handle auth errors - user is simply not logged in
      console.log("User not authenticated:", error.message);
      setUser(null);
      setCartItems({});
    }
  };

  // fetch products
  const fetchProducts = async () => {
    try {
      const { data } = await apiClient.get("/api/product/list");
      if (data.success) {
        setProducts(data.products);
      } else {
        console.log("Failed to fetch products:", data.message);
      }
    } catch (error) {
      console.log("Failed to fetch products:", error.response?.data?.message || error.message);
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
        // Silently update cart without showing errors to prevent refresh loops
        if (!data.success) {
          console.log("Cart update failed:", data.message);
        }
      } catch (error) {
        // Silently handle cart update errors
        console.log("Cart update error:", error.response?.data?.message || error.message);
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
    fetchSeller,
    fetchUser,
    loginUser,
    setCartItems,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};


