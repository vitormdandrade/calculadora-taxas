import Link from "next/link";

export type ToolRisk = "educational" | "simulation" | "legal";

export interface Tool {
  slug: string;
  name: string;
  tagline: string;
  price: string;
  icon: string;
  href: string;
  external?: boolean;
  risk: ToolRisk;
}

const RISK_BADGE: Record<ToolRisk, { label: string; className: string }> = {
  educational: {
    label: "🟢 Educacional",
    className: "bg-brand-50 text-brand-800 border-brand-200",
  },
  simulation: {
    label: "🟡 Simulação",
    className: "bg-amber-50 text-amber-800 border-amber-200",
  },
  legal: {
    label: "🔴 Documento Legal",
    className: "bg-red-50 text-red-800 border-red-200",
  },
};

export default function ToolCard({ tool }: { tool: Tool }) {
  const Wrapper = tool.external ? "a" : Link;
  const wrapperProps = tool.external
    ? { href: tool.href, target: "_blank", rel: "noopener" }
    : { href: tool.href };

  return (
    <Wrapper
      {...wrapperProps}
      className="group block bg-white rounded-xl border border-brand-900/10 hover:border-brand-600/30 hover:shadow-lg hover:shadow-brand-950/[0.04] transition-all duration-200 p-5 no-underline"
    >
      <div className="flex items-start gap-3 mb-3">
        <span className="text-2xl flex-shrink-0">{tool.icon}</span>
        <div className="min-w-0">
          <h3 className="font-display font-bold text-brand-950 group-hover:text-brand-700 transition-colors leading-tight">
            {tool.name}
          </h3>
          <p className="text-sm text-ink-soft mt-0.5 line-clamp-2 leading-relaxed">
            {tool.tagline}
          </p>
        </div>
      </div>
      <span
        className={`inline-block text-[11px] font-semibold rounded-full border px-2.5 py-0.5 ${RISK_BADGE[tool.risk].className}`}
      >
        {RISK_BADGE[tool.risk].label}
      </span>
      <div className="flex items-center justify-between mt-2 pt-3 border-t border-brand-900/5">
        <span className="text-sm font-semibold text-brand-600">{tool.price}</span>
        <span className="text-xs text-ink-faint group-hover:text-brand-600 transition-colors">
          {tool.external ? "Abrir ↗" : "Usar →"}
        </span>
      </div>
    </Wrapper>
  );
}
