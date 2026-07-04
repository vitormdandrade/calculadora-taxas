import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";

// Stripe requires the raw request body to verify the signature.
export async function POST(req: Request) {
  const signature = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !secret) {
    return NextResponse.json(
      { error: "Missing webhook signature or secret" },
      { status: 400 }
    );
  }

  const payload = await req.text();

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(payload, signature, secret);
  } catch (err) {
    console.error("[webhook] signature verification failed", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    // Pro access is stateless: /pro re-verifies the session id against Stripe
    // on every visit, so there is no database to update here. The event is
    // logged for reconciliation.
    console.log(
      `[webhook] Modo Pro purchase completed: session=${session.id} amount=${session.amount_total} ${session.currency}`
    );
  }

  return NextResponse.json({ received: true });
}
