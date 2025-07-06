// app/api/products/route.ts
import { NextResponse } from 'next/server';
import { getDb } from '../../../lib/mongodb';

// Define the interfaces for customization options (same as frontend)
interface CustomizationChoice {
  name: string;
  price: number;
}

interface CustomizationGroup {
  groupName: string;
  type: 'single' | 'multiple';
  choices: CustomizationChoice[];
}

// Product interface (updated with subCategory)
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

declare const __app_id: string | undefined;

// Define the GET handler for fetching products
export async function GET(request: Request) {
  try {
    const db = await getDb();
    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
    const productsCollectionName = `products_${appId}`;
    const productsCollection = db.collection(productsCollectionName);

    const products = await productsCollection.find({}).toArray();

    const productsToSend = products.map(product => ({
      ...product,
      _id: product._id.toString(),
      id: product.id || product._id.toString()
    }));

    return NextResponse.json(productsToSend);
  } catch (error: any) {
    console.error('Failed to fetch products:', error);
    return NextResponse.json({ message: 'Failed to fetch products', error: error.message }, { status: 500 });
  }
}

// Define the POST handler for adding new products (Updated for subCategory)
export async function POST(request: Request) {
  try {
    const db = await getDb();
    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
    const productsCollectionName = `products_${appId}`;
    const productsCollection = db.collection(productsCollectionName);

    const newProduct = await request.json();

    // Basic validation (image is now handled client-side in admin form)
    if (!newProduct.title || !newProduct.price || !newProduct.description || !newProduct.category || !newProduct.image) {
      return NextResponse.json({ message: 'Missing required product fields' }, { status: 400 });
    }

    // Handle optional sale and customization fields, and new subCategory
    const productToInsert: any = {
      ...newProduct,
      onSale: newProduct.onSale || false,
      salePrice: newProduct.onSale ? parseFloat(newProduct.salePrice) : undefined,
      customizationOptions: newProduct.customizationOptions || [],
      subCategory: newProduct.subCategory || undefined, // Save subcategory
    };

    // Ensure salePrice is valid if onSale is true
    if (productToInsert.onSale && (isNaN(productToInsert.salePrice) || productToInsert.salePrice <= 0 || productToInsert.salePrice >= productToInsert.price)) {
        return NextResponse.json({ message: 'Invalid sale price for product on sale' }, { status: 400 });
    }

    const result = await productsCollection.insertOne(productToInsert);

    return NextResponse.json({
      message: 'Product added successfully',
      productId: result.insertedId.toString(),
      insertedProduct: { ...productToInsert, _id: result.insertedId.toString(), id: result.insertedId.toString() }
    }, { status: 201 });
  } catch (error: any) {
    console.error('Failed to add product:', error);
    return NextResponse.json({ message: 'Failed to add product', error: error.message }, { status: 500 });
  }
}
