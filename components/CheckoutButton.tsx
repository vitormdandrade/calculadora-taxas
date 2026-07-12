"use client";

import { useId, useState } from "react";

export default function CheckoutButton({
  children,
  className,
  consentLabel,
}: {
  children: React.ReactNode;
  className?: string;
  /** When set, renders a mandatory consent checkbox that gates the button */
  consentLabel?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [consented, setConsented] = useState(false);
  const consentId = useId();

  const requiresConsent = Boolean(consentLabel);

  async function startCheckout() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || "Falha ao criar o pagamento");
      }
      window.location.href = data.url;
    } catch {
      setError("Não foi possível abrir o pagamento. Tente novamente.");
      setLoading(false);
    }
  }

  return (
    <div>
      {requiresConsent ? (
        <label
          htmlFor={consentId}
          className="flex items-start gap-3 mb-4 cursor-pointer select-none rounded-lg bg-slate-50 border border-slate-200 hover:border-slate-300 px-4 py-3 transition-colors"
        >
          <input
            id={consentId}
            type="checkbox"
            checked={consented}
            onChange={(e) => setConsented(e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-teal-700 flex-shrink-0"
          />
          <span className="text-xs leading-relaxed text-slate-700">
            {consentLabel}
          </span>
        </label>
      ) : null}
      <button
        type="button"
        onClick={startCheckout}
        disabled={loading || (requiresConsent && !consented)}
        className={className}
      >
        {loading ? "Abrindo pagamento…" : children}
      </button>
      {error ? (
        <p className="mt-2 text-sm text-red-200" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
