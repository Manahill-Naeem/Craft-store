'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PlusCircle, Edit, Trash2, XCircle, Package, ShoppingBag, MessageSquare, Reply, CheckCircle, Plus, Minus } from 'lucide-react';

// Define the interfaces for customization options
interface CustomizationChoice {
  name: string;
  price: number;
}

interface CustomizationGroup {
  groupName: string;
  type: 'single' | 'multiple';
  choices: CustomizationChoice[];
}

// Product interface for type safety (Updated with subCategory)
interface Product {
  _id: string;
  id: string;
  title: string;
  price: number;
  description: string;
  category: string;
  subCategory?: string; // New optional field for subcategory
  image: string;
  rating?: {
    rate: number;
    count: number;
  };
  onSale?: boolean;
  salePrice?: number;
  customizationOptions?: CustomizationGroup[];
}

// Order interface for type safety
interface Order {
  _id: string;
  shippingInfo: {
    fullName: string;
    email: string;
    address: string;
    city: string;
    zipCode: string;
    country: string;
  };
  items: Array<{
    id: string;
    title: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  subtotal: number;
  deliveryCharge: number;
  totalAmount: number;
  paymentMethod: string;
  orderDate: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// Contact Message interface
interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
}

// Define the CATEGORIES_WITH_SUBCATEGORIES structure
const CATEGORIES_WITH_SUBCATEGORIES = [
  {
    name: 'Jewelery',
    subcategories: ['All Jewelery', 'Pearl Collection', 'Gold Plated', 'Silver Plated'],
  },
  {
    name: 'Electronics',
    subcategories: ['All Electronics', 'Mobile Phones', 'Laptops', 'Accessories'],
  },
  {
    name: 'Men\'s Clothing',
    subcategories: ['All Men\'s Clothing', 'Shirts', 'Pants', 'Jackets'],
  },
  {
    name: 'Women\'s Clothing',
    subcategories: ['All Women\'s Clothing', 'Dresses', 'Skirts', 'Tops'],
  },
  {
    name: 'Gifts',
    subcategories: ['All Gifts', 'Bouquets', 'Gift Baskets', 'Personalized Gifts'],
  },
  {
    name: 'Event',
    subcategories: ['All Event', 'Wedding Decor', 'Birthday Supplies', 'Party Favors'],
  },
  {
    name: 'Pottery',
    subcategories: ['All Pottery', 'Vases', 'Mugs', 'Sculptures'],
  },
  {
    name: 'Home Decor',
    subcategories: ['All Home Decor', 'Wall Art', 'Lamps', 'Cushions'],
  },
  {
    name: 'Textiles',
    subcategories: ['All Textiles', 'Carpets', 'Bedding', 'Curtains'],
  },
];

// Extract only main category names for initial dropdown (if needed, though we can use the full structure)
const mainCategories = CATEGORIES_WITH_SUBCATEGORIES.map(cat => cat.name);


const AdminDashboardPage = () => {
  const router = useRouter();
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState('products');

  // Form states for products
  const [formTitle, setFormTitle] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formCategory, setFormCategory] = useState(mainCategories[0]); // Default to first main category
  const [formSubCategory, setFormSubCategory] = useState(''); // New state for subcategory
  const [formImage, setFormImage] = useState<string | null>(null);
  const [formImageFile, setFormImageFile] = useState<File | null>(null);
  const [formOnSale, setFormOnSale] = useState(false);
  const [formSalePrice, setFormSalePrice] = useState('');
  const [formCustomizationOptions, setFormCustomizationOptions] = useState<CustomizationGroup[]>([]);

  // Reply Modal states
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [replyToEmail, setReplyToEmail] = useState('');
  const [replySubject, setReplySubject] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [replyingToMessageId, setReplyingToMessageId] = useState<string | null>(null);
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [replyStatus, setReplyStatus] = useState<string | null>(null);

  // Effect to update subcategory when main category changes
  useEffect(() => {
    const selectedMainCategory = CATEGORIES_WITH_SUBCATEGORIES.find(
      (cat) => cat.name === formCategory
    );
    if (selectedMainCategory && selectedMainCategory.subcategories.length > 0) {
      setFormSubCategory(selectedMainCategory.subcategories[0]); // Default to first subcategory
    } else {
      setFormSubCategory(''); // Clear subcategory if no subcategories for selected main category
    }
  }, [formCategory]);


  // Check admin login status on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const loggedIn = localStorage.getItem('is_admin_logged_in') === 'true';
      setIsAdminLoggedIn(loggedIn);
      if (!loggedIn) {
        router.push('/admin/login');
      } else {
        fetchProducts();
        fetchOrders();
        fetchContactMessages();
      }
    }
  }, [router]);

  // Function to fetch products from your API
  const fetchProducts = async () => {
    setLoadingProducts(true);
    setError(null);
    try {
      const response = await fetch('/api/products');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Product[] = await response.json();
      setProducts(data);
    } catch (err: any) {
      console.error('Failed to fetch products:', err);
      setError('Failed to load products: ' + err.message);
    } finally {
      setLoadingProducts(false);
    }
  };

  // Function to fetch orders from your API
  const fetchOrders = async () => {
    setLoadingOrders(true);
    setError(null);
    try {
      const response = await fetch('/api/orders');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Order[] = await response.json();
      setOrders(data);
    } catch (err: any) {
      console.error('Failed to fetch orders:', err);
      setError('Failed to load orders: ' + err.message);
    } finally {
      setLoadingOrders(false);
    }
  };

  // Function to fetch contact messages from your API
  const fetchContactMessages = async () => {
    setLoadingMessages(true);
    setError(null);
    try {
      const response = await fetch('/api/contact');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: ContactMessage[] = await response.json();
      setContactMessages(data);
    } catch (err: any) {
      console.error('Failed to fetch contact messages:', err);
      setError('Failed to load contact messages: ' + err.message);
    } finally {
      setLoadingMessages(false);
    }
  };

  // Handle image file selection and convert to Base64
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFormImage(null);
      setFormImageFile(null);
    }
  };

  // Open form for adding a new product
  const handleAddProductClick = () => {
    setEditingProduct(null);
    setFormTitle('');
    setFormPrice('');
    setFormDescription('');
    setFormCategory(mainCategories[0]); // Reset to first main category
    setFormSubCategory(''); // Reset subcategory
    setFormImage(null);
    setFormImageFile(null);
    setFormOnSale(false);
    setFormSalePrice('');
    setFormCustomizationOptions([]);
    setIsProductFormOpen(true);
  };

  // Open form for editing an existing product
  const handleEditProductClick = (product: Product) => {
    setEditingProduct(product);
    setFormTitle(product.title);
    setFormPrice(product.price.toString());
    setFormDescription(product.description);
    setFormCategory(product.category);
    setFormSubCategory(product.subCategory || ''); // Load existing subcategory
    setFormImage(product.image);
    setFormImageFile(null);
    setFormOnSale(product.onSale || false);
    setFormSalePrice(product.salePrice?.toString() || '');
    setFormCustomizationOptions(product.customizationOptions || []);
    setIsProductFormOpen(true);
  };

  // Handle product form submission (Add or Edit)
  const handleProductFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingProducts(true);
    setError(null);

    // Client-side validation for image
    if (!formImage && !editingProduct?.image) {
      setError('Product image is required.');
      setLoadingProducts(false);
      return;
    }

    const productData: Partial<Product> = {
      title: formTitle,
      price: parseFloat(formPrice),
      description: formDescription,
      category: formCategory,
      subCategory: formSubCategory || undefined, // Include subcategory (or undefined if empty)
      image: formImage || editingProduct?.image,
      rating: editingProduct?.rating || { rate: 0, count: 0 },
      onSale: formOnSale,
      salePrice: formOnSale ? parseFloat(formSalePrice) : undefined,
      customizationOptions: formCustomizationOptions,
    };

    if (formOnSale && (isNaN(parseFloat(formSalePrice)) || parseFloat(formSalePrice) <= 0 || parseFloat(formSalePrice) >= parseFloat(formPrice))) {
      setError('Sale price must be a valid number, greater than 0, and less than original price.');
      setLoadingProducts(false);
      return;
    }

    // Validate customization options before submission
    for (const group of formCustomizationOptions) {
      if (!group.groupName.trim()) {
        setError('Customization group name cannot be empty.');
        setLoadingProducts(false);
        return;
      }
      if (group.choices.length === 0) {
        setError(`Customization group "${group.groupName}" must have at least one choice.`);
        setLoadingProducts(false);
        return;
      }
      for (const choice of group.choices) {
        if (!choice.name.trim()) {
          setError(`Customization choice name in group "${group.groupName}" cannot be empty.`);
          setLoadingProducts(false);
          return;
        }
        if (isNaN(choice.price)) {
          setError(`Customization choice price in group "${group.groupName}" for "${choice.name}" must be a valid number.`);
          setLoadingProducts(false);
          return;
        }
      }
    }


    try {
      let response;
      if (editingProduct) {
        response = await fetch(`/api/products/${editingProduct._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData),
        });
      } else {
        response = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData.message || 'Unknown error'}`);
      }

      alert(`Product ${editingProduct ? 'updated' : 'added'} successfully!`);
      setIsProductFormOpen(false);
      fetchProducts();
    } catch (err: any) {
      console.error('Error submitting product:', err);
      setError(`Failed to ${editingProduct ? 'update' : 'add'} product: ${err.message}`);
    } finally {
      setLoadingProducts(false);
    }
  };

  // Handle product deletion
  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    setLoadingProducts(true);
    setError(null);
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData.message || 'Unknown error'}`);
      }

      alert('Product deleted successfully!');
      fetchProducts();
    } catch (err: any) {
      console.error('Error deleting product:', err);
      setError('Failed to delete product: ' + err.message);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('is_admin_logged_in');
      router.push('/admin/login');
    }
  };

  // Open Reply Modal
  const handleOpenReplyModal = (message: ContactMessage) => {
    setReplyToEmail(message.email);
    setReplySubject(`Re: ${message.subject}`);
    setReplyMessage(`\n\n--- Original Message ---\nFrom: ${message.name} <${message.email}>\nSubject: ${message.subject}\nDate: ${formatDate(message.createdAt)}\n\n${message.message}`);
    setReplyingToMessageId(message._id);
    setIsReplyModalOpen(true);
    setReplyStatus(null);
  };

  // Close Reply Modal
  const handleCloseReplyModal = () => {
    setIsReplyModalOpen(false);
    setReplyToEmail('');
    setReplySubject('');
    setReplyMessage('');
    setReplyingToMessageId(null);
    setReplyStatus(null);
  };

  // Handle Reply Submission
  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSendingReply(true);
    setReplyStatus(null);

    try {
      const response = await fetch('/api/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: replyToEmail,
          subject: replySubject,
          message: replyMessage,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send reply.');
      }

      setReplyStatus('Reply sent successfully!');
      if (replyingToMessageId) {
        await handleMarkAsRead(replyingToMessageId, true);
      }
      setTimeout(() => {
        handleCloseReplyModal();
      }, 2000);
    } catch (err: any) {
      console.error('Error sending reply:', err);
      setReplyStatus(`Failed to send reply: ${err.message}`);
    } finally {
      setIsSendingReply(false);
    }
  };

  // Function to mark a contact message as read
  const handleMarkAsRead = async (messageId: string, silent: boolean = false) => {
    setError(null);
    try {
      const response = await fetch(`/api/contact/${messageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: true }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update message status');
      }
      if (!silent) {
        alert('Message marked as read!');
      }
      fetchContactMessages();
    } catch (err: any) {
      console.error('Error marking message as read:', err);
      setError('Failed to mark message as read: ' + err.message);
    }
  };

  // --- Customization Options Management Functions ---

  const handleAddGroup = () => {
    setFormCustomizationOptions([...formCustomizationOptions, { groupName: '', type: 'single', choices: [] }]);
  };

  const handleRemoveGroup = (groupIndex: number) => {
    setFormCustomizationOptions(formCustomizationOptions.filter((_, i) => i !== groupIndex));
  };

  const handleGroupChange = (groupIndex: number, field: keyof CustomizationGroup, value: string) => {
    const updatedGroups = [...formCustomizationOptions];
    if (field === 'type' && (value === 'single' || value === 'multiple')) {
      updatedGroups[groupIndex][field] = value;
    } else if (field === 'groupName') {
      updatedGroups[groupIndex][field] = value;
    }
    setFormCustomizationOptions(updatedGroups);
  };

  const handleAddChoice = (groupIndex: number) => {
    const updatedGroups = [...formCustomizationOptions];
    updatedGroups[groupIndex].choices.push({ name: '', price: 0 });
    setFormCustomizationOptions(updatedGroups);
  };

  const handleRemoveChoice = (groupIndex: number, choiceIndex: number) => {
    const updatedGroups = [...formCustomizationOptions];
    updatedGroups[groupIndex].choices = updatedGroups[groupIndex].choices.filter((_, i) => i !== choiceIndex);
    setFormCustomizationOptions(updatedGroups);
  };

  const handleChoiceChange = (groupIndex: number, choiceIndex: number, field: keyof CustomizationChoice, value: string) => {
    const updatedGroups = [...formCustomizationOptions];
    if (field === 'price') {
      updatedGroups[groupIndex].choices[choiceIndex][field] = parseFloat(value) || 0;
    } else {
      updatedGroups[groupIndex].choices[choiceIndex][field] = value;
    }
    setFormCustomizationOptions(updatedGroups);
  };


  if (!isAdminLoggedIn) {
    return null;
  }

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get subcategories for the currently selected main category
  const currentSubcategories = CATEGORIES_WITH_SUBCATEGORIES.find(
    (cat) => cat.name === formCategory
  )?.subcategories || [];

  return (
    <div className="flex-grow container mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
          Admin Dashboard
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-red-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75"
        >
          Logout
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      {/* Tabs for Products, Orders, and Contact Messages */}
      <div className="flex border-b border-gray-200 mb-8 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('products')}
          className={`flex-shrink-0 px-6 py-3 text-lg font-medium rounded-t-lg transition duration-200 ${
            activeTab === 'products'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <ShoppingBag size={20} className="inline-block mr-2" /> Products
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex-shrink-0 px-6 py-3 text-lg font-medium rounded-t-lg transition duration-200 ${
            activeTab === 'orders'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          } ml-2`}
        >
          <Package size={20} className="inline-block mr-2" /> Orders
        </button>
        <button
          onClick={() => setActiveTab('messages')}
          className={`flex-shrink-0 px-6 py-3 text-lg font-medium rounded-t-lg transition duration-200 ${
            activeTab === 'messages'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          } ml-2`}
        >
          <MessageSquare size={20} className="inline-block mr-2" /> Messages
        </button>
      </div>

      {/* Products Tab Content */}
      {activeTab === 'products' && (
        <>
          <div className="mb-8 text-right">
            <button
              onClick={handleAddProductClick}
              className="bg-emerald-600 text-white font-bold px-6 py-3 rounded-lg shadow-md hover:bg-emerald-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-75 flex items-center ml-auto"
            >
              <PlusCircle size={24} className="mr-2" /> Add New Product
            </button>
          </div>

          {isProductFormOpen && (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 max-w-2xl w-full relative max-h-[90vh] overflow-y-auto">
                <button
                  onClick={() => setIsProductFormOpen(false)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition duration-200"
                  aria-label="Close form"
                >
                  <XCircle size={28} />
                </button>
                <h2 className="text-3xl font-bold text-emerald-700 mb-6 text-center">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <form onSubmit={handleProductFormSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="title" className="block text-gray-800 text-sm font-medium mb-2">Title</label>
                    <input
                      type="text"
                      id="title"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="price" className="block text-gray-800 text-sm font-medium mb-2">Base Price</label>
                    <input
                      type="number"
                      id="price"
                      value={formPrice}
                      onChange={(e) => setFormPrice(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      step="0.01"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="description" className="block text-gray-800 text-sm font-medium mb-2">Description</label>
                    <textarea
                      id="description"
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-y"
                      rows={4}
                      required
                    ></textarea>
                  </div>
                  <div>
                    <label htmlFor="category" className="block text-gray-800 text-sm font-medium mb-2">Category</label>
                    <select
                      id="category"
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    >
                      {CATEGORIES_WITH_SUBCATEGORIES.map((cat) => (
                        <option key={cat.name} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  {/* New: Subcategory Dropdown */}
                  {currentSubcategories.length > 0 && (
                    <div>
                      <label htmlFor="subCategory" className="block text-gray-800 text-sm font-medium mb-2">Subcategory</label>
                      <select
                        id="subCategory"
                        value={formSubCategory}
                        onChange={(e) => setFormSubCategory(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        required={currentSubcategories.length > 0} // Make required if subcategories exist for the main category
                      >
                        {currentSubcategories.map((subcat) => (
                          <option key={subcat} value={subcat}>{subcat}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="onSale"
                      checked={formOnSale}
                      onChange={(e) => setFormOnSale(e.target.checked)}
                      className="form-checkbox h-5 w-5 text-emerald-600 rounded focus:ring-emerald-500"
                    />
                    <label htmlFor="onSale" className="ml-2 text-gray-800 text-sm font-medium">On Sale?</label>
                  </div>
                  {formOnSale && (
                    <div>
                      <label htmlFor="salePrice" className="block text-gray-800 text-sm font-medium mb-2">Sale Price</label>
                      <input
                        type="number"
                        id="salePrice"
                        value={formSalePrice}
                        onChange={(e) => setFormSalePrice(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        step="0.01"
                        required={formOnSale}
                      />
                    </div>
                  )}

                  {/* Customization Options Section */}
                  <div className="border border-gray-200 rounded-lg p-4 space-y-4">
                    <h3 className="text-xl font-bold text-gray-800">Customization Options</h3>
                    {formCustomizationOptions.map((group, groupIndex) => (
                      <div key={groupIndex} className="border border-gray-300 rounded-lg p-4 bg-gray-50 space-y-3 relative">
                        <button
                          type="button"
                          onClick={() => handleRemoveGroup(groupIndex)}
                          className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                          aria-label="Remove option group"
                        >
                          <XCircle size={20} />
                        </button>
                        <div>
                          <label className="block text-gray-800 text-sm font-medium mb-2">Group Name</label>
                          <input
                            type="text"
                            value={group.groupName}
                            onChange={(e) => handleGroupChange(groupIndex, 'groupName', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            placeholder="e.g., Size, Material, Add-ons"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-gray-800 text-sm font-medium mb-2">Selection Type</label>
                          <select
                            value={group.type}
                            onChange={(e) => handleGroupChange(groupIndex, 'type', e.target.value as 'single' | 'multiple')}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          >
                            <option value="single">Single Choice (Radio Buttons)</option>
                            <option value="multiple">Multiple Choices (Checkboxes)</option>
                          </select>
                        </div>
                        <h4 className="text-md font-semibold text-gray-700 mt-4 mb-2">Choices:</h4>
                        <div className="space-y-2">
                          {group.choices.map((choice, choiceIndex) => (
                            <div key={choiceIndex} className="flex items-center space-x-2">
                              <input
                                type="text"
                                value={choice.name}
                                onChange={(e) => handleChoiceChange(groupIndex, choiceIndex, 'name', e.target.value)}
                                className="w-1/2 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                placeholder="Choice Name (e.g., Large)"
                                required
                              />
                              <input
                                type="number"
                                value={choice.price}
                                onChange={(e) => handleChoiceChange(groupIndex, choiceIndex, 'price', e.target.value)}
                                className="w-1/3 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                placeholder="Price (e.g., 5.00)"
                                step="0.01"
                                required
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveChoice(groupIndex, choiceIndex)}
                                className="text-red-500 hover:text-red-700 p-1"
                                aria-label="Remove choice"
                              >
                                <Minus size={18} />
                              </button>
                            </div>
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleAddChoice(groupIndex)}
                          className="mt-3 bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition duration-200 flex items-center text-sm"
                        >
                          <Plus size={16} className="mr-1" /> Add Choice
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={handleAddGroup}
                      className="w-full bg-emerald-600 text-white font-bold px-6 py-3 rounded-lg shadow-md hover:bg-emerald-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 flex items-center justify-center mt-4"
                    >
                      <PlusCircle size={20} className="mr-2" /> Add Option Group
                    </button>
                  </div>

                  <div>
                    <label htmlFor="image" className="block text-gray-800 text-sm font-medium mb-2">Product Image</label>
                    <input
                      type="file"
                      id="image"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                      required={!editingProduct && !formImage}
                    />
                    {formImage && (
                      <div className="mt-4">
                        <p className="text-gray-700 text-sm mb-2">Current Image Preview:</p>
                        <img src={formImage} alt="Product Preview" className="max-w-xs max-h-48 object-contain border border-gray-200 p-2 rounded-lg" />
                      </div>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={loadingProducts}
                    className="w-full bg-amber-500 text-gray-900 font-bold px-6 py-3 rounded-lg shadow-md hover:bg-amber-400 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loadingProducts ? (editingProduct ? 'Updating...' : 'Adding...') : (editingProduct ? 'Update Product' : 'Add Product')}
                  </button>
                </form>
              </div>
            </div>
          )}

          {loadingProducts ? (
            <div className="text-center text-lg text-emerald-600">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="text-center text-xl text-gray-600 bg-white rounded-xl shadow-lg p-8 md:p-12">
              No products found. Add your first product!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {products.map((product) => (
                <div key={product._id} className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
                  <img
                    src={product.image || `https://placehold.co/300x200/cccccc/333333?text=No+Image`}
                    alt={product.title}
                    className="w-full h-48 object-contain p-4 bg-gray-50 rounded-t-xl"
                    onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/300x200/cccccc/333333?text=Image+Error`; }}
                  />
                  <div className="p-4 md:p-6 flex-grow">
                    <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                      {product.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-1 capitalize">Category: {product.category} {product.subCategory && ` / ${product.subCategory}`}</p> {/* Display subcategory */}
                    <div className="flex items-baseline mb-3">
                      {product.onSale && product.salePrice !== undefined && product.salePrice < product.price ? (
                        <>
                          <span className="text-xl font-bold text-red-600 mr-2">${product.salePrice.toFixed(2)}</span>
                          <span className="text-sm text-gray-500 line-through">${product.price.toFixed(2)}</span>
                        </>
                      ) : (
                        <span className="text-xl font-bold text-emerald-600">${product.price.toFixed(2)}</span>
                      )}
                    </div>
                    {/* Display Customization Options Summary */}
                    {product.customizationOptions && product.customizationOptions.length > 0 && (
                      <div className="mt-2 text-sm text-gray-600">
                        <span className="font-semibold">Customizable:</span> {product.customizationOptions.map(g => g.groupName).join(', ')}
                      </div>
                    )}
                    <p className="text-gray-700 text-sm line-clamp-3">{product.description}</p>
                  </div>
                  <div className="p-4 border-t border-gray-100 flex justify-end space-x-3">
                    <button
                      onClick={() => handleEditProductClick(product)}
                      className="bg-blue-100 text-blue-600 p-2 rounded-full hover:bg-blue-200 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      aria-label="Edit product"
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product._id)}
                      className="bg-red-100 text-red-600 p-2 rounded-full hover:bg-red-200 transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                      aria-label="Delete product"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Orders Tab Content */}
      {activeTab === 'orders' && (
        <>
          <h2 className="text-3xl font-bold text-emerald-700 mb-6">All Orders</h2>
          {loadingOrders ? (
            <div className="text-center text-lg text-emerald-600">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="text-center text-xl text-gray-600 bg-white rounded-xl shadow-lg p-8 md:p-12">
              No orders found yet.
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order._id} className="bg-white rounded-xl shadow-lg p-6 md:p-8 border border-gray-200">
                  <div className="flex justify-between items-center mb-4 border-b pb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Order ID: {order._id.substring(0, 8)}...</h3>
                      <p className="text-sm text-gray-600">Placed on: {formatDate(order.createdAt)}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'Processed' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'Shipped' ? 'bg-purple-100 text-purple-800' :
                      order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">Shipping Info:</h4>
                    <p className="text-gray-700 text-sm">{order.shippingInfo.fullName}</p>
                    <p className="text-gray-700 text-sm">{order.shippingInfo.email}</p>
                    <p className="text-gray-700 text-sm">{order.shippingInfo.address}, {order.shippingInfo.city}, {order.shippingInfo.zipCode}</p>
                    <p className="text-gray-700 text-sm">{order.shippingInfo.country}</p>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">Items:</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                      {order.items.map((item, index) => (
                        <li key={index}>
                          {item.title} (x{item.quantity}) - ${item.price.toFixed(2)} each
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="text-right text-lg font-bold text-gray-900 border-t pt-4 space-y-1">
                    <p>Subtotal: ${order.subtotal.toFixed(2)}</p>
                    <p>Delivery Charge: ${order.deliveryCharge.toFixed(2)}</p>
                    <p>Total: ${order.totalAmount.toFixed(2)} ({order.paymentMethod.toUpperCase()})</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Contact Messages Tab Content */}
      {activeTab === 'messages' && (
        <>
          <h2 className="text-3xl font-bold text-emerald-700 mb-6">Customer Messages</h2>
          {loadingMessages ? (
            <div className="text-center text-lg text-emerald-600">Loading messages...</div>
          ) : contactMessages.length === 0 ? (
            <div className="text-center text-xl text-gray-600 bg-white rounded-xl shadow-lg p-8 md:p-12">
              No contact messages found yet.
            </div>
          ) : (
            <div className="space-y-6">
              {contactMessages.map((message) => (
                <div key={message._id} className={`bg-white rounded-xl shadow-lg p-6 md:p-8 border ${message.read ? 'border-gray-100' : 'border-emerald-300 ring-1 ring-emerald-300'}`}>
                  <div className="flex justify-between items-center mb-4 border-b pb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Subject: {message.subject}</h3>
                      <p className="text-sm text-gray-600">From: {message.name} &lt;{message.email}&gt;</p>
                      <p className="text-sm text-gray-600">Received on: {formatDate(message.createdAt)}</p>
                    </div>
                    {!message.read && (
                      <span className="px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-800">
                        New
                      </span>
                    )}
                  </div>
                  <div className="mb-4">
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">Message:</h4>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{message.message}</p>
                  </div>
                  <div className="text-right border-t pt-4 space-x-2">
                    {!message.read && (
                      <button
                        onClick={() => handleMarkAsRead(message._id)}
                        className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-200 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center gap-1 inline-flex"
                      >
                        <CheckCircle size={18} /> Mark as Read
                      </button>
                    )}
                    <button
                      onClick={() => handleOpenReplyModal(message)}
                      className="bg-emerald-100 text-emerald-600 px-4 py-2 rounded-lg hover:bg-emerald-200 transition duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 flex items-center justify-center gap-1 inline-flex"
                    >
                      <Reply size={18} /> Reply
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Reply Message Modal */}
      {isReplyModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 max-w-2xl w-full relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={handleCloseReplyModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition duration-200"
              aria-label="Close reply form"
            >
              <XCircle size={28} />
            </button>
            <h2 className="text-3xl font-bold text-emerald-700 mb-6 text-center">
              Reply to Message
            </h2>
            <form onSubmit={handleReplySubmit} className="space-y-6">
              <div>
                <label htmlFor="replyToEmail" className="block text-gray-800 text-sm font-medium mb-2">To Email</label>
                <input
                  type="email"
                  id="replyToEmail"
                  value={replyToEmail}
                  readOnly
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div>
                <label htmlFor="replySubject" className="block text-gray-800 text-sm font-medium mb-2">Subject</label>
                <input
                  type="text"
                  id="replySubject"
                  value={replySubject}
                  onChange={(e) => setReplySubject(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="replyMessage" className="block text-gray-800 text-sm font-medium mb-2">Your Reply</label>
                <textarea
                  id="replyMessage"
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  rows={8}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-y"
                  required
                ></textarea>
              </div>

              {replyStatus && (
                <p className={`text-center text-sm ${replyStatus.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
                  {replyStatus}
                </p>
              )}

              <button
                type="submit"
                disabled={isSendingReply}
                className="w-full bg-amber-500 text-gray-900 font-bold px-6 py-3 rounded-lg shadow-md hover:bg-amber-400 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSendingReply ? 'Sending Reply...' : 'Send Reply'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
