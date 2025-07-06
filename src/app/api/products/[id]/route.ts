// app/api/products/[id]/route.ts
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getDb } from '../../../../lib/mongodb';

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

// Define the GET handler for fetching a single product by ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const db = await getDb();
    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
    const productsCollectionName = `products_${appId}`;
    const productsCollection = db.collection(productsCollectionName);

    let product;
    try {
      product = await productsCollection.findOne({ _id: new ObjectId(id) });
    } catch (e) {
      product = await productsCollection.findOne({ id: id });
    }

    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    const productToSend = {
      ...product,
      _id: product._id.toString(),
      id: product.id || product._id.toString()
    };

    return NextResponse.json(productToSend);
  } catch (error: any) {
    console.error(`Failed to fetch product with ID ${id}:`, error);
    return NextResponse.json({ message: 'Failed to fetch product', error: error.message }, { status: 500 });
  }
}

// Define the PUT handler for updating a product (Updated for subCategory)
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const db = await getDb();
    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
    const productsCollectionName = `products_${appId}`;
    const productsCollection = db.collection(productsCollectionName);

    const updatedProductData = await request.json();

    delete updatedProductData._id;
    if (updatedProductData.id === id) {
        delete updatedProductData.id;
    }

    // Handle optional sale fields for update
    if (updatedProductData.onSale === false) {
        updatedProductData.salePrice = undefined;
    } else if (updatedProductData.onSale === true) {
        updatedProductData.salePrice = parseFloat(updatedProductData.salePrice);
        if (isNaN(updatedProductData.salePrice) || updatedProductData.salePrice <= 0 || updatedProductData.salePrice >= updatedProductData.price) {
            return NextResponse.json({ message: 'Invalid sale price for product on sale' }, { status: 400 });
        }
    } else {
        delete updatedProductData.onSale;
        delete updatedProductData.salePrice;
    }

    // Handle customization options: Ensure it's an array, if provided
    if (updatedProductData.customizationOptions !== undefined) {
        if (!Array.isArray(updatedProductData.customizationOptions)) {
            return NextResponse.json({ message: 'customizationOptions must be an array.' }, { status: 400 });
        }
    }

    // Handle subCategory: Ensure it's a string or undefined
    if (updatedProductData.subCategory !== undefined && typeof updatedProductData.subCategory !== 'string') {
        return NextResponse.json({ message: 'subCategory must be a string or undefined.' }, { status: 400 });
    }
    // If subCategory is an empty string, save it as undefined to keep database clean
    if (updatedProductData.subCategory === '') {
        updatedProductData.subCategory = undefined;
    }


    const result = await productsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedProductData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: 'Product not found or no changes made' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Product updated successfully' });
  } catch (error: any) {
    console.error(`Failed to update product with ID ${id}:`, error);
    return NextResponse.json({ message: 'Failed to update product', error: error.message }, { status: 500 });
  }
}

// Define the DELETE handler for deleting a product
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const db = await getDb();
    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
    const productsCollectionName = `products_${appId}`;
    const productsCollection = db.collection(productsCollectionName);

    const result = await productsCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error: any) {
    console.error(`Failed to delete product with ID ${id}:`, error);
    return NextResponse.json({ message: 'Failed to delete product', error: error.message }, { status: 500 });
  }
}
