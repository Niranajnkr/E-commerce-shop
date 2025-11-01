import React from 'react';
import { Truck, Clock, Shield, RefreshCw } from 'lucide-react';

const FastDelivery = () => {
  return (
    <div className="bg-white py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Fast & Reliable Delivery
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We deliver fresh groceries to your doorstep with speed and care
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Fast Delivery */}
          <div className="bg-green-50 p-6 rounded-xl text-center hover:shadow-lg transition-shadow duration-300">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast Delivery</h3>
            <p className="text-gray-600">Quick delivery to your doorstep in just 2 hours</p>
          </div>

          {/* Time Slot */}
          <div className="bg-blue-50 p-6 rounded-xl text-center hover:shadow-lg transition-shadow duration-300">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Choose Your Slot</h3>
            <p className="text-gray-600">Select a delivery time that works for you</p>
          </div>

          {/* Quality Guarantee */}
          <div className="bg-yellow-50 p-6 rounded-xl text-center hover:shadow-lg transition-shadow duration-300">
            <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-yellow-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality Guarantee</h3>
            <p className="text-gray-600">100% fresh and high-quality products</p>
          </div>

          {/* Easy Returns */}
          <div className="bg-purple-50 p-6 rounded-xl text-center hover:shadow-lg transition-shadow duration-300">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <RefreshCw className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Returns</h3>
            <p className="text-gray-600">Hassle-free returns if you're not satisfied</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FastDelivery;
