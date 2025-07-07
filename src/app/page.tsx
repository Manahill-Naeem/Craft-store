'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';

// Product interface for type safety
interface Product {
  _id: string;
  id: string;
  title: string;
  price: number;
  description: string;
  category: string;
  subCategory?: string; // Added subCategory for consistency
  image: string;
  rating?: {
    rate: number;
    count: number;
  };
  onSale?: boolean;
  salePrice?: number;
}

const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Product[] = await response.json();
        setProducts(data.slice(0, 6)); // Take first 6 products for featured section
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    // For homepage, we assume no customizations are selected for featured products.
    // If you want to allow customizations from homepage, you'd need to extend this logic.
    addToCart({
      id: product.id,
      title: product.title,
      price: product.onSale && product.salePrice !== undefined && product.salePrice < product.price
        ? product.salePrice
        : product.price,
      image: product.image,
      onSale: product.onSale,
      salePrice: product.salePrice,
      customizations: [], // No customizations from homepage featured section
    });
    alert(`"${product.title}" added to cart!`);
  };

  const HERO_IMAGE_URL = 'hero-image.jpeg'; // Replace with your actual image URL

  return (
    <div className="flex-grow">
      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center text-white py-16 md:py-24 rounded-b-3xl shadow-xl mb-12"
        style={{ backgroundImage: `url('${HERO_IMAGE_URL}')` }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-emerald-800 opacity-70 rounded-b-3xl"></div>
        <div className="container mx-auto px-4 md:px-8 text-center relative z-10"> {/* z-10 to bring text above overlay */}
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4 drop-shadow-lg">
            Handcrafted Treasures, Just For You
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Explore our exquisite collection of unique artisanal products, made with love and attention to detail.
          </p>
          <a href="/products" className="inline-block bg-amber-500 text-gray-900 font-bold px-8 py-4 rounded-full shadow-lg hover:bg-amber-400 transform hover:scale-105 transition duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-amber-300 focus:ring-opacity-75">
            Shop Our Latest Collection
          </a>
        </div>
      </section>

      {/* Featured Categories Section */}
      <section className="container mx-auto px-4 md:px-8 py-8 md:py-12 mb-12">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center text-gray-900 mb-8">
          Explore Our Categories
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          <div className="bg-white rounded-xl shadow-md p-6 text-center transform transition duration-300 hover:scale-105 hover:shadow-lg">
            <img src="https://placehold.co/100x100/e0f2f7/065f46?text=Jewelry" alt="Jewelry" className="mx-auto mb-4 rounded-full" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Handmade Jewelry</h3>
            <p className="text-gray-600 text-sm">Unique pieces for every style.</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center transform transition duration-300 hover:scale-105 hover:shadow-lg">
            <img src="https://placehold.co/100x100/e0f2f7/065f46?text=Pottery" alt="Pottery" className="mx-auto mb-4 rounded-full" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Artisan Pottery</h3>
            <p className="text-gray-600 text-sm">Elegance in every curve.</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center transform transition duration-300 hover:scale-105 hover:shadow-lg">
            <img src="https://placehold.co/100x100/e0f2f7/065f46?text=Textiles" alt="Textiles" className="mx-auto mb-4 rounded-full" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Woven Textiles</h3>
            <p className="text-gray-600 text-sm">Comfort and beauty combined.</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center transform transition duration-300 hover:scale-105 hover:shadow-lg">
            <img src="https://placehold.co/100x100/e0f2f7/065f46?text=Decor" alt="Home Decor" className="mx-auto mb-4 rounded-full" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Unique Home Decor</h3>
            <p className="text-gray-600 text-sm">Add a personal touch to your space.</p>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="container mx-auto px-4 md:px-8 py-8 md:py-12">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center text-gray-900 mb-8">
          Our Latest Creations
        </h2>

        {loading && (
          <div className="text-center text-lg text-emerald-600">Loading products...</div>
        )}

        {error && (
          <div className="text-center text-lg text-red-600">Error: {error}</div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {products.map((product) => (
              <a
                key={product.id}
                href={`/products/${product.id}`}
                className="block bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl group relative" // Added relative for absolute positioning of badge
              >
                {product.onSale && product.salePrice !== undefined && product.salePrice < product.price && (
                  <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse z-10">
                    SALE!
                  </span>
                )}
                <img
                  src={product.image || `https://placehold.co/300x200/cccccc/333333?text=No+Image`}
                  alt={product.title}
                  className="w-full h-48 object-contain p-4 bg-gray-50 rounded-t-xl"
                  onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/300x200/cccccc/333333?text=Image+Not+Found`; }}
                />
                <div className="p-4 md:p-6">
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 truncate group-hover:text-emerald-700 transition duration-200">
                    {product.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3 capitalize">
                    {product.category}
                  </p>
                  <div className="flex items-baseline justify-between">
                    {product.onSale && product.salePrice !== undefined && product.salePrice < product.price ? (
                      <div className="flex items-baseline">
                        <span className="text-xl md:text-2xl font-bold text-red-600 mr-2">${product.salePrice.toFixed(2)}</span>
                        <span className="text-sm text-gray-500 line-through">${product.price.toFixed(2)}</span>
                      </div>
                    ) : (
                      <span className="text-xl md:text-2xl font-bold text-emerald-600">
                        ${product.price ? product.price.toFixed(2) : 'N/A'}
                      </span>
                    )}
                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      className="bg-emerald-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-emerald-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-75"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
