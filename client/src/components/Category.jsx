import { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { getImageUrl } from "../utils/api";
import axios from "axios";
import toast from "react-hot-toast";

const Category = () => {
  const { navigate } = useAppContext();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const backendUrl = import.meta.env.VITE_BACKEND_URL || "";

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/category/list`);
        if (response.data.success) {
          setCategories(response.data.categories);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);
  
  return (
    <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8 sm:py-10 lg:py-12">
      <div className="text-center mb-8 sm:mb-10 lg:mb-12">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3">Shop by Category</h2>
        <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">Discover our wide range of fresh products</p>
      </div>
      
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          <p className="mt-4 text-gray-600">Loading categories...</p>
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No categories available</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
          {categories.map((category, index) => (
          <div
            key={index}
            className="group relative overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
            onClick={() => {
              navigate(`/products/${category.path.toLowerCase()}`);
              scrollTo(0, 0);
            }}
          >
            <div className="p-2 flex flex-col items-center">
              <div className="w-24 h-24 md:w-28 md:h-28 flex items-center justify-center mb-3">
                <img
                  src={category.image}
                  alt={category.text}
                  className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <div className="w-full text-center p-3 bg-gray-50 group-hover:bg-green-50 transition-colors duration-300">
                <h3 className="font-medium text-gray-900 group-hover:text-green-600 transition-colors">
                  {category.text}
                </h3>
                <span className="inline-block mt-1 text-xs text-gray-500 group-hover:text-green-500 transition-colors">
                  Shop Now
                </span>
              </div>
            </div>
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-green-300 rounded-xl transition-all duration-300 pointer-events-none"></div>
          </div>
        ))}
        </div>
      )}
    </div>
  );
};

export default Category;
