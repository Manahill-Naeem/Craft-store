'use client'; // This context will use client-side state

import React, { createContext, useContext, useState, useEffect } from 'react';

// Define the structure for a cart item
interface CartItem {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

// Define the shape of our CartContext
interface CartContextType {
  cart: CartItem[];
  addToCart: (product: { id: number; title: string; price: number; image: string }) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  cartItemCount: number;
  cartTotal: number;
}

// Create the context with a default undefined value
const CartContext = createContext<CartContextType | undefined>(undefined);

// Custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Cart Provider component
export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  // Initialize cart from localStorage or as an empty array
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') { // Check if window is defined (client-side)
      const savedCart = localStorage.getItem('my-store-cart');
      return savedCart ? JSON.parse(savedCart) : [];
    }
    return []; // Default to empty array on server-side render
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('my-store-cart', JSON.stringify(cart));
    }
  }, [cart]);

  // Add item to cart or increase quantity if already exists
  const addToCart = (product: { id: number; title: string; price: number; image: string }) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  // Remove item completely from cart
  const removeFromCart = (productId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  // Update quantity of a specific item
  const updateQuantity = (productId: number, quantity: number) => {
    setCart((prevCart) => {
      if (quantity <= 0) {
        return prevCart.filter((item) => item.id !== productId); // Remove if quantity is 0 or less
      }
      return prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: quantity } : item
      );
    });
  };

  // Clear all items from cart
  const clearCart = () => {
    setCart([]);
  };

  // Calculate total number of items in cart
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Calculate total price of items in cart
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const contextValue: CartContextType = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartItemCount,
    cartTotal,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};
