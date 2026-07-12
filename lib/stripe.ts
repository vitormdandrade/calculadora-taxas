import Stripe from "stripe";

// IMPORTANT: never instantiate Stripe at module scope.
// Construct it lazily at request time so the secret key is read from the
// environment when the handler actually runs, not when the module is loaded.
export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }
  return new Stripe(key, {
    // Use account's default API version
  });
}

// Modo Pro one-time price in cents (R$39,90)
export const PRO_PRICE_CENTS = 3990;
export const PRO_PRICE_LABEL = "R$39,90";

// Rescisão PDF one-time price in cents (R$14,90)
export const RESCISAO_PDF_PRICE_CENTS = 1490;
export const RESCISAO_PDF_PRICE_LABEL = "R$14,90";
