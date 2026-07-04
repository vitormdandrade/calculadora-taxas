// Fee tables for Brazilian marketplaces — updated July/2026.
// Sources: official seller-center fee pages of each platform. Values are
// hardcoded on purpose (no external calls); update here when platforms change.

export type PlatformId = "shopee" | "mercadolivre" | "amazon" | "magalu";

export interface FeeRule {
  /** Commission as a fraction of the sale price (0.14 = 14%) */
  commission: number;
  /** Fixed fee charged per item sold, in BRL */
  fixed: number;
}

export interface Platform {
  id: PlatformId;
  name: string;
  shortName: string;
  categories: Record<string, FeeRule>;
  /** Optional alternative plan (e.g. Mercado Livre Premium) */
  premium?: {
    label: string;
    monthlyCost: number;
    note: string;
    categories: Record<string, FeeRule>;
  };
}

export const DEFAULT_CATEGORY = "Outras categorias";

export const PLATFORMS: Platform[] = [
  {
    id: "shopee",
    name: "Shopee",
    shortName: "Shopee",
    categories: {
      Moda: { commission: 0.14, fixed: 4.0 },
      Beleza: { commission: 0.14, fixed: 4.0 },
      Casa: { commission: 0.16, fixed: 4.0 },
      "Eletrônicos": { commission: 0.12, fixed: 4.0 },
      Brinquedos: { commission: 0.14, fixed: 4.0 },
      Papelaria: { commission: 0.16, fixed: 4.0 },
      [DEFAULT_CATEGORY]: { commission: 0.2, fixed: 4.0 },
    },
  },
  {
    id: "mercadolivre",
    name: "Mercado Livre",
    shortName: "M. Livre",
    categories: {
      Tecnologia: { commission: 0.11, fixed: 5.0 },
      Moda: { commission: 0.16, fixed: 5.0 },
      [DEFAULT_CATEGORY]: { commission: 0.14, fixed: 5.0 },
    },
    premium: {
      label: "Plano Premium",
      monthlyCost: 69.99,
      note: "R$69,99/mês — comissão menor e sem tarifa fixa por venda",
      categories: {
        Tecnologia: { commission: 0.1, fixed: 0 },
        Moda: { commission: 0.14, fixed: 0 },
        [DEFAULT_CATEGORY]: { commission: 0.12, fixed: 0 },
      },
    },
  },
  {
    id: "amazon",
    name: "Amazon",
    shortName: "Amazon",
    categories: {
      Livros: { commission: 0.12, fixed: 2.5 },
      "Eletrônicos": { commission: 0.08, fixed: 2.5 },
      Casa: { commission: 0.14, fixed: 2.5 },
      [DEFAULT_CATEGORY]: { commission: 0.15, fixed: 2.5 },
    },
  },
  {
    id: "magalu",
    name: "Magalu",
    shortName: "Magalu",
    categories: {
      "Eletrônicos": { commission: 0.12, fixed: 5.0 },
      "Móveis": { commission: 0.16, fixed: 5.0 },
      [DEFAULT_CATEGORY]: { commission: 0.14, fixed: 5.0 },
    },
  },
];

export function getPlatform(id: PlatformId): Platform {
  const platform = PLATFORMS.find((p) => p.id === id);
  if (!platform) throw new Error(`Plataforma desconhecida: ${id}`);
  return platform;
}

export interface CalcInput {
  platform: PlatformId;
  category: string;
  /** Sale price in BRL */
  price: number;
  /** Product cost in BRL */
  cost: number;
  /** Shipping paid by the seller in BRL (optional) */
  shipping?: number;
  /** Use the platform's premium plan when available (Mercado Livre) */
  premiumPlan?: boolean;
}

export interface CalcResult {
  platform: PlatformId;
  platformName: string;
  category: string;
  rule: FeeRule;
  price: number;
  cost: number;
  shipping: number;
  /** Commission charged by the platform, in BRL */
  platformFee: number;
  /** Fixed per-item fee, in BRL */
  fixedFee: number;
  /** price − cost */
  grossProfit: number;
  /** price − commission − fixed fee − cost − shipping */
  netProfit: number;
  /** netProfit / price, as a percentage (0 when price is 0) */
  margin: number;
  premiumPlan: boolean;
}

function resolveRule(
  platform: Platform,
  category: string,
  premiumPlan: boolean
): FeeRule {
  const table =
    premiumPlan && platform.premium
      ? platform.premium.categories
      : platform.categories;
  return table[category] ?? table[DEFAULT_CATEGORY];
}

export function calculateFees(input: CalcInput): CalcResult {
  const platform = getPlatform(input.platform);
  const premiumPlan = Boolean(input.premiumPlan && platform.premium);
  const rule = resolveRule(platform, input.category, premiumPlan);

  const price = Math.max(0, input.price || 0);
  const cost = Math.max(0, input.cost || 0);
  const shipping = Math.max(0, input.shipping || 0);

  const platformFee = round2(price * rule.commission);
  const fixedFee = price > 0 ? rule.fixed : 0;
  const grossProfit = round2(price - cost);
  const netProfit = round2(price - platformFee - fixedFee - cost - shipping);
  const margin = price > 0 ? round2((netProfit / price) * 100) : 0;

  return {
    platform: platform.id,
    platformName: platform.name,
    category: input.category,
    rule,
    price,
    cost,
    shipping,
    platformFee,
    fixedFee,
    grossProfit,
    netProfit,
    margin,
    premiumPlan,
  };
}

/** Compare one product across all four platforms (Pro mode). */
export function compareAllPlatforms(
  input: Omit<CalcInput, "platform">
): CalcResult[] {
  return PLATFORMS.map((p) =>
    calculateFees({
      ...input,
      platform: p.id,
      category: input.category in p.categories ? input.category : DEFAULT_CATEGORY,
    })
  );
}

/**
 * Breakeven price: the minimum sale price where net profit is zero.
 * price = (cost + shipping + fixed) / (1 − commission)
 */
export function breakevenPrice(
  platform: PlatformId,
  category: string,
  cost: number,
  shipping = 0,
  premiumPlan = false
): number {
  const p = getPlatform(platform);
  const rule = resolveRule(p, category, Boolean(premiumPlan && p.premium));
  if (rule.commission >= 1) return NaN;
  return round2((cost + shipping + rule.fixed) / (1 - rule.commission));
}

export function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export function formatBRL(n: number): string {
  return n.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
}

export function formatPercent(n: number): string {
  return `${n.toLocaleString("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })}%`;
}
