"use client";

import { useMemo, useState } from "react";
import {
  PLATFORMS,
  DEFAULT_CATEGORY,
  calculateFees,
  formatBRL,
  formatPercent,
  type PlatformId,
} from "@/lib/fees";
import { parseBRLNumber } from "@/lib/csv";

function MoneyInput({
  id,
  label,
  value,
  onChange,
  hint,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
  placeholder: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-ink mb-1.5"
      >
        {label}
        {hint ? (
          <span className="ml-2 font-normal text-ink-faint text-xs">{hint}</span>
        ) : null}
      </label>
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint text-sm font-medium">
          R$
        </span>
        <input
          id={id}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-brand-900/15 bg-white pl-11 pr-4 py-3 text-lg font-semibold text-ink tabular-nums placeholder:text-ink-faint/50 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-shadow"
        />
      </div>
    </div>
  );
}

export default function Calculator() {
  const [platformId, setPlatformId] = useState<PlatformId>("shopee");
  const [category, setCategory] = useState<string>(DEFAULT_CATEGORY);
  const [price, setPrice] = useState("");
  const [cost, setCost] = useState("");
  const [shipping, setShipping] = useState("");
  const [mlPremium, setMlPremium] = useState(false);

  const platform = PLATFORMS.find((p) => p.id === platformId)!;
  const categories = Object.keys(platform.categories);
  const activeCategory = categories.includes(category)
    ? category
    : DEFAULT_CATEGORY;

  const priceNum = parseBRLNumber(price);
  const costNum = parseBRLNumber(cost);
  const shippingNum = parseBRLNumber(shipping);

  const hasInput = Number.isFinite(priceNum) && priceNum > 0;

  const result = useMemo(() => {
    if (!hasInput) return null;
    return calculateFees({
      platform: platformId,
      category: activeCategory,
      price: priceNum,
      cost: Number.isFinite(costNum) ? costNum : 0,
      shipping: Number.isFinite(shippingNum) ? shippingNum : 0,
      premiumPlan: mlPremium,
    });
  }, [hasInput, platformId, activeCategory, priceNum, costNum, shippingNum, mlPremium]);

  const isPremiumActive = platformId === "mercadolivre" && mlPremium;

  return (
    <section
      aria-label="Calculadora de taxas"
      className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(320px,380px)] gap-8 lg:gap-12 items-start"
    >
      {/* ── Inputs ── */}
      <div>
        <fieldset className="mb-7">
          <legend className="text-sm font-semibold text-ink mb-2.5">
            Onde você vende?
          </legend>
          <div className="flex flex-wrap gap-2" role="radiogroup">
            {PLATFORMS.map((p) => {
              const selected = p.id === platformId;
              return (
                <button
                  key={p.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setPlatformId(p.id)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors border ${
                    selected
                      ? "bg-brand-950 text-white border-brand-950"
                      : "bg-white text-ink-soft border-brand-900/15 hover:border-brand-600 hover:text-brand-800"
                  }`}
                >
                  {p.name}
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="mb-7">
          <label
            htmlFor="categoria"
            className="block text-sm font-semibold text-ink mb-1.5"
          >
            Categoria do produto
          </label>
          <select
            id="categoria"
            value={activeCategory}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-lg border border-brand-900/15 bg-white px-3.5 py-3 text-base text-ink focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {platform.premium ? (
          <label className="flex items-start gap-3 mb-7 cursor-pointer select-none rounded-lg border border-brand-900/10 bg-brand-50 px-4 py-3">
            <input
              type="checkbox"
              checked={mlPremium}
              onChange={(e) => setMlPremium(e.target.checked)}
              className="mt-1 h-4 w-4 accent-teal-700"
            />
            <span>
              <span className="block text-sm font-semibold text-ink">
                {platform.premium.label}
              </span>
              <span className="block text-xs text-ink-soft mt-0.5">
                {platform.premium.note}
              </span>
            </span>
          </label>
        ) : null}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <MoneyInput
            id="preco"
            label="Preço de venda"
            placeholder="99,90"
            value={price}
            onChange={setPrice}
          />
          <MoneyInput
            id="custo"
            label="Custo do produto"
            placeholder="45,00"
            value={cost}
            onChange={setCost}
          />
          <MoneyInput
            id="frete"
            label="Frete"
            hint="opcional"
            placeholder="0,00"
            value={shipping}
            onChange={setShipping}
          />
        </div>
      </div>

      {/* ── Receipt ── */}
      <div className="lg:sticky lg:top-6">
        <div className="bg-white rounded-t-xl shadow-[0_2px_16px_rgba(4,47,44,0.10)] px-6 pt-6 pb-8 receipt-edge">
          <div className="flex items-baseline justify-between mb-1">
            <p className="font-display text-sm font-bold uppercase tracking-[0.14em] text-brand-700">
              Resultado
            </p>
            <p className="text-xs text-ink-faint">
              {platform.name}
              {isPremiumActive ? " · Premium" : ""}
            </p>
          </div>
          <p className="text-xs text-ink-faint mb-5">
            {activeCategory} ·{" "}
            {result
              ? `comissão de ${formatPercent(result.rule.commission * 100)}`
              : "preencha o preço de venda"}
          </p>

          {result ? (
            <dl className="space-y-3 text-[15px]">
              <div className="flex justify-between gap-4">
                <dt className="text-ink-soft">Preço de venda</dt>
                <dd className="font-semibold tabular-nums">
                  {formatBRL(result.price)}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-soft">Taxa da plataforma</dt>
                <dd className="font-semibold tabular-nums text-red-700">
                  − {formatBRL(result.platformFee)}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-soft">Tarifa fixa</dt>
                <dd className="font-semibold tabular-nums text-red-700">
                  − {formatBRL(result.fixedFee)}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-soft">Custo do produto</dt>
                <dd className="font-semibold tabular-nums text-red-700">
                  − {formatBRL(result.cost)}
                </dd>
              </div>
              {result.shipping > 0 ? (
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-soft">Frete</dt>
                  <dd className="font-semibold tabular-nums text-red-700">
                    − {formatBRL(result.shipping)}
                  </dd>
                </div>
              ) : null}

              <div className="rule-dashed my-4" aria-hidden="true" />

              <div className="flex justify-between gap-4 text-sm">
                <dt className="text-ink-faint">Lucro bruto (venda − custo)</dt>
                <dd className="tabular-nums text-ink-soft">
                  {formatBRL(result.grossProfit)}
                </dd>
              </div>

              <div className="flex justify-between items-baseline gap-4 pt-1">
                <dt className="font-display font-bold text-ink">
                  Lucro líquido
                </dt>
                <dd
                  className={`font-display text-3xl font-extrabold tabular-nums ${
                    result.netProfit >= 0 ? "text-brand-700" : "text-red-700"
                  }`}
                >
                  {formatBRL(result.netProfit)}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-soft">Margem</dt>
                <dd
                  className={`font-bold tabular-nums ${
                    result.margin >= 0 ? "text-brand-700" : "text-red-700"
                  }`}
                >
                  {formatPercent(result.margin)}
                </dd>
              </div>

              {result.netProfit < 0 ? (
                <p className="text-xs text-red-700 bg-red-50 rounded-md px-3 py-2 mt-2">
                  Você perde dinheiro nessa venda. Aumente o preço ou reduza o
                  custo.
                </p>
              ) : null}
              {isPremiumActive ? (
                <p className="text-xs text-ink-faint pt-1">
                  * Não inclui a mensalidade de {formatBRL(platform.premium!.monthlyCost)} do plano Premium.
                </p>
              ) : null}
            </dl>
          ) : (
            <div className="py-8 text-center">
              <p className="font-display text-4xl font-extrabold text-brand-900/10 tabular-nums mb-3">
                R$ 0,00
              </p>
              <p className="text-sm text-ink-faint max-w-[24ch] mx-auto">
                Informe o preço de venda e veja na hora quanto sobra no seu
                bolso.
              </p>
            </div>
          )}
        </div>

        {result ? (
          <a
            href="#pro"
            className="block mt-5 text-center text-sm font-semibold text-brand-700 hover:text-brand-900 transition-colors"
          >
            Quer comparar as 4 plataformas de uma vez? Conheça o Modo Pro ↓
          </a>
        ) : null}
      </div>
    </section>
  );
}
