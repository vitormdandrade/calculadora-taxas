import Link from "next/link";
import ToolsHub from "@/components/ToolsHub";

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "ResolveKit",
  url: "https://resolvekit.com.br",
  description:
    "Ferramentas digitais para MEIs, autônomos e pequenos empreendedores brasileiros: calculadoras, geradores de modelos de documentos e consultas.",
  email: "contato@resolvekit.com.br",
  areaServed: "BR",
  knowsLanguage: "pt-BR",
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      {/* Hero */}
      <section className="max-w-5xl mx-auto px-5 sm:px-8 pt-12 sm:pt-20 pb-10 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600 mb-4">
          ResolveKit
        </p>
        <h1 className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight text-brand-950 max-w-[20ch] mx-auto leading-[1.08]">
          Resolva sua burocracia em minutos
        </h1>
        <p className="mt-5 text-lg text-ink-soft max-w-[44ch] mx-auto leading-relaxed">
          Calculadoras, geradores de contratos, cartas de cobrança e consultas.
          Tudo o que o MEI e autônomo precisa — grátis ou com preço justo.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/marketplace"
            className="inline-flex items-center px-6 py-3 rounded-lg bg-brand-950 text-white font-semibold text-sm hover:bg-brand-800 transition-colors no-underline"
          >
            🧮 Começar com a Calculadora
          </Link>
          <Link
            href="/planos"
            className="inline-flex items-center px-6 py-3 rounded-lg border border-brand-900/15 text-brand-700 font-semibold text-sm hover:border-brand-600 hover:text-brand-900 transition-colors no-underline"
          >
            Ver Planos Pro →
          </Link>
        </div>
      </section>

      {/* Tools Grid */}
      <ToolsHub />

      {/* Trust bar */}
      <section className="max-w-3xl mx-auto px-5 sm:px-8 pb-16 sm:pb-20">
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-ink-faint">
          <span>🔒 Pagamento via Stripe</span>
          <span>⚡ Acesso instantâneo</span>
          <span>📊 Dados atualizados</span>
          <span>🇧🇷 Feito para o Brasil</span>
        </div>
      </section>
    </>
  );
}
