import { NextResponse } from "next/server";
import {
  getStripe,
  PRO_PRICE_CENTS,
  RESCISAO_PDF_PRICE_CENTS,
} from "@/lib/stripe";

interface CheckoutBody {
  product?: string;
  embedded?: boolean;
  amount?: number; // optional override for payment intent amount
}

export async function POST(req: Request) {
  try {
    const stripe = getStripe();
    const origin =
      req.headers.get("origin") ??
      process.env.NEXT_PUBLIC_SITE_URL ??
      "https://resolvekit.com.br";

    let body: CheckoutBody = {};
    try {
      body = await req.json();
    } catch {
      // no JSON body — defaults to Modo Pro
    }

    const isRescisao = body.product === "rescisao-pdf";
    const unitAmount = isRescisao ? RESCISAO_PDF_PRICE_CENTS : body.amount ?? PRO_PRICE_CENTS;
    const productName = isRescisao
      ? "Relatório PDF — Rescisão Trabalhista"
      : "Modo Pro — Calculadora de Taxas";
    const productDesc = isRescisao
      ? "Relatório completo com memória de cálculo das verbas rescisórias, direitos detalhados e orientações. Estimativa educacional baseada na CLT."
      : "Cálculo em lote via CSV, comparação entre Shopee, Mercado Livre, Amazon e Magalu, planilha de análise e ponto de equilíbrio. Pagamento único.";

    const metadata: Record<string, string> = {
      product: isRescisao ? "rescisao-pdf" : "modo-pro",
    };

    // ── Embedded mode: return PaymentIntent clientSecret ──
    if (body.embedded) {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: unitAmount,
        currency: "brl",
        metadata,
        description: `${productName} — ${productDesc}`,
      });

      return NextResponse.json({
        clientSecret: paymentIntent.client_secret,
        amount: unitAmount,
        product: isRescisao ? "rescisao-pdf" : "modo-pro",
      });
    }

    // ── Redirect mode (legacy): return Stripe Checkout URL ──
    const cancelUrl = isRescisao ? `${origin}/rescisao` : `${origin}/marketplace`;
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      locale: "pt-BR",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "brl",
            unit_amount: unitAmount,
            product_data: {
              name: productName,
              description: productDesc,
            },
          },
        },
      ],
      success_url: `${origin}/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      metadata,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[checkout] failed", err);
    return NextResponse.json(
      { error: "Não foi possível iniciar o pagamento." },
      { status: 500 }
    );
  }
}
