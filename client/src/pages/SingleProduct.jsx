import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { Link, useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import { getImageUrl } from "../utils/api";
import ProductCard from "../components/ProductCard";
const SingleProduct = () => {
  const { products, navigate, addToCart, updateCartItem } = useAppContext();
  const { id } = useParams();
  const [thumbnail, setThumbnail] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedWeight, setSelectedWeight] = useState(250);
  const product = products.find((product) => product._id === id);
  
  const weightOptions = [
    { label: '250g', value: 250 },
    { label: '500g', value: 500 },
    { label: '1kg', value: 1000 },
    { label: '2kg', value: 2000 },
    { label: '5kg', value: 5000 },
  ];
  console.log("product", product);
  useEffect(() => {
    if (products.length > 0) {
      let productsCopy = products.slice();
      productsCopy = productsCopy.filter(
        (product) => product.category === product.category
      );
      setRelatedProducts(productsCopy.slice(0, 5));
    }
  }, [products]);

  useEffect(() => {
    setThumbnail(product?.image[0] ? product.image[0] : null);
  }, [product]);
  return (
    product && (
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16 py-6 sm:py-8 lg:py-10">
        <p>
          <Link to="/">Home</Link>/<Link to={"/products"}> Products</Link> /
          <Link to={`/products/${product.category.toLowerCase()}`}>
            {" "}
            {product.category}
          </Link>{" "}
          /<span className="text-indigo-500"> {product.name}</span>
        </p>

        <div className="flex flex-col md:flex-row gap-16 mt-4">
          <div className="flex gap-3">
            <div className="flex flex-col gap-3">
              {product.image.map((image, index) => (
                <div
                  key={index}
                  onClick={() => setThumbnail(image)}
                  className="border max-w-24 border-gray-500/30 rounded overflow-hidden cursor-pointer"
                >
                  <img
                    src={getImageUrl(`/images/${image}`)}
                    alt={`Thumbnail ${index + 1}`}
                  />
                </div>
              ))}
            </div>

            <div className="border border-gray-500/30 max-w-100 rounded overflow-hidden">
              <img
                src={getImageUrl(`/images/${thumbnail}`)}
                alt="Selected product"
              />
            </div>
          </div>

          <div className="text-sm w-full md:w-1/2">
            <h1 className="text-3xl font-medium">{product.name}</h1>

            <div className="flex items-center gap-0.5 mt-1">
              {Array(5)
                .fill("")
                .map(
                  (_, i) =>
                    product.rating >
                    (
                      <img
                        src={i < 4 ? assets.star_icon : assets.star_dull_icon}
                        alt="star"
                        key={i}
                        className="w-3.5 md:w-4"
                      />
                    )
                )}
              <p className="text-base ml-2">(4)</p>
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              <div className="flex items-baseline gap-1">
                <p className="text-3xl font-bold text-green-600">₹{product.offerPrice}</p>
                {product.unit === 'kg' && (
                  <span className="text-lg text-gray-600 font-medium">/kg</span>
                )}
              </div>
              {product.offerPrice < product.price && (
                <div className="flex items-baseline gap-1">
                  <p className="text-xl text-gray-400 line-through">₹{product.price}</p>
                  {product.unit === 'kg' && (
                    <span className="text-sm text-gray-400">/kg</span>
                  )}
                </div>
              )}
            </div>

            <span className="text-gray-500/70">(inclusive of all taxes)</span>

            <p className="text-base font-medium mt-6">About Product</p>
            <ul className="list-disc ml-4 text-gray-500/70">
              {product.description.map((desc, index) => (
                <li key={index}>{desc}</li>
              ))}
            </ul>

            {product.unit === 'kg' && (
              <div className="mt-6">
                <label className="text-base font-medium mb-2 block">Select Weight</label>
                <select
                  value={selectedWeight}
                  onChange={(e) => setSelectedWeight(Number(e.target.value))}
                  className="w-full md:w-48 border border-gray-300 rounded-md py-2.5 px-3 text-base focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                >
                  {weightOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-gray-600 mt-2">
                  Total: ₹{((selectedWeight / 1000) * product.offerPrice).toFixed(2)}
                </p>
              </div>
            )}

            <div className="flex items-center mt-10 gap-4 text-base">
              <button
                onClick={() => {
                  if (product.unit === 'kg') {
                    updateCartItem(product._id, selectedWeight);
                  } else {
                    addToCart(product._id);
                  }
                }}
                className="w-full py-3.5 cursor-pointer font-medium bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition"
              >
                Add to Cart
              </button>
              <button
                onClick={() => {
                  if (product.unit === 'kg') {
                    updateCartItem(product._id, selectedWeight);
                  } else {
                    addToCart(product._id);
                  }
                  navigate("/cart");
                  scrollTo(0, 0);
                }}
                className="w-full py-3.5 cursor-pointer font-medium bg-indigo-500 text-white hover:bg-indigo-600 transition"
              >
                Buy now
              </button>
            </div>
          </div>
        </div>
        {/* related prodcuts  */}
        <div className="flex flex-col items-center mt-12 sm:mt-16 lg:mt-20">
          <div className="flex flex-col items-center w-max">
            <p className="text-2xl md:text-3xl lg:text-4xl font-medium">Related Products</p>
            <div className="w-20 h-0.5 bg-primary rounded-full mt-2"></div>
          </div>

          <div className="w-full my-6 sm:my-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-6 gap-2 sm:gap-4 md:gap-5 lg:gap-6">
              {relatedProducts
                .filter((product) => product.inStock)
                .map((product, index) => (
                  <div key={index} className="w-full">
                    <ProductCard product={product} />
                  </div>
                ))}
            </div>
          </div>
          <button
            onClick={() => {
              navigate("/products");
              scrollTo(0, 0);
            }}
            className="w-1/2 my-8 py-3.5 cursor-pointer font-medium bg-indigo-500 text-white hover:bg-indigo-600 transition"
          >
            See More
          </button>
        </div>
      </div>
    )
  );
};
export default SingleProduct;
