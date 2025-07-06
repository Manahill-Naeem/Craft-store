'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ShoppingCart, Star, Filter } from 'lucide-react';
import { useCart } from '../../context/CartContext';

// Product interface for type safety
interface Product {
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
  _id: string;
  onSale?: boolean;
  salePrice?: number;
}

const SearchPage = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortOrder, setSortOrder] = useState('default');

  const { addToCart } = useCart();

  // Fetch all products initially from your MongoDB API
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Product[] = await response.json();
        setAllProducts(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  // Apply filters and search query whenever relevant states change
  useEffect(() => {
    let currentFiltered = allProducts.filter(product =>
      product.title.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase())
    );

    // Apply category filter
    if (selectedCategory !== 'All') {
      currentFiltered = currentFiltered.filter(product =>
        product.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Apply price range filter
    const min = parseFloat(minPrice);
    const max = parseFloat(maxPrice);
    if (!isNaN(min)) {
      currentFiltered = currentFiltered.filter(product => product.price >= min);
    }
    if (!isNaN(max)) {
      currentFiltered = currentFiltered.filter(product => product.price <= max);
    }

    // Apply sorting
    if (sortOrder === 'price-asc') {
      currentFiltered.sort((a, b) => {
        const priceA = a.onSale && a.salePrice !== undefined ? a.salePrice : a.price;
        const priceB = b.onSale && b.salePrice !== undefined ? b.salePrice : b.price;
        return priceA - priceB;
      });
    } else if (sortOrder === 'price-desc') {
      currentFiltered.sort((a, b) => {
        const priceA = a.onSale && a.salePrice !== undefined ? a.salePrice : a.price;
        const priceB = b.onSale && b.salePrice !== undefined ? b.salePrice : b.price;
        return priceB - priceA;
      });
    }

    setFilteredProducts(currentFiltered);
  }, [query, allProducts, selectedCategory, minPrice, maxPrice, sortOrder]);

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
    });
    alert(`"${product.title}" added to cart!`);
  };


  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-[50vh]">
        <div className="text-center text-xl font-semibold text-emerald-600">Loading products for search...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-[50vh]">
        <div className="text-center text-xl text-red-600">Error loading products: {error}</div>
      </div>
    );
  }

  const uniqueCategories = ['All', ...new Set(allProducts.map(p => p.category))];

  return (
    <div className="flex-grow container mx-auto p-4 md:p-8">
      <h1 className="text-4xl md:text-5xl font-extrabold text-center text-gray-900 mb-8">
        Search Results for "{query}"
      </h1>

      {/* Filtering and Sorting Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-gray-700">
          <Filter size={20} />
          <span className="font-semibold">Filters:</span>
        </div>

        {/* Category Filter */}
        <div className="w-full md:w-auto">
          <label htmlFor="category-filter" className="sr-only">Filter by Category</label>
          <select
            id="category-filter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full md:w-48 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition duration-200"
          >
            {uniqueCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Price Range Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <label htmlFor="min-price" className="sr-only">Min Price</label>
          <input
            type="number"
            id="min-price"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-1/2 md:w-28 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition duration-200"
          />
          <span className="text-gray-500">-</span>
          <label htmlFor="max-price" className="sr-only">Max Price</label>
          <input
            type="number"
            id="max-price"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-1/2 md:w-28 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition duration-200"
          />
        </div>

        {/* Sort By */}
        <div className="w-full md:w-auto">
          <label htmlFor="sort-by" className="sr-only">Sort By</label>
          <select
            id="sort-by"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="w-full md:w-48 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition duration-200"
          >
            <option value="default">Sort By: Relevance</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>


      {/* Search Results Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center text-xl text-gray-600 bg-white rounded-xl shadow-lg p-8 md:p-12">
          No products found matching your search and filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {filteredProducts.map((product) => (
            <a
              key={product.id}
              href={`/products/${product.id}`}
              className="block bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl group relative" // Added relative for badge
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

export default SearchPage;
