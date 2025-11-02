import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import groceryStoreImage from "../assets/grocerystore.jpg";

const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: "Fresh Groceries",
      subtitle: "Delivered Daily",
      description: "Get farm-fresh vegetables, fruits, dairy products and daily essentials delivered to your doorstep. Shop smart, eat healthy!",
      image: "https://images.unsplash.com/photo-1588964895597-cfccd6e2dbf9?w=800&q=80",
      bgGradient: "from-green-50 to-emerald-50",
      titleColor: "text-green-700",
      buttonColor: "bg-green-600 hover:bg-green-700",
      features: [
        { icon: "check", text: "100% Fresh", color: "text-green-600" },
        { icon: "calendar", text: "Same Day Delivery", color: "text-blue-600" },
        { icon: "star", text: "Best Prices", color: "text-yellow-500" }
      ]
    },
    {
      id: 2,
      title: "Beauty & Skincare",
      subtitle: "Products",
      description: "Premium skincare, cosmetics, and beauty essentials. Glow naturally with our curated collection.",
      image: "https://img.freepik.com/premium-psd/skin-care-product_841014-34374.jpg",
      bgGradient: "from-pink-50 to-white",
      titleColor: "text-pink-600",
      buttonColor: "bg-pink-600 hover:bg-pink-700",
      features: [
        { icon: "check", text: "Authentic Brands", color: "text-pink-600" },
        { icon: "calendar", text: "Latest Products", color: "text-purple-600" },
        { icon: "star", text: "Dermatologist Tested", color: "text-yellow-500" }
      ]
    },
    {
      id: 3,
      title: "Fashion & Apparel",
      subtitle: "Collection",
      description: "Trendy clothing, dresses, and accessories. Express your style with our latest fashion collection.",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
      bgGradient: "from-purple-50 to-white",
      titleColor: "text-purple-600",
      buttonColor: "bg-purple-600 hover:bg-purple-700",
      features: [
        { icon: "check", text: "Trending Styles", color: "text-purple-600" },
        { icon: "calendar", text: "New Arrivals", color: "text-indigo-600" },
        { icon: "star", text: "Premium Quality", color: "text-yellow-500" }
      ]
    },
    // {
    //   id: 4,
    //   title: "Home & Living",
    //   subtitle: "Essentials",
    //   description: "Transform your space with our home decor, furniture, and living essentials. Quality meets comfort.",
    //   image: groceryStoreImage,
    //   bgGradient: "from-teal-50 to-white",
    //   titleColor: "text-teal-600",
    //   buttonColor: "bg-teal-600 hover:bg-teal-700",
    //   features: [
    //     { icon: "check", text: "Modern Designs", color: "text-teal-600" },
    //     { icon: "calendar", text: "Fast Delivery", color: "text-cyan-600" },
    //     { icon: "star", text: "Top Quality", color: "text-yellow-500" }
    //   ]
    // }
  ];

  // Auto-slide effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const renderIcon = (iconType, color) => {
    if (iconType === "check") {
      return (
        <svg className={`w-4 h-4 sm:w-5 sm:h-5 ${color} flex-shrink-0`} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      );
    } else if (iconType === "calendar") {
      return (
        <svg className={`w-4 h-4 sm:w-5 sm:h-5 ${color} flex-shrink-0`} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
        </svg>
      );
    } else {
      return (
        <svg className={`w-4 h-4 sm:w-5 sm:h-5 ${color} flex-shrink-0`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
  };

  return (
    <div className="relative w-full h-auto min-h-[450px] sm:min-h-[550px] md:min-h-[600px] lg:h-[560px] overflow-hidden">
      {/* Slides Container */}
      <div className="relative h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              index === currentSlide
                ? "opacity-100 translate-x-0"
                : index < currentSlide
                ? "opacity-0 -translate-x-full"
                : "opacity-0 translate-x-full"
            }`}
          >
            <div className={`w-full h-full bg-gradient-to-br ${slide.bgGradient}`}>
              <div className="container mx-auto px-3 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-5 sm:py-8 md:py-12 lg:py-10 h-full">
                <div className="flex flex-col lg:grid lg:grid-cols-2 gap-3 sm:gap-6 md:gap-8 lg:gap-12 items-center h-full">
                  {/* Left Content */}
                  <div className="text-center lg:text-left space-y-2 sm:space-y-3 md:space-y-5 order-2 lg:order-1 w-full">
                    {/* Heading */}
                    <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight animate-fade-in">
                      {slide.title}
                      <span className={`block ${slide.titleColor} mt-0.5 sm:mt-1`}>{slide.subtitle}</span>
                    </h1>

                    {/* Description */}
                    <p className="text-[10px] sm:text-sm md:text-base lg:text-lg text-gray-600 max-w-md sm:max-w-lg mx-auto lg:mx-0 leading-snug sm:leading-relaxed px-1 sm:px-0">
                      {slide.description}
                    </p>

                    {/* Features */}
                    <div className="flex flex-row flex-wrap gap-1.5 sm:gap-3 justify-center lg:justify-start px-1 sm:px-0">
                      {slide.features.map((feature, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-1 sm:gap-2 text-gray-700 bg-white px-2 sm:px-3 md:px-4 py-1 sm:py-2 rounded-md sm:rounded-lg shadow-sm"
                        >
                          {renderIcon(feature.icon, feature.color)}
                          <span className="text-[9px] sm:text-xs md:text-sm font-medium whitespace-nowrap">
                            {feature.text}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 justify-center lg:justify-start pt-1 sm:pt-2 px-1 sm:px-0">
                      <Link
                        to="/products"
                        className={`inline-flex items-center justify-center ${slide.buttonColor} text-white px-4 sm:px-6 md:px-8 py-1.5 sm:py-2.5 md:py-3 rounded-md sm:rounded-lg font-semibold text-[11px] sm:text-sm md:text-base transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5`}
                      >
                        Shop Now
                        <svg
                          className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 ml-1 sm:ml-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </Link>

                      <Link
                        to="/products"
                        className="inline-flex items-center justify-center bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-4 sm:px-6 md:px-8 py-1.5 sm:py-2.5 md:py-3 rounded-md sm:rounded-lg font-medium text-[11px] sm:text-sm md:text-base transition-all duration-300 shadow-sm hover:shadow-md"
                      >
                        Explore More
                      </Link>
                    </div>
                  </div>

                  {/* Right Image */}
                  <div className="relative order-1 lg:order-2 w-full">
                    <div className="relative rounded-md sm:rounded-xl md:rounded-2xl overflow-hidden shadow-md sm:shadow-xl md:shadow-2xl mx-1 sm:mx-0">
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className="w-full h-28 sm:h-48 md:h-64 lg:h-96 object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={(e) => {
          e.preventDefault();
          prevSlide();
        }}
        className="absolute left-1 sm:left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-1.5 sm:p-2 md:p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50 cursor-pointer"
        aria-label="Previous slide"
        type="button"
      >
        <svg className="w-3.5 h-3.5 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={(e) => {
          e.preventDefault();
          nextSlide();
        }}
        className="absolute right-1 sm:right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-1.5 sm:p-2 md:p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50 cursor-pointer"
        aria-label="Next slide"
        type="button"
      >
        <svg className="w-3.5 h-3.5 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2 md:gap-3 z-50">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={(e) => {
              e.preventDefault();
              goToSlide(index);
            }}
            type="button"
            className={`transition-all duration-300 rounded-full cursor-pointer ${
              index === currentSlide
                ? "bg-white w-6 sm:w-8 md:w-10 h-1.5 sm:h-2 md:h-2.5"
                : "bg-white/50 hover:bg-white/75 w-1.5 sm:w-2 md:w-2.5 h-1.5 sm:h-2 md:h-2.5"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Banner;
