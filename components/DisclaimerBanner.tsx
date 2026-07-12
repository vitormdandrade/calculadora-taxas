export type DisclaimerVariant = "legal" | "financial" | "educational";
export type RiskLevel = "high" | "medium" | "low";

const DEFAULT_TEXT: Record<DisclaimerVariant, (product: string) => string> = {
  legal: (product) =>
    `${product} gera modelos de documentos — não é um escritório de advocacia e não fornece assessoria jurídica. Nenhuma relação advogado-cliente é criada. Para situações complexas, consulte um advogado. Modelos baseados na legislação brasileira; requisitos estaduais e municipais podem variar.`,
  financial: (product) =>
    `${product} é uma ferramenta educacional de cálculo — não constitui aconselhamento financeiro, contábil ou de investimento. Confirme os valores com um profissional qualificado antes de tomar decisões.`,
  educational: (product) =>
    `${product} é uma ferramenta educacional. As informações exibidas são baseadas em dados públicos e podem variar. Confirme os valores nas fontes oficiais.`,
};

export default function DisclaimerBanner({
  product,
  variant = "educational",
  riskLevel = "low",
  children,
}: {
  product: string;
  variant?: DisclaimerVariant;
  riskLevel?: RiskLevel;
  children?: React.ReactNode;
}) {
  return (
    <div
      role="note"
      aria-label={`Aviso legal — ${product}`}
      className={`rounded-lg bg-amber-50 border border-amber-300 px-4 py-3 text-sm leading-relaxed text-amber-800 ${
        riskLevel === "high" ? "border-l-4" : ""
      }`}
    >
      <span aria-hidden="true" className="mr-1.5">
        ⚠️
      </span>
      {children ?? DEFAULT_TEXT[variant](product)}{" "}
      <a
        href="/termos"
        className="font-semibold underline underline-offset-2 text-amber-900 hover:text-amber-950"
      >
        Termos de Serviço
      </a>
    </div>
  );
}
