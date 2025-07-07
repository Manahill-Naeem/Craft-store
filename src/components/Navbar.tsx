'use client';

import React, { useState, useEffect } from 'react'; // useEffect import kiya
import Link from 'next/link';
import { ShoppingCart, Search, User, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { CATEGORIES_WITH_SUBCATEGORIES } from '../constants/categories';

const Navbar = () => {
  const { cart } = useCart();
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false); // New state for hydration fix

  useEffect(() => {
    setIsClient(true); // Set to true once component mounts on client
  }, []);

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeAllMenus = () => {
    setIsMobileMenuOpen(false);
    setIsProductsDropdownOpen(false);
  };

  return (
    <nav className="bg-emerald-700 text-white p-4 shadow-lg sticky top-0 z-40">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo/Brand Name */}
        <Link href="/" className="text-3xl font-extrabold text-amber-300 hover:text-amber-200 transition duration-200" onClick={closeAllMenus}>
          My Store
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex space-x-8 items-center">
          <Link href="/" className="hover:text-amber-300 transition duration-200 text-lg font-medium" onClick={closeAllMenus}>
            Home
          </Link>

          {/* Desktop Products Dropdown */}
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
                      onClick={closeAllMenus}
                    >
                      {categoryGroup.name}
                    </Link>
                    {categoryGroup.subcategories.length > 0 && (
                      <div className="border-t border-gray-100 my-1">
                        {categoryGroup.subcategories.map((subcat) => (
                          <Link
                            key={subcat}
                            href={`/products#${categoryGroup.name.toLowerCase().replace(/\s/g, '-')}-${subcat.toLowerCase().replace(/\s/g, '-')}`}
                            className="block px-6 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={closeAllMenus}
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

          <Link href="/about" className="hover:text-amber-300 transition duration-200 text-lg font-medium" onClick={closeAllMenus}>
            About
          </Link>
          <Link href="/contact" className="hover:text-amber-300 transition duration-200 text-lg font-medium" onClick={closeAllMenus}>
            Contact
          </Link>
        </div>

        {/* Icons (Search, Cart, User) */}
        <div className="flex items-center space-x-6">
          <Link href="/search" className="relative hover:text-amber-300 transition duration-200" onClick={closeAllMenus}>
            <Search size={24} />
          </Link>
          <Link href="/cart" className="relative hover:text-amber-300 transition duration-200" onClick={closeAllMenus}>
            <ShoppingCart size={24} />
            {/* Render cart count only on client side to avoid hydration mismatch */}
            {isClient && cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Link>
          <Link href="/admin" className="relative hover:text-amber-300 transition duration-200" onClick={closeAllMenus}>
            <User size={24} />
          </Link>
        </div>

        {/* Mobile Menu Button (Hamburger/X) */}
        <div className="md:hidden">
          <button onClick={toggleMobileMenu} className="text-white focus:outline-none">
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Content */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-emerald-700 shadow-lg py-4 z-30">
          <div className="flex flex-col items-center space-y-4">
            <Link href="/" className="block text-white text-lg font-medium hover:text-amber-300 transition duration-200 py-2" onClick={closeAllMenus}>
              Home
            </Link>

            {/* Mobile Products Section (expanded directly) */}
            <div className="w-full text-center">
              <button
                onClick={() => setIsProductsDropdownOpen(!isProductsDropdownOpen)}
                className="text-white text-lg font-medium hover:text-amber-300 transition duration-200 py-2 focus:outline-none w-full"
              >
                Products {isProductsDropdownOpen ? '▲' : '▼'}
              </button>
              {isProductsDropdownOpen && (
                <div className="mt-2 text-gray-200 space-y-1">
                  {CATEGORIES_WITH_SUBCATEGORIES.map((categoryGroup) => (
                    <div key={categoryGroup.name} className="w-full">
                      <Link
                        href={`/products#${categoryGroup.name.toLowerCase().replace(/\s/g, '-')}`}
                        className="block px-4 py-2 text-md font-semibold hover:bg-emerald-600 rounded-md"
                        onClick={closeAllMenus}
                      >
                        {categoryGroup.name}
                      </Link>
                      {categoryGroup.subcategories.length > 0 && (
                        <div className="ml-4 space-y-1">
                          {categoryGroup.subcategories.map((subcat) => (
                            <Link
                              key={subcat}
                              href={`/products#${categoryGroup.name.toLowerCase().replace(/\s/g, '-')}-${subcat.toLowerCase().replace(/\s/g, '-')}`}
                              className="block px-6 py-2 text-sm hover:bg-emerald-600 rounded-md"
                              onClick={closeAllMenus}
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

            <Link href="/about" className="block text-white text-lg font-medium hover:text-amber-300 transition duration-200 py-2" onClick={closeAllMenus}>
              About
            </Link>
            <Link href="/contact" className="block text-white text-lg font-medium hover:text-amber-300 transition duration-200 py-2" onClick={closeAllMenus}>
              Contact
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
