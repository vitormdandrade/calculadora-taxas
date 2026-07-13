"use client";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { type ReactNode, useMemo } from "react";

// Public key — safe to expose on client
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
    "pk_live_51S6V266fRX9lw0KZgQ1fIYJVcm3hC3CzsviO7mZgf5lOL6jCvvC2ERbDEdfEe63N9XTswEKvIDAE16U3BiBNm7BO00LZMejdoZ"
);

export default function StripeProvider({ children }: { children: ReactNode }) {
  // Only wrap with Elements when we actually have a client secret
  // The provider is always mounted; individual EmbeddedCheckout components
  // handle their own Elements wrapper when they have a client secret.
  return <>{children}</>;
}

// Re-export stripePromise for use in EmbeddedCheckout
export { stripePromise };
