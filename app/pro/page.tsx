import type { Metadata } from "next";
import ProTools from "@/components/ProTools";
import { isSessionPaid } from "@/lib/pro";

export const metadata: Metadata = {
  title: "Modo Pro — Calculadora de Taxas",
  robots: { index: false },
};

export default async function ProPage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  const paid = await isSessionPaid(searchParams.session_id);

  if (!paid) {
    return (
      <div className="max-w-xl mx-auto px-5 sm:px-8 py-20 text-center">
        <p className="text-5xl mb-6" aria-hidden="true">
          🔒
        </p>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-brand-950 mb-3">
          Modo Pro
        </h1>
        <p className="text-ink-soft leading-relaxed mb-8">
          Esta área é liberada após o pagamento único de R$39,90. Se você já
          pagou, use o link da página de confirmação (ele contém o seu código
          de acesso).
        </p>
        <a
          href="/#pro"
          className="inline-block rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-bold px-8 py-3.5 no-underline transition-colors"
        >
          Conhecer o Modo Pro
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-8 py-12">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600 mb-2">
        Modo Pro
      </p>
      <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-brand-950 mb-10">
        Seu catálogo, todas as plataformas.
      </h1>
      <ProTools />
    </div>
  );
}
