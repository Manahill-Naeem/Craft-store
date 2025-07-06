// app/api/create-payment-intent/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with your secret key
// Ensure STRIPE_SECRET_KEY is set in your .env.local file
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-06-20', // Use a recent API version
});

export async function POST(request: Request) {
  try {
    const { amount, currency = 'usd' } = await request.json(); // Get amount and currency from frontend

    // Validate amount
    if (typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ message: 'Invalid amount provided' }, { status: 400 });
    }

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects amount in cents
      currency: currency,
      automatic_payment_methods: {
        enabled: true,
      },
      // You can add more metadata here, e.g., order ID, customer ID
      metadata: { integration_check: 'accept_a_payment' },
    });

    // Send the client secret to the frontend
    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error: any) {
    console.error('Error creating Payment Intent:', error);
    return NextResponse.json({ message: 'Error creating Payment Intent', error: error.message }, { status: 500 });
  }
}
