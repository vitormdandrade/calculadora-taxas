import { NextResponse } from "next/server";
import { getStripe, PRO_PRICE_CENTS } from "@/lib/stripe";

export async function POST(req: Request) {
  try {
    const stripe = getStripe();
    const origin =
      req.headers.get("origin") ??
      process.env.NEXT_PUBLIC_SITE_URL ??
      "https://calculataxas.com.br";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      locale: "pt-BR",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "brl",
            unit_amount: PRO_PRICE_CENTS,
            product_data: {
              name: "Modo Pro — Calculadora de Taxas",
              description:
                "Cálculo em lote via CSV, comparação entre Shopee, Mercado Livre, Amazon e Magalu, planilha de análise e ponto de equilíbrio. Pagamento único.",
            },
          },
        },
      ],
      success_url: `${origin}/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/#pro`,
      metadata: { product: "modo-pro" },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[checkout] failed to create session", err);
    return NextResponse.json(
      { error: "Não foi possível iniciar o pagamento." },
      { status: 500 }
    );
  }
}
