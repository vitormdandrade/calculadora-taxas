"use client";

import { useState } from "react";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { stripePromise } from "./StripeProvider";

interface EmbeddedCheckoutProps {
  clientSecret: string;
  productLabel: string;
  amount: number; // in cents
  onSuccess?: () => void;
  onCancel?: () => void;
  consentLabel?: string;
}

function formatBRL(cents: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

function CheckoutForm({
  productLabel,
  amount,
  onSuccess,
  onCancel,
  consentLabel,
}: Omit<EmbeddedCheckoutProps, "clientSecret">) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [consented, setConsented] = useState(!consentLabel);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message || "Erro ao validar pagamento.");
      setLoading(false);
      return;
    }

    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + "/sucesso",
      },
      redirect: "if_required",
    });

    if (confirmError) {
      setError(confirmError.message || "Pagamento recusado. Tente outro cartão.");
      setLoading(false);
    } else {
      onSuccess?.();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Resumo */}
      <div className="rounded-lg bg-brand-950/5 border border-brand-900/10 p-4">
        <p className="text-sm font-semibold text-brand-950">{productLabel}</p>
        <p className="text-2xl font-extrabold text-brand-950 mt-1 tabular-nums">
          {formatBRL(amount)}
        </p>
      </div>

      {/* Stripe Payment Element */}
      <PaymentElement
        options={{
          layout: "tabs",
          defaultValues: {
            billingDetails: { address: { country: "BR" } },
          },
        }}
      />

      {/* Consent */}
      {consentLabel ? (
        <label className="flex items-start gap-3 cursor-pointer select-none rounded-lg bg-slate-50 border border-slate-200 hover:border-slate-300 px-4 py-3 transition-colors">
          <input
            type="checkbox"
            checked={consented}
            onChange={(e) => setConsented(e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-brand-700 flex-shrink-0"
          />
          <span className="text-xs leading-relaxed text-slate-700">
            {consentLabel}
          </span>
        </label>
      ) : null}

      {/* Error */}
      {error ? (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {/* Buttons */}
      <div className="flex gap-3">
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-3 px-4 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
        ) : null}
        <button
          type="submit"
          disabled={!stripe || loading || !consented}
          className="flex-1 py-3 px-4 rounded-lg bg-brand-950 text-white font-bold hover:bg-brand-800 disabled:opacity-50 transition-colors"
        >
          {loading ? "Processando…" : `Pagar ${formatBRL(amount)}`}
        </button>
      </div>

      <p className="text-xs text-slate-400 text-center">
        🔒 Pagamento seguro via Stripe · Seus dados são criptografados
      </p>
    </form>
  );
}

export default function EmbeddedCheckout(props: EmbeddedCheckoutProps) {
  if (!props.clientSecret) {
    return (
      <div className="p-4 text-center text-slate-500 text-sm">
        Inicializando pagamento…
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret: props.clientSecret }}>
      <CheckoutForm {...props} />
    </Elements>
  );
}
