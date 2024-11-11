// app/api/checkout_sessions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-10-28.acacia',
});

export async function POST(request: NextRequest) {
  const { priceId } = await request.json();

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/business/dashboard/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/business/dashboard/cancel`,

    });

    return NextResponse.json({ id: session.id });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: { message: err.message } }, { status: 500 });
    }
    return NextResponse.json(
      { error: { message: 'An unknown error occurred' } },
      { status: 500 }
    );
  }
}
