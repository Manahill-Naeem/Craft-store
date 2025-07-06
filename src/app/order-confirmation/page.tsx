'use client'; // This page is client-side for simple display

import React from 'react';
import { CheckCircle } from 'lucide-react'; // Import a success icon

const OrderConfirmationPage = () => {
  return (
    <div className="flex-grow container mx-auto p-4 md:p-8 flex items-center justify-center min-h-[70vh]">
      <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center max-w-2xl w-full">
        <CheckCircle size={80} className="text-emerald-500 mx-auto mb-6" />
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
          Order Confirmed!
        </h1>
        <p className="text-xl text-gray-700 mb-6">
          Thank you for your purchase from My Craft Store.
        </p>
        <p className="text-lg text-gray-600 mb-8">
          Your order has been successfully placed and will be processed shortly. You will receive an email confirmation with your order details.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a
            href="/"
            className="inline-block bg-emerald-600 text-white font-bold px-8 py-4 rounded-full shadow-lg hover:bg-emerald-700 transform hover:scale-105 transition duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-emerald-300 focus:ring-opacity-75"
          >
            Continue Shopping
          </a>
          <a
            href="/contact" // Or a "View Order History" page if implemented
            className="inline-block bg-gray-200 text-gray-800 font-bold px-8 py-4 rounded-full shadow-lg hover:bg-gray-300 transform hover:scale-105 transition duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-gray-300 focus:ring-opacity-75"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
