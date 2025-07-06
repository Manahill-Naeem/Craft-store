'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useRouter } from 'next/navigation';
// import { getDb } from '../../lib/mongodb'; // MongoDB utility import for potential server-side order saving (though we'll do it client-side for simplicity here)

// Delivery charge define karein
const DELIVERY_CHARGE = 5.00; // Example: $5.00 fixed delivery charge

const CheckoutPage = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const router = useRouter();

  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
    country: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('cod'); // Default to Cash on Delivery
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate the final total including delivery charge
  const finalOrderTotal = cartTotal + DELIVERY_CHARGE;

  useEffect(() => {
    if (cart.length === 0 && !isSubmitting) {
      router.push('/cart');
    }
  }, [cart, isSubmitting, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    let newErrors = {};
    if (!shippingInfo.fullName) newErrors.fullName = 'Full Name is required';
    if (!shippingInfo.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(shippingInfo.email)) {
      newErrors.email = 'Email address is invalid';
    }
    if (!shippingInfo.address) newErrors.address = 'Address is required';
    if (!shippingInfo.city) newErrors.city = 'City is required';
    if (!shippingInfo.zipCode) newErrors.zipCode = 'Zip Code is required';
    if (!shippingInfo.country) newErrors.country = 'Country is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // --- Save Order to MongoDB via API Route ---
      const orderData = {
        shippingInfo,
        items: cart,
        subtotal: cartTotal, // Subtotal bhi bhej rahe hain
        deliveryCharge: DELIVERY_CHARGE, // Delivery charge add kiya
        totalAmount: finalOrderTotal, // Final total amount
        paymentMethod: paymentMethod,
        orderDate: new Date().toISOString(),
        status: 'Pending',
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to place order: ${errorData.message || response.statusText}`);
      }

      clearCart();
      alert('Order placed successfully via Cash on Delivery! Thank you for your purchase.');
      router.push('/order-confirmation');
    } catch (err: any) {
      console.error('Order placement error:', err);
      alert(`Error placing order: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0 && !isSubmitting) {
    return null;
  }

  return (
    <div className="flex-grow container mx-auto p-4 md:p-8">
      <h1 className="text-4xl md:text-5xl font-extrabold text-center text-gray-900 mb-12">
        Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
        {/* Shipping Information Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <h2 className="text-3xl font-bold text-emerald-700 mb-6">Shipping Information</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="fullName" className="block text-gray-800 text-sm font-medium mb-2">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={shippingInfo.fullName}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.fullName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-emerald-500'}`}
                required
              />
              {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-800 text-sm font-medium mb-2">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={shippingInfo.email}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-emerald-500'}`}
                required
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="address" className="block text-gray-800 text-sm font-medium mb-2">Street Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={shippingInfo.address}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.address ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-emerald-500'}`}
                required
              />
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="block text-gray-800 text-sm font-medium mb-2">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={shippingInfo.city}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.city ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-emerald-500'}`}
                  required
                />
                {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
              </div>
              <div>
                <label htmlFor="zipCode" className="block text-gray-800 text-sm font-medium mb-2">Zip Code</label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={shippingInfo.zipCode}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.zipCode ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-emerald-500'}`}
                  required
                />
                {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
              </div>
            </div>
            <div>
              <label htmlFor="country" className="block text-gray-800 text-sm font-medium mb-2">Country</label>
              <input
                type="text"
                id="country"
                name="country"
                value={shippingInfo.country}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.country ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-emerald-500'}`}
                required
              />
              {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
            </div>
          </form>
        </div>

        {/* Order Summary and Payment Method */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 h-fit sticky top-28">
          <h2 className="text-3xl font-bold text-emerald-700 mb-6">Order Summary</h2>
          <div className="space-y-3 text-lg text-gray-700 mb-6">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center text-sm">
                <span className="font-medium text-gray-900">{item.title} (x{item.quantity})</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="flex justify-between pt-3 border-t border-gray-200">
              <span>Subtotal:</span>
              <span className="font-semibold">${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Charges:</span> {/* Delivery Charges display */}
              <span className="font-semibold">${DELIVERY_CHARGE.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-xl text-gray-900 border-t border-gray-300 pt-4 mt-4">
              <span>Total:</span>
              <span>${finalOrderTotal.toFixed(2)}</span> {/* Final total with delivery */}
            </div>
          </div>

          <h2 className="text-3xl font-bold text-emerald-700 mb-6">Payment Method</h2>
          <div className="space-y-4 mb-8">
            <label className="flex items-center bg-gray-50 p-4 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition duration-200">
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={paymentMethod === 'cod'}
                onChange={() => setPaymentMethod('cod')}
                className="form-radio text-emerald-600 h-5 w-5"
              />
              <span className="ml-3 text-gray-800 font-medium">Cash on Delivery (COD)</span>
            </label>
          </div>

          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting || cart.length === 0}
            className="w-full bg-amber-500 text-gray-900 font-bold px-8 py-4 rounded-full shadow-lg hover:bg-amber-400 transform hover:scale-105 transition duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-amber-300 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
