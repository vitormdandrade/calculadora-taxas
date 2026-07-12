import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

const PRICE_IDS: Record<string, string> = {
  monthly: process.env.STRIPE_PRO_MONTHLY_PRICE_ID || "",
  yearly: process.env.STRIPE_PRO_YEARLY_PRICE_ID || "",
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const plan = (body.plan || "monthly") as "monthly" | "yearly";
    const priceId = PRICE_IDS[plan];

    if (!priceId) {
      return NextResponse.json(
        { error: `Plano "${plan}" não configurado.` },
        { status: 400 }
      );
    }

    const stripe = getStripe();
    const origin =
      req.headers.get("origin") ??
      process.env.NEXT_PUBLIC_SITE_URL ??
      "https://resolvekit.com.br";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      locale: "pt-BR",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/planos`,
      metadata: { product: "resolvekit-pro", plan },
      subscription_data: {
        metadata: { product: "resolvekit-pro", plan },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[checkout/subscription] failed", err);
    return NextResponse.json(
      { error: "Não foi possível iniciar a assinatura." },
      { status: 500 }
    );
  }
}
