import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";

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

  switch (event.type) {
    // ── One-time purchases (Modo Pro R$39,90) ──
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const mode = session.mode;
      const product = session.metadata?.product;

      if (mode === "subscription") {
        console.log(
          `[webhook] Subscription started: session=${session.id} plan=${session.metadata?.plan} customer=${session.customer}`
        );
      } else if (mode === "payment") {
        console.log(
          `[webhook] One-time purchase: session=${session.id} amount=${session.amount_total} ${session.currency} product=${product}`
        );
      }
      break;
    }

    // ── Subscription lifecycle ──
    case "customer.subscription.created": {
      const sub = event.data.object as Stripe.Subscription;
      console.log(
        `[webhook] Subscription created: sub=${sub.id} customer=${sub.customer} plan=${sub.metadata?.plan}`
      );
      break;
    }

    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      console.log(
        `[webhook] Subscription updated: sub=${sub.id} status=${sub.status}`
      );
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      console.log(
        `[webhook] Subscription cancelled: sub=${sub.id} customer=${sub.customer}`
      );
      break;
    }

    // ── Payment events for subscriptions ──
    case "invoice.paid": {
      const invoice = event.data.object as Stripe.Invoice;
      console.log(
        `[webhook] Invoice paid: invoice=${invoice.id} amount=${invoice.amount_paid} subscription=${invoice.subscription}`
      );
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      console.log(
        `[webhook] Invoice payment failed: invoice=${invoice.id} subscription=${invoice.subscription}`
      );
      break;
    }
  }

  return NextResponse.json({ received: true });
}
