// Client-side CSV parsing for Pro mode. No server round-trip: files are
// parsed in the browser and never uploaded anywhere.

export interface CsvProduct {
  nome: string;
  preco: number;
  custo: number;
  frete: number;
  categoria: string;
}

export interface CsvParseResult {
  products: CsvProduct[];
  /** 1-based line numbers (including header) that could not be parsed */
  skippedLines: number[];
  delimiter: string;
}

const HEADER_ALIASES: Record<keyof CsvProduct, string[]> = {
  nome: ["nome", "produto", "titulo", "título", "descricao", "descrição", "item", "sku", "name", "product"],
  preco: ["preco", "preço", "preco de venda", "preço de venda", "valor", "venda", "price"],
  custo: ["custo", "custo do produto", "cmv", "cost"],
  frete: ["frete", "envio", "shipping"],
  categoria: ["categoria", "category"],
};

/** Parse "1.234,56", "1234.56", "R$ 12,90" etc. into a number. */
export function parseBRLNumber(raw: string): number {
  const cleaned = raw.replace(/[^\d.,-]/g, "").trim();
  if (!cleaned) return NaN;
  const hasComma = cleaned.includes(",");
  const hasDot = cleaned.includes(".");
  let normalized = cleaned;
  if (hasComma && hasDot) {
    // Last separator wins as the decimal mark
    if (cleaned.lastIndexOf(",") > cleaned.lastIndexOf(".")) {
      normalized = cleaned.replace(/\./g, "").replace(",", ".");
    } else {
      normalized = cleaned.replace(/,/g, "");
    }
  } else if (hasComma) {
    normalized = cleaned.replace(/\./g, "").replace(",", ".");
  }
  return Number(normalized);
}

function detectDelimiter(headerLine: string): string {
  const candidates = [";", ",", "\t"];
  let best = ";";
  let bestCount = 0;
  for (const d of candidates) {
    const count = headerLine.split(d).length - 1;
    if (count > bestCount) {
      best = d;
      bestCount = count;
    }
  }
  return best;
}

/** Split one CSV line honoring double quotes. */
function splitLine(line: string, delimiter: string): string[] {
  const fields: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === delimiter && !inQuotes) {
      fields.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  fields.push(current);
  return fields.map((f) => f.trim());
}

function mapHeader(fields: string[]): Partial<Record<keyof CsvProduct, number>> {
  const map: Partial<Record<keyof CsvProduct, number>> = {};
  fields.forEach((field, index) => {
    const normalized = field.toLowerCase().replace(/\s+/g, " ").trim();
    for (const key of Object.keys(HEADER_ALIASES) as (keyof CsvProduct)[]) {
      if (map[key] === undefined && HEADER_ALIASES[key].includes(normalized)) {
        map[key] = index;
      }
    }
  });
  return map;
}

export function parseCsv(text: string): CsvParseResult {
  const lines = text
    .replace(/^\uFEFF/, "") // strip BOM
    .split(/\r\n|\n|\r/)
    .filter((l) => l.trim().length > 0);

  if (lines.length === 0) {
    return { products: [], skippedLines: [], delimiter: ";" };
  }

  const delimiter = detectDelimiter(lines[0]);
  const header = mapHeader(splitLine(lines[0], delimiter));

  // Fallback for headerless files: nome; preco; custo [; frete [; categoria]]
  const hasHeader = header.preco !== undefined;
  const columnOf: Record<keyof CsvProduct, number | undefined> = hasHeader
    ? {
        nome: header.nome,
        preco: header.preco,
        custo: header.custo,
        frete: header.frete,
        categoria: header.categoria,
      }
    : { nome: 0, preco: 1, custo: 2, frete: 3, categoria: 4 };

  const products: CsvProduct[] = [];
  const skippedLines: number[] = [];
  const startRow = hasHeader ? 1 : 0;

  for (let i = startRow; i < lines.length; i++) {
    const fields = splitLine(lines[i], delimiter);
    const get = (key: keyof CsvProduct) => {
      const idx = columnOf[key];
      return idx !== undefined && idx < fields.length ? fields[idx] : "";
    };
    const preco = parseBRLNumber(get("preco"));
    const custo = parseBRLNumber(get("custo"));
    if (!Number.isFinite(preco) || preco <= 0) {
      skippedLines.push(i + 1);
      continue;
    }
    const frete = parseBRLNumber(get("frete"));
    products.push({
      nome: get("nome") || `Produto ${products.length + 1}`,
      preco,
      custo: Number.isFinite(custo) ? custo : 0,
      frete: Number.isFinite(frete) ? frete : 0,
      categoria: get("categoria"),
    });
  }

  return { products, skippedLines, delimiter };
}

/** Serialize rows to an Excel-friendly CSV (`;` delimiter, BOM, pt-BR decimals). */
export function toExcelCsv(headers: string[], rows: (string | number)[][]): string {
  const escape = (value: string | number) => {
    const s =
      typeof value === "number"
        ? value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        : value;
    return /[";\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [headers.map(escape).join(";"), ...rows.map((r) => r.map(escape).join(";"))];
  return "\uFEFF" + lines.join("\r\n");
}
