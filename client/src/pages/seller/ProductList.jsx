import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { getImageUrl } from "../../utils/api";
import toast from "react-hot-toast";

const ProductList = () => {
  const { products, fetchProducts, apiClient } = useAppContext();
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const toggleStock = async (id, inStock) => {
    try {
      const { data } = await apiClient.post("/api/product/stock", { id, inStock });
      if (data.success) {
        fetchProducts();
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      console.log('Attempting to delete product:', id);
      const { data } = await apiClient.post("/api/product/delete", { id });
      console.log('Delete response:', data);
      
      if (data.success) {
        fetchProducts();
        toast.success(data.message);
        setDeleteConfirm(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Delete error:', error);
      console.error('Error response:', error.response);
      const errorMsg = error.response?.data?.message || error.message || "Failed to delete product";
      toast.error(errorMsg);
    }
  };
  return (
    <div className="flex-1 py-10 flex flex-col justify-between">
      <div className="w-full md:p-10 p-4">
        <h2 className="pb-4 text-3xl lg:text-4xl font-semibold text-gray-900 uppercase tracking-wide">All Products</h2>
        
        {/* Card Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {products.map((product) => (
            <div 
              key={product._id} 
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100"
            >
              {/* Product Image */}
              <div className="h-48 bg-white flex items-center justify-center p-4 relative">
                <img
                  className="w-full h-full object-contain"
                  src={getImageUrl(`/images/${product.image[0]}`)}
                  alt={product.name}
                />
                
                {/* Discount Badge */}
                {product.offerPrice < product.price && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                    {Math.round(((product.price - product.offerPrice) / product.price) * 100)}% OFF
                  </span>
                )}

                {/* Out of Stock Overlay */}
                {!product.inStock && (
                  <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
                    <span className="bg-gray-800 text-white px-3 py-1 rounded text-sm font-medium">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4 pt-3">
                <p className="text-xs text-gray-500 mb-1 truncate">
                  {product.category}
                </p>
                
                <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-1 min-h-[20px]">
                  {product.name}
                </h3>
                
                {/* Rating */}
                <div className="flex items-center mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-3.5 h-3.5 ${star <= 4 ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="text-xs text-gray-500 ml-1.5">(4)</span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-lg font-bold text-green-600">
                    ₹{product.offerPrice.toFixed(0)}
                  </span>
                  {product.offerPrice < product.price && (
                    <span className="text-sm text-gray-400 line-through">
                      ₹{product.price.toFixed(0)}
                    </span>
                  )}
                </div>

                {/* Stock Toggle */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                  <span className="text-xs font-medium text-gray-700">In Stock</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      onClick={() => toggleStock(product._id, !product.inStock)}
                      checked={product.inStock}
                      type="checkbox"
                      className="sr-only peer"
                      defaultChecked={product.inStock}
                    />
                    <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-green-500 transition-colors duration-200"></div>
                    <span className="dot absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5 shadow-sm"></span>
                  </label>
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => setDeleteConfirm(product._id)}
                  className="w-full mt-3 bg-red-500 hover:bg-red-600 text-white text-sm font-medium py-2 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Delete Product</h3>
                <p className="text-sm text-gray-500">This action cannot be undone</p>
              </div>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this product? All product data will be permanently removed.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ProductList;
