import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 py-8 md:py-12 mt-auto">
      <div className="container mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* About Section */}
        <div>
          <h3 className="text-xl font-bold text-white mb-4">My Craft Store</h3>
          <p className="text-sm leading-relaxed">
            Discover unique handcrafted items, made with passion and precision. We bring you the finest artisanal products for every occasion.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-bold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link href="/" className="hover:text-amber-300 transition duration-200 text-sm">Home</Link></li>
            <li><Link href="/products" className="hover:text-amber-300 transition duration-200 text-sm">Shop All</Link></li>
            <li><Link href="/about" className="hover:text-amber-300 transition duration-200 text-sm">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-amber-300 transition duration-200 text-sm">Contact</Link></li>
            <li><Link href="/faq" className="hover:text-amber-300 transition duration-200 text-sm">FAQs</Link></li>
          </ul>
        </div>

        {/* Contact Us */}
        <div>
          <h3 className="text-xl font-bold text-white mb-4">Contact Us</h3>
          <address className="not-italic text-sm space-y-2">
            <p>123 Craft Lane, Artisan City, AC 12345</p>
            <p>+1 (123) 456-7890</p>
            <p><a href="mailto:info@mycraftstore.com" className="hover:text-amber-300 transition duration-200">info@mycraftstore.com</a></p>
          </address>
          <div className="mt-4">
            <h4 className="text-lg font-semibold text-white mb-2">Connect With Us</h4>
            <div className="flex space-x-4">
              {/* Social Media Icons - Replace with actual SVGs or links */}
              <a href="#" className="text-gray-400 hover:text-amber-300 transition duration-200">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33V22C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-amber-300 transition duration-200">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.002 3.797.048.843.04 1.168.109 1.402.198.64.233 1.09.493 1.515.908.425.415.685.865.919 1.504.089.234.159.56.198 1.402.046 1.013.048 1.377.048 3.797s-.002 2.43-.048 3.797c-.04.844-.109 1.169-.198 1.402-.233.64-.493 1.09-.908 1.515-.415.425-.865.685-.919 1.504-.089.234-.159-.56-.198-1.402-.046-1.013-.048-1.377-.048-3.797s.002-2.43.048-3.797c.04-.844.109-1.169.198-1.402.233-.64.493-1.09.908-1.515.415-.425.865-.685.919-1.504.089-.234.159-.56.198-1.402.046-1.013.048-1.377.048-3.797Z" clipRule="evenodd" /><path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm0 1a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM18 5.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" /></svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-amber-300 transition duration-200">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M.05 3.166A8.773 8.773 0 0 1 8.5 0C13.844 0 16.89 2.135 16.89 6.847c0 4.71-2.946 6.847-8.39 6.847-5.445 0-8.39-2.137-8.39-6.847 0-4.712 3.045-6.847 8.39-6.847Z" /><path fillRule="evenodd" d="M22.657 1.884C21.731.857 20.461.25 19.043.25c-1.396 0-2.607.51-3.52 1.547-1.042 1.157-1.562 2.68-1.562 4.673 0 1.993.52 3.516 1.562 4.673.913 1.037 2.124 1.547 3.52 1.547 1.418 0 2.688-.607 3.614-1.634.926-1.027 1.388-2.55 1.388-4.543 0-1.993-.462-3.516-1.388-4.543Z" clipRule="evenodd" /></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 md:px-8 text-center mt-8 border-t border-gray-700 pt-8">
        <p className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} My Craft Store. All rights reserved. Crafted with love.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
