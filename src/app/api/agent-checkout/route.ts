import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import type { Product } from '@/lib/types/firestore';

export const dynamic = 'force-dynamic';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey, {
  apiVersion: '2026-03-25.dahlia',
}) : null;

// Types for the expected payload
interface CartItem {
  productId: string;
  quantity: number;
}

interface ShippingAddress {
  line1: string;
  line2?: string;
  city: string;
  postal_code: string;
  country: string;
}

interface AgentCheckoutPayload {
  cartItems: CartItem[];
  shippingAddress: ShippingAddress;
  stripePaymentToken: string; // The Shared Payment Token (SPT) from the AI agent
}

// Fetches real prices from Firestore — never trust agent-supplied prices.
async function calculateOrderAmount(cartItems: CartItem[]): Promise<number> {
  const { adminDb } = await import('@/lib/firebase/admin');
  let total = 0;
  for (const item of cartItems) {
    const doc = await adminDb.collection('products').doc(item.productId).get();
    if (!doc.exists) {
      throw new Error(`Product not found: ${item.productId}`);
    }
    const product = doc.data() as Product;
    if (!product.is_active) {
      throw new Error(`Product is not available: ${item.productId}`);
    }
    total += Math.round(product.price * 100) * item.quantity;
  }
  return total;
}

export async function POST(request: Request) {
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe is not configured.' }, { status: 503 });
  }

  try {
    // 1. Payload Parsing & Validation
    const payload: Partial<AgentCheckoutPayload> = await request.json();

    const { cartItems, shippingAddress, stripePaymentToken } = payload;

    // Robust error handling for missing fields
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json(
        { error: 'Missing or invalid field: cartItems. Must be a non-empty array.' },
        { status: 400 }
      );
    }

    if (!shippingAddress || typeof shippingAddress !== 'object') {
      return NextResponse.json(
        { error: 'Missing or invalid field: shippingAddress. Must be an object.' },
        { status: 400 }
      );
    }

    if (!stripePaymentToken || typeof stripePaymentToken !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid field: stripePaymentToken. Must be a valid Shared Payment Token string.' },
        { status: 400 }
      );
    }

    // 2. Server-Side Price Calculation
    // Securely calculate the amount to charge based on the database truth
    const amountToCharge = await calculateOrderAmount(cartItems);

    // If an item is out of stock or invalid, catch it in calculateOrderAmount
    // and return a 400 response here.
    if (amountToCharge <= 0) {
      return NextResponse.json(
        { error: 'Invalid order amount calculated. Items may be out of stock or unavailable.' },
        { status: 400 }
      );
    }

    // 3. Stripe PaymentIntent Creation using the Agentic Commerce Protocol (ACP)
    // We use the Shared Payment Token (SPT) passed by the agent as the payment_method.
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountToCharge,
      currency: 'eur',
      // Set the payment method to the Shared Payment Token provided by the agent
      payment_method: stripePaymentToken,
      // Setting confirm: true attempts to authorize and charge the token immediately
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never', // Critical for autonomous agents: they cannot follow redirects
      },
      // Provide shipping details for fraud prevention and physical delivery
      shipping: {
        name: 'AI Agent Order', // In a real app, capture the user's name
        address: {
          line1: shippingAddress.line1,
          line2: shippingAddress.line2 || undefined,
          city: shippingAddress.city,
          postal_code: shippingAddress.postal_code,
          country: shippingAddress.country,
        },
      },
      description: 'Autonomous Agent Checkout',
    });

    // 4. Machine-Readable Responses
    // If the payment succeeds, return a structured 200 OK JSON response
    if (paymentIntent.status === 'succeeded' || paymentIntent.status === 'requires_capture') {
      // Here you would normally create the Order in your database (Firestore)
      const orderId = `AGENT-ORD-${Date.now()}`; // Mock Order ID

      return NextResponse.json(
        { 
          success: true, 
          message: 'Payment successful and order created.',
          orderId: orderId,
          paymentIntentId: paymentIntent.id 
        },
        { status: 200 }
      );
    } else {
      // Handle cases where the payment requires an action the agent can't perform (e.g., 3D Secure)
      return NextResponse.json(
        { 
          error: 'Payment failed to complete immediately.', 
          details: `PaymentIntent status is ${paymentIntent.status}. Agent checkouts require immediate confirmation without redirects.`,
          status: paymentIntent.status
        },
        { status: 400 }
      );
    }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Agent Checkout Error:', error);

    // If the payment fails (e.g., the token's authorized limit is too low, or token is invalid)
    // Catch the Stripe error and return a clear, machine-readable 400-level JSON response.
    if (error.type === 'StripeCardError' || error.type === 'StripeInvalidRequestError') {
      return NextResponse.json(
        { 
          error: 'Stripe Payment Error', 
          message: error.message, 
          code: error.code,
          decline_code: error.decline_code 
        },
        { status: 400 }
      );
    }

    // Generic server error fallback
    return NextResponse.json(
      { error: 'Internal Server Error', message: error.message || 'An unexpected error occurred during checkout.' },
      { status: 500 }
    );
  }
}
