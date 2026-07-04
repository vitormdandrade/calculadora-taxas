"use client";

import { useMemo, useState } from "react";
import {
  PLATFORMS,
  DEFAULT_CATEGORY,
  calculateFees,
  breakevenPrice,
  formatBRL,
  formatPercent,
  type CalcResult,
  type PlatformId,
} from "@/lib/fees";
import { parseCsv, parseBRLNumber, toExcelCsv, type CsvProduct } from "@/lib/csv";

interface ProductRow {
  product: CsvProduct;
  results: Record<PlatformId, CalcResult>;
  best: PlatformId;
}

function computeRows(products: CsvProduct[], mlPremium: boolean): ProductRow[] {
  return products.map((product) => {
    const results = {} as Record<PlatformId, CalcResult>;
    for (const p of PLATFORMS) {
      const category =
        product.categoria && product.categoria in p.categories
          ? product.categoria
          : DEFAULT_CATEGORY;
      results[p.id] = calculateFees({
        platform: p.id,
        category,
        price: product.preco,
        cost: product.custo,
        shipping: product.frete,
        premiumPlan: mlPremium,
      });
    }
    const best = PLATFORMS.reduce((acc, p) =>
      results[p.id].netProfit > results[acc.id].netProfit ? p : acc
    ).id;
    return { product, results, best };
  });
}

function downloadPlanilha(rows: ProductRow[]) {
  const headers = [
    "Produto",
    "Preço de venda (R$)",
    "Custo (R$)",
    "Frete (R$)",
    ...PLATFORMS.flatMap((p) => [
      `${p.name} — Taxa total (R$)`,
      `${p.name} — Lucro líquido (R$)`,
      `${p.name} — Margem (%)`,
    ]),
    "Melhor plataforma",
  ];
  const body = rows.map(({ product, results, best }) => [
    product.nome,
    product.preco,
    product.custo,
    product.frete,
    ...PLATFORMS.flatMap((p) => {
      const r = results[p.id];
      return [r.platformFee + r.fixedFee, r.netProfit, r.margin];
    }),
    PLATFORMS.find((p) => p.id === best)!.name,
  ]);
  const csv = toExcelCsv(headers, body);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "analise-taxas-marketplaces.csv";
  a.click();
  URL.revokeObjectURL(url);
}

// ── Breakeven calculator ──

function Breakeven() {
  const [cost, setCost] = useState("");
  const [shipping, setShipping] = useState("");
  const costNum = parseBRLNumber(cost);
  const shippingNum = parseBRLNumber(shipping);
  const valid = Number.isFinite(costNum) && costNum > 0;

  return (
    <section className="mt-16">
      <h2 className="font-display text-2xl font-extrabold tracking-tight text-brand-950 mb-2">
        Ponto de equilíbrio
      </h2>
      <p className="text-sm text-ink-soft mb-6 max-w-[60ch]">
        O preço mínimo de venda para sair no zero a zero em cada plataforma
        (categoria padrão), já contando comissão e tarifa fixa.
      </p>
      <div className="grid grid-cols-2 gap-4 max-w-md mb-6">
        <div>
          <label htmlFor="be-custo" className="block text-sm font-semibold mb-1.5">
            Custo do produto (R$)
          </label>
          <input
            id="be-custo"
            type="text"
            inputMode="decimal"
            placeholder="45,00"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            className="w-full rounded-lg border border-brand-900/15 bg-white px-3.5 py-2.5 tabular-nums focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
        <div>
          <label htmlFor="be-frete" className="block text-sm font-semibold mb-1.5">
            Frete (R$)
          </label>
          <input
            id="be-frete"
            type="text"
            inputMode="decimal"
            placeholder="0,00"
            value={shipping}
            onChange={(e) => setShipping(e.target.value)}
            className="w-full rounded-lg border border-brand-900/15 bg-white px-3.5 py-2.5 tabular-nums focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>
      {valid ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {PLATFORMS.map((p) => {
            const be = breakevenPrice(
              p.id,
              DEFAULT_CATEGORY,
              costNum,
              Number.isFinite(shippingNum) ? shippingNum : 0
            );
            return (
              <div
                key={p.id}
                className="bg-white rounded-lg border border-brand-900/10 px-4 py-3"
              >
                <p className="text-xs text-ink-faint mb-1">{p.name}</p>
                <p className="font-display font-bold tabular-nums text-brand-800">
                  {formatBRL(be)}
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-ink-faint">
          Informe o custo do produto para calcular.
        </p>
      )}
    </section>
  );
}

// ── Main Pro tools ──

export default function ProTools() {
  const [products, setProducts] = useState<CsvProduct[]>([]);
  const [skipped, setSkipped] = useState<number[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [mlPremium, setMlPremium] = useState(false);

  const rows = useMemo(() => computeRows(products, mlPremium), [products, mlPremium]);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setParseError(null);
    try {
      const text = await file.text();
      const { products: parsed, skippedLines } = parseCsv(text);
      if (parsed.length === 0) {
        setParseError(
          "Nenhum produto válido encontrado. O arquivo precisa de colunas de preço e custo (ex.: nome;preco;custo;frete;categoria)."
        );
        return;
      }
      setProducts(parsed);
      setSkipped(skippedLines);
      setFileName(file.name);
    } catch {
      setParseError("Não foi possível ler o arquivo. Envie um CSV válido.");
    }
  }

  return (
    <div>
      {/* Upload */}
      <section>
        <h2 className="font-display text-2xl font-extrabold tracking-tight text-brand-950 mb-2">
          Cálculo em lote
        </h2>
        <p className="text-sm text-ink-soft mb-6 max-w-[62ch]">
          Envie um CSV com as colunas <code className="bg-brand-100 px-1 rounded">nome</code>,{" "}
          <code className="bg-brand-100 px-1 rounded">preco</code>,{" "}
          <code className="bg-brand-100 px-1 rounded">custo</code> e, se quiser,{" "}
          <code className="bg-brand-100 px-1 rounded">frete</code> e{" "}
          <code className="bg-brand-100 px-1 rounded">categoria</code>. Tudo é
          processado no seu navegador — o arquivo não é enviado a nenhum
          servidor.
        </p>

        <label className="block cursor-pointer rounded-xl border-2 border-dashed border-brand-600/40 bg-brand-50 hover:bg-brand-100 transition-colors px-6 py-10 text-center">
          <input
            type="file"
            accept=".csv,text/csv"
            className="sr-only"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <span className="block font-semibold text-brand-800">
            {fileName ? `📄 ${fileName}` : "Clique para escolher o arquivo CSV"}
          </span>
          <span className="block text-xs text-ink-faint mt-1">
            {fileName
              ? "Clique de novo para trocar o arquivo"
              : "Separado por ; ou , — decimais com vírgula funcionam"}
          </span>
        </label>

        {parseError ? (
          <p className="mt-3 text-sm text-red-700" role="alert">
            {parseError}
          </p>
        ) : null}
        {skipped.length > 0 ? (
          <p className="mt-3 text-xs text-ink-faint">
            {skipped.length} linha(s) ignorada(s) por não ter preço válido:{" "}
            {skipped.slice(0, 8).join(", ")}
            {skipped.length > 8 ? "…" : ""}
          </p>
        ) : null}
      </section>

      {/* Comparison table */}
      {rows.length > 0 ? (
        <section className="mt-12">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <h2 className="font-display text-2xl font-extrabold tracking-tight text-brand-950">
              Comparação — {rows.length} produto{rows.length > 1 ? "s" : ""}
            </h2>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={mlPremium}
                  onChange={(e) => setMlPremium(e.target.checked)}
                  className="h-4 w-4 accent-teal-700"
                />
                M. Livre Premium
              </label>
              <button
                type="button"
                onClick={() => downloadPlanilha(rows)}
                className="rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold px-5 py-2.5 transition-colors"
              >
                ⬇ Baixar planilha
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-brand-900/10 bg-white">
            <table className="w-full text-sm min-w-[720px]">
              <thead>
                <tr className="text-left border-b border-brand-900/10">
                  <th className="px-4 py-3 font-semibold">Produto</th>
                  <th className="px-4 py-3 font-semibold tabular-nums text-right">
                    Preço
                  </th>
                  {PLATFORMS.map((p) => (
                    <th key={p.id} className="px-4 py-3 font-semibold text-right">
                      {p.shortName}
                    </th>
                  ))}
                  <th className="px-4 py-3 font-semibold">Melhor</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(({ product, results, best }, i) => (
                  <tr
                    key={`${product.nome}-${i}`}
                    className="border-b border-brand-900/5 last:border-0"
                  >
                    <td className="px-4 py-3 font-medium max-w-[200px] truncate">
                      {product.nome}
                    </td>
                    <td className="px-4 py-3 tabular-nums text-right text-ink-soft">
                      {formatBRL(product.preco)}
                    </td>
                    {PLATFORMS.map((p) => {
                      const r = results[p.id];
                      const isBest = p.id === best;
                      return (
                        <td
                          key={p.id}
                          className={`px-4 py-3 tabular-nums text-right ${
                            isBest ? "bg-brand-50 font-bold text-brand-800" : ""
                          } ${r.netProfit < 0 ? "text-red-700" : ""}`}
                        >
                          {formatBRL(r.netProfit)}
                          <span className="block text-[11px] font-normal text-ink-faint">
                            {formatPercent(r.margin)}
                          </span>
                        </td>
                      );
                    })}
                    <td className="px-4 py-3 font-semibold text-brand-700">
                      {PLATFORMS.find((p) => p.id === best)!.shortName}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-ink-faint">
            Lucro líquido por plataforma (margem abaixo). Produtos sem coluna de
            categoria usam a categoria padrão de cada plataforma.
            {mlPremium
              ? " Mercado Livre no plano Premium — a mensalidade de R$69,99 não está incluída no cálculo por item."
              : ""}
          </p>
        </section>
      ) : null}

      <Breakeven />
    </div>
  );
}
