import { getStripe } from "@/lib/stripe";

/**
 * Stateless Pro access: a checkout session id doubles as the access token.
 * We re-verify it against Stripe on every request — no database needed.
 */
export async function isSessionPaid(
  sessionId: string | undefined
): Promise<boolean> {
  if (!sessionId || !process.env.STRIPE_SECRET_KEY) return false;
  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId);
    return session.payment_status === "paid";
  } catch {
    return false;
  }
}
