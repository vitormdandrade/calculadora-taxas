"use client";

import { useState } from "react";

type Plan = "monthly" | "yearly";

export default function PlanosPage() {
  const [loading, setLoading] = useState<Plan | null>(null);

  async function subscribe(plan: Plan) {
    setLoading(plan);
    try {
      const res = await fetch("/api/checkout/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert(data.error || "Erro ao iniciar assinatura");
    } catch {
      alert("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <>
      <section className="max-w-5xl mx-auto px-5 sm:px-8 pt-12 sm:pt-20 pb-6 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600 mb-3">
          ResolveKit Pro
        </p>
        <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-brand-950 max-w-[20ch] mx-auto leading-[1.1]">
          Todas as ferramentas. Um preço justo.
        </h1>
        <p className="mt-4 text-lg text-ink-soft max-w-[42ch] mx-auto leading-relaxed">
          Acesso ilimitado a todas as ferramentas, cálculos em lote, exportação
          de planilhas e muito mais.
        </p>
      </section>

      {/* Pricing cards */}
      <section className="max-w-4xl mx-auto px-5 sm:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
          {/* Monthly */}
          <div className="bg-white rounded-xl border border-brand-900/10 p-8 flex flex-col">
            <p className="text-sm font-semibold text-brand-600 uppercase tracking-wide">Mensal</p>
            <p className="mt-3 font-display text-5xl font-extrabold text-brand-950">
              R$19<span className="text-2xl">,90</span>
            </p>
            <p className="text-sm text-ink-faint mt-1">por mês · cancele quando quiser</p>
            <ul className="mt-6 space-y-3 text-sm text-ink-soft flex-grow">
              <li className="flex gap-2"><span className="text-brand-600 font-bold">✓</span> Todas as ferramentas ilimitadas</li>
              <li className="flex gap-2"><span className="text-brand-600 font-bold">✓</span> Cálculo em lote via CSV</li>
              <li className="flex gap-2"><span className="text-brand-600 font-bold">✓</span> Comparação lado a lado</li>
              <li className="flex gap-2"><span className="text-brand-600 font-bold">✓</span> Planilhas exportáveis</li>
              <li className="flex gap-2"><span className="text-brand-600 font-bold">✓</span> Contratos personalizados</li>
              <li className="flex gap-2"><span className="text-brand-600 font-bold">✓</span> Suporte prioritário</li>
            </ul>
            <button
              onClick={() => subscribe("monthly")}
              disabled={loading !== null}
              className="mt-8 w-full rounded-lg bg-brand-950 text-white font-bold text-base py-3.5 hover:bg-brand-800 disabled:opacity-60 transition-colors cursor-pointer"
            >
              {loading === "monthly" ? "Redirecionando..." : "Assinar Mensal"}
            </button>
          </div>

          {/* Yearly */}
          <div className="bg-brand-950 text-white rounded-xl border border-brand-800 p-8 flex flex-col relative">
            <div className="absolute -top-3 right-6 bg-brand-400 text-brand-950 text-xs font-bold px-3 py-1 rounded-full">
              Melhor valor
            </div>
            <p className="text-sm font-semibold text-brand-300 uppercase tracking-wide">Anual</p>
            <p className="mt-3 font-display text-5xl font-extrabold">
              R$149<span className="text-2xl">,90</span>
            </p>
            <p className="text-sm text-brand-200/70 mt-1">
              por ano · <span className="text-brand-300 font-semibold">R$12,49/mês</span> — 37% de desconto
            </p>
            <ul className="mt-6 space-y-3 text-sm text-brand-100/80 flex-grow">
              <li className="flex gap-2"><span className="text-brand-300 font-bold">✓</span> Tudo do plano mensal</li>
              <li className="flex gap-2"><span className="text-brand-300 font-bold">✓</span> 2 meses grátis por ano</li>
              <li className="flex gap-2"><span className="text-brand-300 font-bold">✓</span> Acesso antecipado a novas ferramentas</li>
              <li className="flex gap-2"><span className="text-brand-300 font-bold">✓</span> Cálculo em lote via CSV</li>
              <li className="flex gap-2"><span className="text-brand-300 font-bold">✓</span> Planilhas exportáveis</li>
              <li className="flex gap-2"><span className="text-brand-300 font-bold">✓</span> Suporte prioritário</li>
            </ul>
            <button
              onClick={() => subscribe("yearly")}
              disabled={loading !== null}
              className="mt-8 w-full rounded-lg bg-brand-400 text-brand-950 font-bold text-base py-3.5 hover:bg-brand-300 disabled:opacity-60 transition-colors cursor-pointer"
            >
              {loading === "yearly" ? "Redirecionando..." : "Assinar Anual"}
            </button>
          </div>
        </div>

        <p className="text-xs text-ink-faint text-center mt-6">
          Pagamento processado com segurança pela Stripe. Cancele a qualquer momento.
        </p>
      </section>
    </>
  );
}
