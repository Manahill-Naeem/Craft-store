// app/api/orders/route.ts
import { NextResponse } from 'next/server';
import { getDb } from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

// Declare global variables provided by the Canvas environment
declare const __app_id: string | undefined;

// Define the POST handler for placing new orders (Updated for delivery charge)
export async function POST(request: Request) {
  try {
    const db = await getDb();
    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
    const ordersCollectionName = `orders_${appId}`;
    const ordersCollection = db.collection(ordersCollectionName);

    const orderData = await request.json();

    // Basic validation for order data (updated to include subtotal and deliveryCharge)
    if (!orderData.shippingInfo || !orderData.items || orderData.items.length === 0 || !orderData.totalAmount || orderData.subtotal === undefined || orderData.deliveryCharge === undefined) {
      return NextResponse.json({ message: 'Missing required order data: shippingInfo, items, totalAmount, subtotal, or deliveryCharge.' }, { status: 400 });
    }

    // Add a timestamp and initial status
    const orderToInsert = {
      ...orderData,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: orderData.status || 'Pending',
    };

    const result = await ordersCollection.insertOne(orderToInsert);

    return NextResponse.json({
      message: 'Order placed successfully',
      orderId: result.insertedId.toString(),
    }, { status: 201 });
  } catch (error: any) {
    console.error('Failed to place order:', error);
    return NextResponse.json({ message: 'Failed to place order', error: error.message }, { status: 500 });
  }
}

// Define the GET handler for fetching all orders (existing)
export async function GET(request: Request) {
  try {
    const db = await getDb();
    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
    const ordersCollectionName = `orders_${appId}`;
    const ordersCollection = db.collection(ordersCollectionName);

    const orders = await ordersCollection.find({}).sort({ createdAt: -1 }).toArray();

    const ordersToSend = orders.map(order => ({
      ...order,
      _id: order._id.toString(),
      items: order.items.map((item: any) => ({
        ...item,
        id: item._id ? item._id.toString() : item.id
      }))
    }));

    return NextResponse.json(ordersToSend);
  } catch (error: any) {
    console.error('Failed to fetch orders:', error);
    return NextResponse.json({ message: 'Failed to fetch orders', error: error.message }, { status: 500 });
  }
}
