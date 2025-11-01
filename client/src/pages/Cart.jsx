import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { Link, useNavigate } from "react-router-dom";
import { getImageUrl } from "../utils/api";
import toast from "react-hot-toast";

const Cart = () => {
  const {
    products,
    navigate,
    cartCount,
    totalCartAmount,
    cartItems,
    setCartItems,
    removeFromCart,
    updateCartItem,
    axios,
    user,
  } = useAppContext();

  // state to store the products available in cart
  const [cartArray, setCartArray] = useState([]);
  // state to address
  const [address, setAddress] = useState([]);
  const [showAddress, setShowAddress] = useState(false);
  // state for selected address
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentOption, setPaymentOption] = useState("COD");

  const getCart = () => {
    let tempArray = [];
    for (const key in cartItems) {
      const product = products.find((product) => product._id === key);
      product.quantity = cartItems[key];
      tempArray.push(product);
    }
    setCartArray(tempArray);
  };

  const getAddress = async () => {
    try {
      const { data } = await axios.get("/api/address/get");
      if (data.success) {
        setAddress(data.addresses);
        if (data.addresses.length > 0) {
          setSelectedAddress(data.addresses[0]);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Failed to fetch addresses");
    }
  };
  useEffect(() => {
    if (user) {
      getAddress();
    }
  }, [user]);

  useEffect(() => {
    if (products.length > 0 && cartItems) {
      getCart();
    }
  }, [products, cartItems]);
  // Load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const placeOrder = async () => {
    try {
      if (!selectedAddress) {
        return toast.error("Please select an address");
      }

      const orderItems = cartArray.map((item) => ({
        product: item._id,
        quantity: item.quantity,
      }));

      // Place order with COD
      if (paymentOption === "COD") {
        const { data } = await axios.post("/api/order/cod", {
          items: orderItems,
          address: selectedAddress._id,
        });
        if (data.success) {
          toast.success(data.message);
          setCartItems({});
          navigate("/my-orders");
        } else {
          toast.error(data.message);
        }
      } 
      // Place order with Online Payment (Razorpay)
      else if (paymentOption === "Online") {
        // Load Razorpay script
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          return toast.error("Failed to load payment gateway. Please try again.");
        }

        // Create Razorpay order
        const { data } = await axios.post("/api/payment/create-order", {
          items: orderItems,
          address: selectedAddress._id,
        });

        if (!data.success) {
          return toast.error(data.message || "Failed to create order");
        }

        // Razorpay options
        const options = {
          key: data.key,
          amount: data.amount,
          currency: data.currency,
          name: "Grocery Store",
          description: "Order Payment",
          order_id: data.orderId,
          handler: async function (response) {
            try {
              // Verify payment
              const verifyData = await axios.post("/api/payment/verify", {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderDbId: data.orderDbId,
              });

              if (verifyData.data.success) {
                toast.success("Payment successful!");
                setCartItems({});
                navigate("/my-orders");
              } else {
                toast.error("Payment verification failed");
              }
            } catch (error) {
              toast.error(error.response?.data?.message || "Payment verification failed");
            }
          },
          prefill: {
            name: user?.name || "",
            email: user?.email || "",
            contact: selectedAddress?.phone || "",
          },
          theme: {
            color: "#16a34a", // Green color matching your theme
          },
          modal: {
            ondismiss: async function () {
              // Handle payment cancellation
              await axios.post("/api/payment/failure", {
                orderDbId: data.orderDbId,
                reason: "Payment cancelled by user",
              });
              toast.error("Payment cancelled");
            },
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.on("payment.failed", async function (response) {
          await axios.post("/api/payment/failure", {
            orderDbId: data.orderDbId,
            reason: response.error.description,
          });
          toast.error("Payment failed: " + response.error.description);
        });
        razorpay.open();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Failed to place order");
    }
  };

  // Empty cart state
  if (cartCount() === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-16 px-4">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
            <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some products to get started!</p>
            <button
              onClick={() => navigate("/products")}
              className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md shadow-sm hover:shadow-md transition-all"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Start Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return products.length > 0 && cartItems ? (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl lg:text-4xl font-medium text-gray-900">
            Shopping Cart <span className="text-gray-500 text-2xl font-normal">{cartCount()} Items</span>
          </h1>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Cart Items Section */}
          <div className="lg:col-span-8">
            <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-base font-semibold text-gray-900">Product Details</h2>
              </div>

              {/* Cart Items List */}
              <div className="divide-y divide-gray-200">
                {cartArray.map((product, index) => (
                  <div
                    key={index}
                    className="p-4 hover:bg-gray-50 transition-all duration-200"
                  >
                    <div className="flex items-center gap-4">
                      {/* Product Image & Info */}
                      <div className="flex items-center flex-1 gap-4">
                        <div
                          onClick={() => {
                            navigate(`product/${product.category}/${product._id}`);
                            scrollTo(0, 0);
                          }}
                          className="flex-shrink-0 w-20 h-20 rounded-md overflow-hidden bg-gray-50 border border-gray-200 cursor-pointer hover:border-gray-300 transition-all"
                        >
                          <img
                            className="w-full h-full object-contain p-1"
                            src={getImageUrl(`/images/${product.image[0]}`)}
                            alt={product.name}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-500 uppercase mb-0.5">{product.category}</p>
                          <h3 className="text-sm font-medium text-gray-900 hover:text-green-600 cursor-pointer truncate" onClick={() => {
                            navigate(`product/${product.category}/${product._id}`);
                            scrollTo(0, 0);
                          }}>
                            {product.name}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">
                            Weight: {product.weight || "N/A"}
                          </p>
                        </div>
                      </div>

                      {/* Subtotal */}
                      <div className="hidden md:block text-center min-w-[80px]">
                        <p className="text-xs text-gray-500 mb-1">Subtotal</p>
                        <div className="flex items-baseline justify-center gap-0.5">
                          <p className="text-lg font-bold text-green-600">
                            {product.unit === 'kg' 
                              ? `₹${((cartItems[product._id] / 1000) * product.offerPrice).toFixed(2)}`
                              : `₹${(cartItems[product._id] * product.offerPrice).toFixed(2)}`
                            }
                          </p>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {product.unit === 'kg' 
                            ? `₹${product.offerPrice}/kg`
                            : `₹${product.offerPrice} each`
                          }
                        </p>
                      </div>

                      {/* Quantity Selector */}
                      <div className="text-center min-w-[100px]">
                        <p className="text-xs text-gray-500 mb-1">
                          {product.unit === 'kg' ? 'Weight' : 'Qty'}
                        </p>
                        {product.unit === 'kg' ? (
                          <select
                            onChange={(e) =>
                              updateCartItem(product._id, Number(e.target.value))
                            }
                            value={cartItems[product._id]}
                            className="w-20 rounded-md border border-gray-300 py-1.5 px-2 text-center text-sm font-medium text-gray-700 hover:border-gray-400 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 transition-all"
                          >
                            <option value={250}>250g</option>
                            <option value={500}>500g</option>
                            <option value={1000}>1kg</option>
                            <option value={2000}>2kg</option>
                            <option value={5000}>5kg</option>
                          </select>
                        ) : (
                          <select
                            onChange={(e) =>
                              updateCartItem(product._id, Number(e.target.value))
                            }
                            value={cartItems[product._id]}
                            className="w-16 rounded-md border border-gray-300 py-1.5 px-2 text-center text-sm font-medium text-gray-700 hover:border-gray-400 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 transition-all"
                          >
                            {Array(
                              cartItems[product._id] > 9 ? cartItems[product._id] : 9
                            )
                              .fill("")
                              .map((_, idx) => (
                                <option key={idx} value={idx + 1}>
                                  {idx + 1}
                                </option>
                              ))}
                          </select>
                        )}
                      </div>

                      {/* Action (Remove) */}
                      <div className="text-center min-w-[80px]">
                        <p className="text-xs text-gray-500 mb-1">Action</p>
                        <button
                          type="button"
                          onClick={() => {
                            const cartData = { ...cartItems };
                            delete cartData[product._id];
                            updateCartItem(product._id, 0);
                          }}
                          className="inline-flex items-center justify-center w-8 h-8 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                          title="Remove item"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cart Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <button
                  onClick={() => navigate("/products")}
                  className="inline-flex items-center text-sm font-medium text-green-600 hover:text-green-700 transition-colors"
                >
                  <svg
                    className="mr-2 h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary Section */}
          <div className="lg:col-span-4 mt-8 lg:mt-0">
            <div className="bg-gray-50 rounded-lg p-6 sticky top-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-5">
                {/* Delivery Address */}
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
                    Delivery Address
                  </h3>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowAddress(!showAddress)}
                      className="w-full bg-white border border-gray-300 rounded-md shadow-sm py-3 px-4 text-left flex items-center justify-between text-sm font-medium text-gray-700 hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-green-500 transition-all"
                    >
                      <span className="truncate font-semibold">
                        {selectedAddress
                          ? `${selectedAddress.street}, ${selectedAddress.city}`
                          : "Select delivery address"}
                      </span>
                    <svg
                      className="ml-2 h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                    {showAddress && (
                      <div className="absolute z-10 mt-2 w-full rounded-md bg-white shadow-lg border border-gray-300">
                        <ul className="max-h-60 rounded-md py-2 text-base overflow-auto focus:outline-none sm:text-sm">
                        {address.length > 0 ? (
                          address.map((addr) => (
                            <li
                              key={addr._id}
                              onClick={() => {
                                setSelectedAddress(addr);
                                setShowAddress(false);
                              }}
                              className="text-gray-900 cursor-pointer select-none relative py-3 pl-4 pr-10 hover:bg-green-50 transition-colors mx-2 rounded-md"
                            >
                              <div className="font-medium block truncate">
                                {addr.street}, {addr.city}, {addr.state},{" "}
                                {addr.country}
                              </div>
                              {selectedAddress && selectedAddress._id === addr._id && (
                                <span className="text-green-600 absolute inset-y-0 right-0 flex items-center pr-4">
                                  <svg
                                    className="h-5 w-5"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    aria-hidden="true"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </span>
                              )}
                            </li>
                          ))
                        ) : (
                            <li className="text-gray-500 py-3 pl-4 pr-10 mx-2">
                              No saved addresses
                            </li>
                          )}
                          <li
                            onClick={() => {
                              setShowAddress(false);
                              navigate("/add-address", { state: { fromCart: true } });
                            }}
                            className="text-green-600 hover:bg-green-50 cursor-pointer py-3 pl-4 pr-10 font-semibold flex items-center mx-2 rounded-md border-t border-gray-200 mt-2 pt-3"
                          >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Add new address
                          </li>
                        </ul>
                      </div>
                    )}
                </div>

                  {selectedAddress && (
                    <div className="mt-4 p-3 bg-white rounded-lg text-sm text-gray-700 border border-gray-200">
                      <p className="font-semibold text-gray-900">{selectedAddress.street}</p>
                      <p className="mt-1">
                        {selectedAddress.city}, {selectedAddress.state}{" "}
                        {selectedAddress.postalCode}
                      </p>
                      <p>{selectedAddress.country}</p>
                      <p className="mt-2 flex items-center text-gray-600">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {selectedAddress.phone || "Not provided"}
                      </p>
                    </div>
                  )}
                </div>

                {/* Payment Method */}
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
                    Payment Method
                  </h3>
                  <div className="space-y-3">
                    <label className={`flex items-center p-3 rounded-md cursor-pointer transition-all ${paymentOption === "COD" ? "bg-white border-2 border-green-500" : "bg-white border border-gray-300 hover:border-gray-400"}`}>
                      <input
                        id="cash-on-delivery"
                        name="payment-method"
                        type="radio"
                        checked={paymentOption === "COD"}
                        onChange={() => setPaymentOption("COD")}
                        className="h-4 w-4 text-green-600 focus:ring-green-500"
                      />
                      <span className="ml-3 flex items-center text-sm font-medium text-gray-900">
                        <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Cash on Delivery
                      </span>
                    </label>
                    <label className={`flex items-center p-3 rounded-md cursor-pointer transition-all ${paymentOption === "Online" ? "bg-white border-2 border-green-500" : "bg-white border border-gray-300 hover:border-gray-400"}`}>
                      <input
                        id="online-payment"
                        name="payment-method"
                        type="radio"
                        checked={paymentOption === "Online"}
                        onChange={() => setPaymentOption("Online")}
                        className="h-4 w-4 text-green-600 focus:ring-green-500"
                      />
                      <span className="ml-3 flex items-center text-sm font-medium text-gray-900">
                        <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        Online Payment
                      </span>
                    </label>
                  </div>
                </div>

                {/* Price Summary */}
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <p className="text-gray-600">Price</p>
                      <p className="font-medium text-gray-900">₹{totalCartAmount().toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between text-sm">
                      <p className="text-gray-600">Shipping Fee</p>
                      <p className="font-medium text-green-600">Free</p>
                    </div>
                    <div className="flex justify-between text-sm">
                      <p className="text-gray-600">Tax (2%)</p>
                      <p className="font-medium text-gray-900">₹{(totalCartAmount() * 0.02).toFixed(2)}</p>
                    </div>
                    <div className="border-t border-gray-300 pt-3 flex justify-between">
                      <p className="text-base font-semibold text-gray-900">Total Amount:</p>
                      <p className="text-base font-bold text-gray-900">₹{(totalCartAmount() * 1.02).toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                {/* Place Order Button */}
                <button
                  onClick={placeOrder}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-md shadow-sm hover:shadow-md transition-all duration-200"
                >
                  {paymentOption === "COD" ? "Place Order" : "Proceed to Payment"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default Cart;
