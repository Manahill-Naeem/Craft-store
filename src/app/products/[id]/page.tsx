'use client';

import React, { useState, useEffect, useCallback } from 'react'; // useCallback added
import { ShoppingCart, Star } from 'lucide-react';
import { useCart } from '../../../context/CartContext';

// Define the interfaces for customization options (same as in backend and admin)
interface CustomizationChoice {
  name: string;
  price: number;
}

interface CustomizationGroup {
  groupName: string;
  type: 'single' | 'multiple'; // 'single' for radio buttons, 'multiple' for checkboxes
  choices: CustomizationChoice[];
}

// Product interface for type safety (Updated with customizationOptions)
interface Product {
  id: string;
  title: string;
  price: number; // Base price
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
  customizationOptions?: CustomizationGroup[]; // New optional field
}

// New: Interface for selected customization
interface SelectedCustomization {
  groupName: string;
  selectedChoices: CustomizationChoice[]; // Array to handle single or multiple selections
}

const ProductDetailPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();

  // New: State to manage selected customization options
  // Key: groupName, Value: Array of selected choices (even for single, it's an array for consistency)
  const [selectedCustomizations, setSelectedCustomizations] = useState<{ [key: string]: CustomizationChoice[] }>({});

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/products/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Product = await response.json();
        setProduct(data);

        // Initialize selected customizations if product has them
        if (data.customizationOptions && data.customizationOptions.length > 0) {
          const initialSelections: { [key: string]: CustomizationChoice[] } = {};
          data.customizationOptions.forEach(group => {
            // For single-choice groups, pre-select the first choice if available
            if (group.type === 'single' && group.choices.length > 0) {
              initialSelections[group.groupName] = [group.choices[0]];
            } else {
              initialSelections[group.groupName] = []; // For multiple or no default for single
            }
          });
          setSelectedCustomizations(initialSelections);
        } else {
          setSelectedCustomizations({}); // No customizations for this product
        }

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // New: Handle customization selection change
  const handleCustomizationChange = useCallback((groupName: string, choice: CustomizationChoice, type: 'single' | 'multiple') => {
    setSelectedCustomizations(prevSelections => {
      const currentChoices = prevSelections[groupName] || [];

      if (type === 'single') {
        // For single choice, replace with the new choice
        return {
          ...prevSelections,
          [groupName]: [choice],
        };
      } else {
        // For multiple choice, toggle the choice
        const isSelected = currentChoices.some(c => c.name === choice.name);
        if (isSelected) {
          // Remove if already selected
          return {
            ...prevSelections,
            [groupName]: currentChoices.filter(c => c.name !== choice.name),
          };
        } else {
          // Add if not selected
          return {
            ...prevSelections,
            [groupName]: [...currentChoices, choice],
          };
        }
      }
    });
  }, []);

  // New: Calculate current price based on base price and selected customizations
  const calculateCurrentPrice = useCallback(() => {
    if (!product) return 0;

    let currentPrice = product.onSale && product.salePrice !== undefined && product.salePrice < product.price
      ? product.salePrice
      : product.price;

    Object.values(selectedCustomizations).forEach(choices => {
      choices.forEach(choice => {
        currentPrice += choice.price;
      });
    });

    return currentPrice;
  }, [product, selectedCustomizations]);

  const handleAddToCart = () => {
    if (product) {
      // Prepare selected customization details for cart
      const finalCustomizations: SelectedCustomization[] = Object.entries(selectedCustomizations)
        .map(([groupName, selectedChoices]) => ({
          groupName,
          selectedChoices,
        }))
        .filter(item => item.selectedChoices.length > 0); // Only include groups with selections

      // Calculate the price to add to cart (including customizations)
      const priceToAddToCart = calculateCurrentPrice();

      addToCart({
        id: product.id,
        title: product.title,
        price: priceToAddToCart, // Use the calculated price
        image: product.image,
        onSale: product.onSale,
        salePrice: product.salePrice,
        customizations: finalCustomizations, // Pass selected customizations to cart
      });
      alert(`"${product.title}" added to cart with selected options!`);
    }
  };

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-[50vh]">
        <div className="text-center text-xl font-semibold text-emerald-600">Loading product details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-[50vh]">
        <div className="text-center text-xl text-red-600">Error loading product: {error}</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-[50vh]">
        <div className="text-center text-xl text-gray-600">Product not found.</div>
      </div>
    );
  }

  const currentDisplayedPrice = calculateCurrentPrice(); // Get the current price for display

  return (
    <div className="flex-grow container mx-auto p-4 md:p-8">
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10 flex flex-col lg:flex-row gap-8 md:gap-12 items-center lg:items-start">
        {/* Product Image */}
        <div className="w-full lg:w-1/2 flex justify-center items-center p-4 bg-gray-50 rounded-xl shadow-inner relative">
          {product.onSale && product.salePrice !== undefined && product.salePrice < product.price && (
            <span className="absolute top-2 left-2 bg-red-600 text-white text-sm font-bold px-4 py-2 rounded-lg z-10">
              SALE!
            </span>
          )}
          <img
            src={product.image || `https://placehold.co/400x400/cccccc/333333?text=No+Image`}
            alt={product.title}
            className="max-w-full max-h-96 object-contain rounded-lg"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://placehold.co/400x400/cccccc/333333?text=Image+Not+Found`;
            }}
          />
        </div>

        {/* Product Details */}
        <div className="w-full lg:w-1/2">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
            {product.title}
          </h1>
          <p className="text-lg text-gray-600 mb-4 capitalize">
            Category: <span className="font-semibold text-emerald-700">{product.category}</span>
          </p>

          {/* Product Rating */}
          {product.rating && (
            <div className="flex items-center mb-4">
              <div className="flex text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    fill={i < Math.round(product.rating.rate) ? 'currentColor' : 'none'}
                    stroke={i < Math.round(product.rating.rate) ? 'currentColor' : 'currentColor'}
                  />
                ))}
              </div>
              <span className="ml-2 text-gray-700">
                {product.rating.rate.toFixed(1)} ({product.rating.count} reviews)
              </span>
            </div>
          )}

          {/* New: Customization Options Display */}
          {product.customizationOptions && product.customizationOptions.length > 0 && (
            <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-4">
              <h2 className="text-xl font-bold text-gray-800">Customize Your Order:</h2>
              {product.customizationOptions.map((group, groupIndex) => (
                <div key={groupIndex} className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-700">{group.groupName}:</h3>
                  <div className="flex flex-wrap gap-3">
                    {group.choices.map((choice, choiceIndex) => (
                      <label
                        key={choiceIndex}
                        className={`inline-flex items-center p-3 rounded-lg cursor-pointer transition duration-200
                          ${group.type === 'single'
                            ? (selectedCustomizations[group.groupName] && selectedCustomizations[group.groupName][0]?.name === choice.name ? 'bg-emerald-600 text-white shadow-md' : 'bg-white border border-gray-300 hover:bg-gray-100')
                            : (selectedCustomizations[group.groupName] && selectedCustomizations[group.groupName].some(c => c.name === choice.name) ? 'bg-emerald-600 text-white shadow-md' : 'bg-white border border-gray-300 hover:bg-gray-100')
                          }`}
                      >
                        <input
                          type={group.type === 'single' ? 'radio' : 'checkbox'}
                          name={group.groupName} // Use groupName as name for radio buttons
                          value={choice.name}
                          checked={
                            group.type === 'single'
                              ? (selectedCustomizations[group.groupName] && selectedCustomizations[group.groupName][0]?.name === choice.name)
                              : (selectedCustomizations[group.groupName] && selectedCustomizations[group.groupName].some(c => c.name === choice.name))
                          }
                          onChange={() => handleCustomizationChange(group.groupName, choice, group.type)}
                          className={`${group.type === 'single' ? 'form-radio' : 'form-checkbox'} text-emerald-600 h-5 w-5 mr-2`}
                        />
                        <span className="font-medium">
                          {choice.name}
                          {choice.price > 0 && (
                            <span className="ml-2 text-sm"> (+${choice.price.toFixed(2)})</span>
                          )}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Price Display */}
          <div className="flex items-baseline mb-6">
            {product.onSale && product.salePrice !== undefined && product.salePrice < product.price ? (
              <>
                <span className="text-2xl md:text-3xl font-bold text-red-600 mr-3">
                  ${currentDisplayedPrice.toFixed(2)} {/* Display calculated price */}
                </span>
                <span className="text-lg md:text-xl text-gray-500 line-through">
                  ${product.price.toFixed(2)} {/* Show original base price strikethrough */}
                </span>
              </>
            ) : (
              <span className="text-2xl md:text-3xl font-bold text-emerald-600">
                ${currentDisplayedPrice.toFixed(2)} {/* Display calculated price */}
              </span>
            )}
          </div>

          <h2 className="text-xl font-semibold text-gray-800 mb-3">Description:</h2>
          <p className="text-gray-700 leading-relaxed mb-8">
            {product.description}
          </p>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="flex items-center justify-center bg-emerald-600 text-white font-bold px-8 py-4 rounded-full shadow-lg hover:bg-emerald-700 transform hover:scale-105 transition duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-emerald-300 focus:ring-opacity-75 w-full lg:w-auto"
          >
            <ShoppingCart size={24} className="mr-3" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
