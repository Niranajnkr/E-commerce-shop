import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { getImageUrl } from "../utils/api";

const ProductCard = ({ product }) => {
  const { addToCart, removeFromCart, cartItems, updateCartItem } = useAppContext();
  const navigate = useNavigate();
  const [selectedWeight, setSelectedWeight] = useState(250);

  if (!product) return null;

  // Check if product is weight-based (vegetables, fruits, meats)
  const isWeightBased = product.unit === 'kg';
  const weightOptions = [
    { label: '250g', value: 250 },
    { label: '500g', value: 500 },
    { label: '1kg', value: 1000 },
    { label: '2kg', value: 2000 },
    { label: '5kg', value: 5000 },
  ];

  const discountPercentage = product.offerPrice < product.price 
    ? Math.round(((product.price - product.offerPrice) / product.price) * 100)
    : 0;

  return (
    <div className="bg-white rounded-md shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 group">
      {/* Product Image */}
      <div 
        className="h-24 sm:h-32 bg-white flex items-center justify-center p-1.5 sm:p-3 cursor-pointer relative"
        onClick={() => {
          navigate(`/product/${product.category.toLowerCase()}/${product._id}`);
          scrollTo(0, 0);
        }}
        >
        <img
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          src={getImageUrl(`/images/${product.image[0]}`)}
          alt={product.name}
          />
        {/* Discount Badge */}
        {product.offerPrice < product.price && (
          <span className="absolute top-0.5 right-0.5 bg-red-500 text-white text-[8px] sm:text-[9px] font-semibold px-1 py-0.5 rounded">
            {Math.round(((product.price - product.offerPrice) / product.price) * 100)}% OFF
          </span>
        )}
        {/* Out of Stock Overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center">
            <span className="bg-gray-800 text-white text-[10px] sm:text-xs px-1.5 py-0.5 rounded font-medium">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-1.5 sm:p-3 flex flex-col">
        <p className="text-[9px] sm:text-xs text-gray-500 truncate mb-0.5">
          {product.category}
        </p>
        
        <h3 
          className="text-[11px] sm:text-sm font-semibold text-gray-900 mb-1 hover:text-green-600 cursor-pointer line-clamp-2"
          onClick={() => {
            navigate(`/product/${product.category.toLowerCase()}/${product._id}`);
            scrollTo(0, 0);
          }}
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '1.75rem',
            lineHeight: '0.875rem',
          }}
        >
          {product.name}
        </h3>
        
        {/* Rating */}
        <div className="flex items-center mb-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg
              key={star}
              className={`w-2 h-2 sm:w-3 sm:h-3 ${star <= 4 ? 'text-yellow-400' : 'text-gray-300'}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          <span className="text-[9px] sm:text-xs text-gray-500 ml-0.5">(4)</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-1 mb-1.5">
          <div className="flex items-baseline gap-0.5">
            <p className="text-sm sm:text-lg font-bold text-green-600">₹{product.offerPrice}</p>
            {product.unit === 'kg' && (
              <span className="text-[9px] sm:text-xs text-gray-600 font-medium">/kg</span>
            )}
          </div>
          {product.offerPrice < product.price && (
            <div className="flex items-baseline gap-0.5">
              <p className="text-[10px] sm:text-sm text-gray-400 line-through">
                ₹{product.price}
              </p>
              {product.unit === 'kg' && (
                <span className="text-[8px] sm:text-[10px] text-gray-400">/kg</span>
              )}
            </div>
          )}
        </div>

        {/* Add to Cart Button */}
        <div onClick={(e) => e.stopPropagation()} className="mt-auto">
          {isWeightBased ? (
            // Weight-based products (vegetables, fruits, meats)
            !cartItems?.[product._id] ? (
              <div className="space-y-1">
                <select
                  value={selectedWeight}
                  onChange={(e) => setSelectedWeight(Number(e.target.value))}
                  className="w-full text-[10px] sm:text-xs border border-gray-300 rounded px-1 py-0.5 sm:py-1 focus:outline-none focus:border-green-500"
                >
                  {weightOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => updateCartItem(product._id, selectedWeight)}
                  disabled={!product.inStock}
                  className="w-full bg-white border border-green-500 text-green-600 hover:bg-green-500 hover:text-white disabled:bg-gray-100 disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed font-medium py-1 sm:py-1.5 px-2 sm:px-3 rounded-md transition-all duration-200 text-[11px] sm:text-sm flex items-center justify-center gap-1"
                >
                  <svg className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Add
                </button>
              </div>
            ) : (
              <div className="space-y-1">
                <select
                  value={cartItems[product._id]}
                  onChange={(e) => updateCartItem(product._id, Number(e.target.value))}
                  className="w-full text-[10px] sm:text-xs border border-green-500 bg-green-50 rounded px-1 py-0.5 sm:py-1 focus:outline-none focus:border-green-600 font-semibold text-green-700"
                >
                  {weightOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => {
                    const cartData = { ...cartItems };
                    delete cartData[product._id];
                    updateCartItem(product._id, 0);
                  }}
                  className="w-full bg-red-50 border border-red-500 text-red-600 hover:bg-red-500 hover:text-white font-medium py-1 sm:py-1.5 px-2 sm:px-3 rounded-md transition-all duration-200 text-[11px] sm:text-sm"
                >
                  Remove
                </button>
              </div>
            )
          ) : (
            // Regular products (piece-based)
            !cartItems?.[product._id] ? (
              <button
                onClick={() => addToCart(product._id)}
                disabled={!product.inStock}
                className="w-full bg-white border border-green-500 text-green-600 hover:bg-green-500 hover:text-white disabled:bg-gray-100 disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed font-medium py-1 sm:py-1.5 px-2 sm:px-3 rounded-md transition-all duration-200 text-[11px] sm:text-sm flex items-center justify-center gap-1"
              >
                <svg className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Add
              </button>
            ) : (
              <div className="flex items-center justify-between bg-green-50 border border-green-500 rounded-md overflow-hidden">
                <button
                  onClick={() => removeFromCart(product._id)}
                  className="px-1.5 sm:px-2.5 py-1 sm:py-1.5 text-green-600 hover:bg-green-100 transition-colors active:bg-green-200"
                  aria-label="Decrease quantity"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </button>
                <span className="px-1 sm:px-2 text-[11px] sm:text-sm font-semibold text-green-700 min-w-[18px] text-center">
                  {cartItems[product._id]}
                </span>
                <button
                  onClick={() => addToCart(product._id)}
                  className="px-1.5 sm:px-2.5 py-1 sm:py-1.5 text-green-600 hover:bg-green-100 transition-colors active:bg-green-200"
                  aria-label="Increase quantity"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </button>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
