'use client'; // Client Component declaration

import React from 'react';
import Link from 'next/link';
import { ShoppingCart, Search, User } from 'lucide-react';
import { useCart } from '../context/CartContext'; // Correct path to CartContext
import { CATEGORIES_WITH_SUBCATEGORIES } from '../constants/categories'; // Correct path to categories constant

const Navbar = () => {
  const { cart } = useCart();
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = React.useState(false);

  return (
    <nav className="bg-emerald-700 text-white p-4 shadow-lg sticky top-0 z-40">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo/Brand Name */}
        <Link href="/" className="text-3xl font-extrabold text-amber-300 hover:text-amber-200 transition duration-200">
          My Store
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-8 items-center">
          <Link href="/" className="hover:text-amber-300 transition duration-200 text-lg font-medium">
            Home
          </Link>

          {/* Products Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setIsProductsDropdownOpen(true)}
            onMouseLeave={() => setIsProductsDropdownOpen(false)}
          >
            <button className="hover:text-amber-300 transition duration-200 text-lg font-medium focus:outline-none">
              Products
            </button>
            {isProductsDropdownOpen && (
              <div className="absolute left-0 mt-2 w-56 bg-white text-gray-800 rounded-lg shadow-xl py-2 z-50">
                {CATEGORIES_WITH_SUBCATEGORIES.map((categoryGroup) => (
                  <div key={categoryGroup.name}>
                    <Link
                      href={`/products#${categoryGroup.name.toLowerCase().replace(/\s/g, '-')}`}
                      className="block px-4 py-2 text-sm font-semibold hover:bg-gray-100"
                      onClick={() => setIsProductsDropdownOpen(false)}
                    >
                      {categoryGroup.name}
                    </Link>
                    {categoryGroup.subcategories.length > 0 && (
                      <div className="border-t border-gray-100 my-1">
                        {categoryGroup.subcategories.map((subcat) => (
                          <Link
                            key={subcat}
                            // Construct hash for subcategory: main-category-name-subcategory-name
                            href={`/products#${categoryGroup.name.toLowerCase().replace(/\s/g, '-')}-${subcat.toLowerCase().replace(/\s/g, '-')}`}
                            className="block px-6 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsProductsDropdownOpen(false)}
                          >
                            {subcat}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <Link href="/about" className="hover:text-amber-300 transition duration-200 text-lg font-medium">
            About
          </Link>
          <Link href="/contact" className="hover:text-amber-300 transition duration-200 text-lg font-medium">
            Contact
          </Link>
        </div>

        {/* Icons (Search, Cart, User) */}
        <div className="flex items-center space-x-6">
          <Link href="/search" className="relative hover:text-amber-300 transition duration-200">
            <Search size={24} />
          </Link>
          <Link href="/cart" className="relative hover:text-amber-300 transition duration-200">
            <ShoppingCart size={24} />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Link>
          <Link href="/admin" className="relative hover:text-amber-300 transition duration-200">
            <User size={24} />
          </Link>
        </div>

        {/* Mobile Menu Button (Hamburger) - Placeholder */}
        <div className="md:hidden">
          <button className="text-white focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
