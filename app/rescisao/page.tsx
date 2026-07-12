import type { Metadata } from "next";
import RescisaoCalculator from "@/components/RescisaoCalculator";
import DisclaimerBanner from "@/components/DisclaimerBanner";

export const metadata: Metadata = {
  title: "Calculadora de Rescisão Trabalhista 2026 — ResolveKit",
  description:
    "Calcule suas verbas rescisórias grátis: saldo de salário, aviso prévio, 13º proporcional, férias + 1/3 e multa de 40% do FGTS. Estimativa baseada na CLT.",
  alternates: { canonical: "/rescisao" },
  openGraph: {
    title: "Calculadora de Rescisão Trabalhista 2026 — ResolveKit",
    description:
      "Calcule aviso prévio, 13º, férias e multa do FGTS em segundos. Grátis e sem cadastro.",
    url: "https://resolvekit.com.br/rescisao",
  },
};

const FAQ = [
  {
    q: "Quais direitos tenho na demissão sem justa causa?",
    a: "Saldo de salário, aviso prévio (trabalhado ou indenizado), 13º proporcional, férias vencidas e proporcionais + 1/3, saque do FGTS e multa de 40% sobre o saldo do FGTS.",
  },
  {
    q: "Como é calculado o aviso prévio?",
    a: "30 dias + 3 dias por ano completo trabalhado, com limite de 90 dias (Lei 12.506/2011). O aviso indenizado é devido apenas na demissão sem justa causa.",
  },
  {
    q: "E se eu pedir demissão?",
    a: "Você recebe saldo de salário, 13º proporcional e férias (vencidas e proporcionais) + 1/3. Não há multa de 40% do FGTS nem aviso prévio indenizado — e o FGTS não pode ser sacado.",
  },
  {
    q: "O que perco na demissão por justa causa?",
    a: "Na justa causa você recebe apenas o saldo de salário e eventuais férias vencidas + 1/3. Perde 13º proporcional, férias proporcionais, aviso prévio e multa do FGTS.",
  },
  {
    q: "Os valores da calculadora são exatos?",
    a: "Não — são estimativas baseadas na CLT. Convenções coletivas, adicionais (insalubridade, periculosidade, horas extras) e particularidades do contrato alteram os valores. Confira o TRCT com um advogado ou contador.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

const softwareJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Calculadora de Rescisão Trabalhista — ResolveKit",
  url: "https://resolvekit.com.br/rescisao",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  inLanguage: "pt-BR",
  description:
    "Calculadora educacional de verbas rescisórias: aviso prévio, 13º proporcional, férias + 1/3 e multa de 40% do FGTS, conforme a CLT.",
  offers: [
    { "@type": "Offer", price: "0", priceCurrency: "BRL", name: "Cálculo online" },
    { "@type": "Offer", price: "14.90", priceCurrency: "BRL", name: "Relatório PDF completo" },
  ],
  publisher: { "@type": "Organization", name: "ResolveKit", url: "https://resolvekit.com.br" },
};

export default function RescisaoPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
      />

      <section className="max-w-5xl mx-auto px-5 sm:px-8 pt-8 sm:pt-14 pb-10">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600 mb-3">
          Rescisão Trabalhista
        </p>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-brand-950 max-w-[22ch] leading-[1.08]">
          Quanto você tem para receber na rescisão?
        </h1>
        <p className="mt-4 text-lg text-ink-soft max-w-[52ch] leading-relaxed">
          Calcule <strong className="text-ink font-semibold">aviso prévio</strong>,{" "}
          <strong className="text-ink font-semibold">13º proporcional</strong>,{" "}
          <strong className="text-ink font-semibold">férias + 1/3</strong> e a{" "}
          <strong className="text-ink font-semibold">multa de 40% do FGTS</strong>{" "}
          em segundos. Grátis e sem cadastro.
        </p>
      </section>

      <section className="max-w-5xl mx-auto px-5 sm:px-8">
        <div className="mb-8">
          <DisclaimerBanner
            product="Calculadora de Rescisão"
            variant="financial"
            riskLevel="high"
          >
            Esta calculadora fornece estimativas baseadas na CLT. Os valores
            reais podem variar conforme convenção coletiva, adicionais e
            particularidades do caso. Não substitui a consulta com um advogado
            ou contador.
          </DisclaimerBanner>
        </div>
        <RescisaoCalculator />
        <p className="mt-8 text-xs text-ink-faint leading-relaxed max-w-[70ch]">
          Cálculos baseados na CLT (Consolidação das Leis do Trabalho).
          Convenções coletivas da categoria podem alterar os valores.
        </p>
      </section>

      <section className="max-w-3xl mx-auto px-5 sm:px-8 mt-24 mb-16">
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
                <span
                  className="text-brand-600 transition-transform group-open:rotate-45 text-xl leading-none"
                  aria-hidden="true"
                >
                  +
                </span>
              </summary>
              <p className="px-5 pb-5 text-[15px] leading-relaxed text-ink-soft">{a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
