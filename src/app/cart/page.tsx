'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useRouter } from 'next/navigation';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, cartTotal, cartItemCount } = useCart();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false); // New state for hydration fix

  // Set isMounted to true once the component has mounted on the client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleProceedToCheckout = () => {
    if (cart.length > 0) {
      router.push('/checkout');
    } else {
      alert('Your cart is empty. Please add items before checking out.');
    }
  };

  // Only render content that depends on localStorage after component mounts
  if (!isMounted) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-[50vh]">
        <div className="text-center text-xl font-semibold text-emerald-600">Loading cart...</div>
      </div>
    ); // Or a simple loading spinner
  }

  return (
    <div className="flex-grow container mx-auto p-4 md:p-8">
      <h1 className="text-4xl md:text-5xl font-extrabold text-center text-gray-900 mb-12">
        Your Shopping Cart
      </h1>

      {cart.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center">
          <p className="text-xl text-gray-600 mb-6">Your cart is empty. Start shopping now!</p>
          <a
            href="/products"
            className="inline-block bg-emerald-600 text-white font-bold px-8 py-4 rounded-full shadow-lg hover:bg-emerald-700 transform hover:scale-105 transition duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-emerald-300 focus:ring-opacity-75"
          >
            Go to Products
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
          {/* Cart Items List */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <h2 className="text-3xl font-bold text-emerald-700 mb-6">Items in Cart ({cartItemCount})</h2>
            <div className="space-y-6">
              {cart.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row items-center justify-between border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                  <div className="flex items-center w-full sm:w-auto mb-4 sm:mb-0">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-24 h-24 object-contain rounded-lg mr-4 border border-gray-100 p-1"
                      onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/100x100/cccccc/333333?text=Image`; }}
                    />
                    <div className="flex-grow">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{item.title}</h3>
                      <p className="text-gray-600 text-sm">${item.price.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {/* Quantity Controls */}
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={18} />
                    </button>
                    <span className="text-lg font-medium text-gray-800 w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      aria-label="Increase quantity"
                    >
                      <Plus size={18} />
                    </button>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="ml-4 p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                      aria-label="Remove item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 flex justify-end">
              <button
                onClick={clearCart}
                className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg shadow-md hover:bg-gray-300 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-75"
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1 bg-white rounded-2xl shadow-lg p-6 md:p-8 h-fit sticky top-28">
            <h2 className="text-3xl font-bold text-emerald-700 mb-6">Order Summary</h2>
            <div className="space-y-4 text-lg text-gray-700">
              <div className="flex justify-between">
                <span>Total Items:</span>
                <span className="font-semibold">{cartItemCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-semibold">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-xl text-gray-900 border-t border-gray-300 pt-4 mt-4">
                <span>Order Total:</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={handleProceedToCheckout}
              className="mt-8 w-full bg-amber-500 text-gray-900 font-bold px-8 py-4 rounded-full shadow-lg hover:bg-amber-400 transform hover:scale-105 transition duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-amber-300 focus:ring-opacity-75"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
