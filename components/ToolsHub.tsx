import ToolCard, { type Tool } from "./ToolCard";

const TOOLS: Tool[] = [
  {
    slug: "taxas",
    name: "Calculadora de Taxas",
    tagline:
      "Taxas e lucro real no Shopee, Mercado Livre, Amazon e Magalu.",
    price: "Grátis · Pro R$39,90",
    icon: "🧮",
    href: "/marketplace",
  },
  {
    slug: "rescisao",
    name: "Rescisão Trabalhista",
    tagline:
      "Calcule verbas rescisórias: aviso prévio, 13º, férias, multa FGTS e mais.",
    price: "PDF R$14,90",
    icon: "📋",
    href: "https://mc-rescisao-trabalhista.vercel.app",
    external: true,
  },
  {
    slug: "cobranca",
    name: "Carta de Cobrança",
    tagline:
      "Gere cartas de cobrança profissionais para MEIs. Personalize e envie.",
    price: "R$9,90",
    icon: "💰",
    href: "https://mc-carta-cobranca.vercel.app",
    external: true,
  },
  {
    slug: "cnpj",
    name: "CNPJ Radar",
    tagline:
      "Consulte qualquer CNPJ: situação cadastral, sócios, protestos e mais.",
    price: "R$4,90",
    icon: "🔍",
    href: "https://mc-cnpj-radar.vercel.app",
    external: true,
  },
  {
    slug: "financiamento",
    name: "Simulador de Financiamento",
    tagline:
      "Simule parcelas, CET e entrada para financiar seu imóvel. Comparador de taxas.",
    price: "Grátis",
    icon: "🏠",
    href: "https://mc-simulador-financiamento.vercel.app",
    external: true,
  },
  {
    slug: "contrato-aluguel",
    name: "Contrato de Aluguel",
    tagline:
      "Gere contratos de locação residencial personalizados em minutos.",
    price: "Grátis",
    icon: "📝",
    href: "https://mc-contrato-de-aluguel.vercel.app",
    external: true,
  },
  {
    slug: "contrato-freela",
    name: "Contrato para Freela",
    tagline:
      "Contrato de prestação de serviço profissional. Cláusulas prontas.",
    price: "Grátis",
    icon: "🤝",
    href: "https://contrato-certo.vercel.app",
    external: true,
  },
];

export default function ToolsHub() {
  return (
    <section className="max-w-5xl mx-auto px-5 sm:px-8 py-16 sm:py-20">
      <div className="text-center mb-10">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600 mb-3">
          ResolveKit
        </p>
        <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-brand-950 max-w-[24ch] mx-auto leading-[1.15]">
          Todas as ferramentas para resolver sua vida
        </h2>
        <p className="mt-3 text-ink-soft max-w-[48ch] mx-auto leading-relaxed">
          Calculadoras, geradores de documentos e consultas — tudo em um só
          lugar. Escolha a ferramenta e resolva agora.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {TOOLS.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>

      <div className="mt-10 text-center">
        <p className="text-sm text-ink-faint">
          Também visite nossos sites de comparação:{" "}
          <a
            href="https://oraculodomei.com.br"
            className="text-brand-600 hover:text-brand-800 underline underline-offset-2"
            target="_blank"
            rel="noopener"
          >
            Oráculo do MEI
          </a>
          ,{" "}
          <a
            href="https://compararsaas.com.br"
            className="text-brand-600 hover:text-brand-800 underline underline-offset-2"
            target="_blank"
            rel="noopener"
          >
            Comparar SaaS
          </a>
          ,{" "}
          <a
            href="https://calculaseguro.com.br"
            className="text-brand-600 hover:text-brand-800 underline underline-offset-2"
            target="_blank"
            rel="noopener"
          >
            Calcula Seguro
          </a>
        </p>
      </div>
    </section>
  );
}
