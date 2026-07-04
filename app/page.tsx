import Calculator from "@/components/Calculator";
import CheckoutButton from "@/components/CheckoutButton";

const FAQ = [
  {
    q: "Quanto o Shopee cobra de taxa por venda em 2026?",
    a: "O Shopee cobra comissão de 12% a 20% conforme a categoria do produto, mais uma tarifa fixa de R$4,00 por item vendido. Moda e Beleza pagam 14%; Casa e Papelaria, 16%; Eletrônicos, 12%; demais categorias, 20%.",
  },
  {
    q: "Qual é a taxa do Mercado Livre no anúncio Clássico?",
    a: "No plano Clássico, o Mercado Livre cobra comissão de 11% a 16% conforme a categoria (Tecnologia 11%, Moda 16%, demais 14%) mais R$5,00 fixos por venda. No plano Premium (R$69,99/mês) a comissão cai para 10% a 14% e a tarifa fixa por venda deixa de existir.",
  },
  {
    q: "Quanto a Amazon Brasil cobra dos vendedores?",
    a: "A Amazon cobra tarifa de indicação de 8% a 15% conforme a categoria (Eletrônicos 8%, Livros 12%, Casa 14%, demais 15%) mais R$2,50 por item vendido no plano individual.",
  },
  {
    q: "Como calcular o lucro líquido de uma venda no marketplace?",
    a: "Lucro líquido = preço de venda − comissão da plataforma − tarifa fixa − custo do produto − frete pago por você. A margem é o lucro líquido dividido pelo preço de venda. Esta calculadora faz a conta automaticamente para Shopee, Mercado Livre, Amazon e Magalu.",
  },
  {
    q: "A calculadora é realmente grátis?",
    a: "Sim. O cálculo individual é 100% grátis, sem cadastro e sem limite de uso. O Modo Pro (R$39,90, pagamento único) adiciona cálculo em lote via CSV, comparação lado a lado das 4 plataformas, planilha para download e cálculo de ponto de equilíbrio.",
  },
  {
    q: "As taxas estão atualizadas?",
    a: "As tabelas seguem as informações oficiais publicadas pelas plataformas em Julho/2026. Taxas podem variar por subcategoria, reputação do vendedor e promoções — confirme sempre no portal oficial da plataforma antes de precificar.",
  },
];

const PRO_FEATURES = [
  {
    title: "Cálculo em lote via CSV",
    desc: "Suba sua planilha com 100+ produtos e receba taxa, lucro e margem de todos de uma vez.",
  },
  {
    title: "Comparação entre as 4 plataformas",
    desc: "Veja lado a lado onde cada produto deixa mais dinheiro no seu bolso.",
  },
  {
    title: "Planilha de análise completa",
    desc: "Baixe o resultado em planilha compatível com Excel, pronta para sua gestão.",
  },
  {
    title: "Ponto de equilíbrio",
    desc: "Descubra o preço mínimo de venda para não ter prejuízo em cada plataforma.",
  },
];

export default function HomePage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* ── Hero ── */}
      <section className="max-w-5xl mx-auto px-5 sm:px-8 pt-8 sm:pt-14 pb-10">
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-brand-950 max-w-[22ch] leading-[1.08]">
          Quanto sobra de verdade em cada venda?
        </h1>
        <p className="mt-4 text-lg text-ink-soft max-w-[52ch] leading-relaxed">
          Calcule taxas, comissões e lucro real no{" "}
          <strong className="text-ink font-semibold">Shopee</strong>,{" "}
          <strong className="text-ink font-semibold">Mercado Livre</strong>,{" "}
          <strong className="text-ink font-semibold">Amazon</strong> e{" "}
          <strong className="text-ink font-semibold">Magalu</strong>. Grátis e
          sem cadastro.
        </p>
        <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-faint">
          <li>🔒 Pagamento Pro via Stripe</li>
          <li>⚡ Resultado instantâneo</li>
          <li>📊 Taxas atualizadas — Julho/2026</li>
        </ul>
      </section>

      {/* ── Calculator ── */}
      <section className="max-w-5xl mx-auto px-5 sm:px-8">
        <Calculator />
      </section>

      {/* ── Pro upsell ── */}
      <section id="pro" className="mt-24 bg-brand-950 text-white">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-16 sm:py-20">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-300 mb-3">
            Modo Pro · pagamento único
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-10 lg:gap-16 items-start">
            <div>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight max-w-[20ch] leading-[1.1]">
                Precifique o catálogo inteiro, não um produto por vez.
              </h2>
              <ul className="mt-8 space-y-5">
                {PRO_FEATURES.map((f) => (
                  <li key={f.title} className="flex gap-3">
                    <span className="text-brand-300 font-bold" aria-hidden="true">
                      →
                    </span>
                    <div>
                      <p className="font-semibold">{f.title}</p>
                      <p className="text-sm text-brand-100/70 mt-0.5">{f.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:pt-10">
              <div className="rounded-xl bg-white/[0.06] border border-white/10 p-6">
                <p className="font-display text-5xl font-extrabold tabular-nums">
                  R$39<span className="text-2xl">,90</span>
                </p>
                <p className="text-sm text-brand-100/70 mt-1 mb-6">
                  Uma vez só. Sem mensalidade, sem assinatura.
                </p>
                <CheckoutButton className="w-full rounded-lg bg-brand-400 hover:bg-brand-300 disabled:opacity-60 text-brand-950 font-bold text-base py-3.5 transition-colors">
                  Liberar o Modo Pro
                </CheckoutButton>
                <p className="text-xs text-brand-100/50 mt-3 text-center">
                  Pagamento processado pela Stripe.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="max-w-3xl mx-auto px-5 sm:px-8 mt-24">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-brand-950 mb-8">
          Perguntas frequentes
        </h2>
        <div className="space-y-3">
          {FAQ.map(({ q, a }) => (
            <details
              key={q}
              className="group bg-white rounded-lg border border-brand-900/10 open:border-brand-600/40 transition-colors"
            >
              <summary className="cursor-pointer list-none px-5 py-4 font-semibold text-ink flex justify-between items-center gap-4">
                {q}
                <span className="text-brand-600 transition-transform group-open:rotate-45 text-xl leading-none" aria-hidden="true">
                  +
                </span>
              </summary>
              <p className="px-5 pb-5 text-[15px] leading-relaxed text-ink-soft">
                {a}
              </p>
            </details>
          ))}
        </div>
        <p className="mt-8 text-xs text-ink-faint leading-relaxed">
          Taxas atualizadas conforme informações oficiais em Julho/2026.
          Confirme os valores no portal da plataforma. Comissões podem variar
          por subcategoria, programa de frete e reputação da conta.
        </p>
      </section>
    </>
  );
}
