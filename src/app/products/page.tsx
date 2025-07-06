'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { Star } from 'lucide-react';

// Product interface for type safety
interface Product {
  _id: string;
  id: string;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating?: {
    rate: number;
    count: number;
  };
  onSale?: boolean;
  salePrice?: number;
}

const ProductsPage = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState('All Products');

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
        setAllProducts(data);
        applyFilters(data, window.location.hash); // Initial filter application after products are fetched
      } catch (err: any) {
        console.error('Failed to fetch products:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    const handleHashChange = () => {
      applyFilters(allProducts, window.location.hash);
    };

    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [allProducts]);

  const applyFilters = (productsToFilter: Product[], hash: string) => {
    let currentFiltered = [...productsToFilter];
    let filterName = 'All Products';

    const cleanHash = hash.replace('#', '');

    switch (cleanHash) {
      case 'pearl-collection':
        currentFiltered = currentFiltered.filter(p => p.category.toLowerCase() === 'jewelery' && p.title.toLowerCase().includes('pearl'));
        filterName = 'Pearl Collection';
        break;
      case 'gifts-collection-bouquet':
        currentFiltered = currentFiltered.filter(p => p.category.toLowerCase() === 'gifts' && p.title.toLowerCase().includes('bouquet'));
        filterName = 'Gifts Collection: Bouquet';
        break;
      case 'event-collection-wedding':
        currentFiltered = currentFiltered.filter(p => p.category.toLowerCase() === 'event' && p.title.toLowerCase().includes('wedding'));
        filterName = 'Event Collection: Wedding';
        break;
      case 'event-collection-birthday':
        currentFiltered = currentFiltered.filter(p => p.category.toLowerCase() === 'event' && p.title.toLowerCase().includes('birthday'));
        filterName = 'Event Collection: Birthday';
        break;
      default:
        const categoryMatch = allProducts.find(p => p.category.toLowerCase() === cleanHash.toLowerCase());
        if (categoryMatch) {
          currentFiltered = currentFiltered.filter(p => p.category.toLowerCase() === cleanHash.toLowerCase());
          filterName = categoryMatch.category;
        } else {
          filterName = 'All Products';
          currentFiltered = [...productsToFilter];
        }
        break;
    }

    setFilteredProducts(currentFiltered);
    setActiveFilter(filterName);
  };


  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product.id,
      title: product.title,
      price: product.onSale && product.salePrice !== undefined && product.salePrice < product.price
        ? product.salePrice
        : product.price,
      image: product.image,
      onSale: product.onSale,
      salePrice: product.salePrice,
    });
    alert(`"${product.title}" added to cart!`);
  };

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-[50vh]">
        <div className="text-center text-xl font-semibold text-emerald-600">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-[50vh]">
        <div className="text-center text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="flex-grow container mx-auto p-4 md:p-8">
      <h1 className="text-4xl md:text-5xl font-extrabold text-center text-gray-900 mb-4">
        Our Products
      </h1>
      <p className="text-xl text-gray-600 text-center mb-12">
        Showing: <span className="font-semibold text-emerald-700">{activeFilter}</span>
      </p>

      {filteredProducts.length === 0 ? (
        <div className="text-center text-xl text-gray-600 bg-white rounded-xl shadow-lg p-8 md:p-12">
          No products found in this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {filteredProducts.map((product) => (
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
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://placehold.co/300x200/cccccc/333333?text=Image+Not+Found`;
                }}
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
    </div>
  );
};

export default ProductsPage;
