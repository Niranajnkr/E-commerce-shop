import toast from "react-hot-toast";
import { useAppContext } from "../../context/AppContext";

const ProductList = () => {
  const { products, fetchProducts, axios } = useAppContext();

  const toggleStock = async (id, inStock) => {
    try {
      const { data } = await axios.post("/api/product/stock", { id, inStock });
      if (data.success) {
        fetchProducts();
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.success(error.message);
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
                  src={`http://localhost:5000/images/${product.image[0]}`}
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default ProductList;
