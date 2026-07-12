const DEFAULT_THRESHOLD = 20_000;

function formatThreshold(value: number) {
  return `R$${value.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}`;
}

export default function LegalWarningBR({
  value,
  label = "transação",
  threshold = DEFAULT_THRESHOLD,
}: {
  /** Monitored amount in BRL; the warning renders only above the threshold */
  value: number;
  label?: string;
  threshold?: number;
}) {
  if (!Number.isFinite(value) || Math.abs(value) < threshold) return null;

  return (
    <div
      role="alert"
      className="rounded-lg bg-amber-50 border border-amber-300 px-4 py-3 text-sm leading-relaxed text-amber-800"
    >
      <p>
        <span aria-hidden="true" className="mr-1.5">
          ⚠️
        </span>
        Este valor de {label} excede {formatThreshold(threshold)}. Recomendamos
        consultar um advogado ou contador antes de tomar decisões com base
        neste cálculo. Esta ferramenta é educacional e não substitui
        aconselhamento profissional.
      </p>
      <a
        href="/termos"
        className="inline-block mt-1.5 font-semibold underline underline-offset-2 text-amber-900 hover:text-amber-950"
      >
        Leia os Termos de Serviço →
      </a>
    </div>
  );
}
