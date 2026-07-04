import type { Metadata } from "next";
import { Bricolage_Grotesque, Instrument_Sans } from "next/font/google";
import "./globals.css";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700", "800"],
});

const body = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://calculataxas.com.br";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Calculadora de Taxas Shopee e Mercado Livre | Calcule seu Lucro",
  description:
    "Calcule taxas, comissões e lucro real nas vendas pelo Shopee, Mercado Livre, Amazon e Magalu. Grátis e sem cadastro.",
  alternates: { canonical: "/" },
  keywords: [
    "calculadora de taxas shopee",
    "calculadora mercado livre",
    "comissão marketplace",
    "lucro shopee",
    "taxa mercado livre 2026",
    "calculadora de lucro marketplace",
  ],
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Calcula Taxas",
    locale: "pt_BR",
    title: "Calculadora de Taxas Shopee e Mercado Livre | Calcule seu Lucro",
    description:
      "Calcule taxas, comissões e lucro real nas vendas pelo Shopee, Mercado Livre, Amazon e Magalu. Grátis e sem cadastro.",
  },
  twitter: {
    card: "summary",
    title: "Calculadora de Taxas de Marketplace",
    description:
      "Descubra quanto sobra de verdade em cada venda no Shopee, Mercado Livre, Amazon e Magalu.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${body.variable}`}>
      <body className="min-h-screen flex flex-col">
        <header className="w-full">
          <nav className="max-w-5xl mx-auto flex items-center justify-between px-5 py-5 sm:px-8">
            <a href="/" className="flex items-baseline gap-1.5 no-underline">
              <span className="font-display text-xl font-extrabold tracking-tight text-brand-950">
                calcula<span className="text-brand-600">taxas</span>
              </span>
              <span className="hidden sm:inline text-[11px] uppercase tracking-[0.18em] text-ink-faint font-semibold">
                marketplaces BR
              </span>
            </a>
            <a
              href="/#pro"
              className="text-sm font-semibold text-brand-700 no-underline hover:text-brand-900 transition-colors"
            >
              Modo Pro
            </a>
          </nav>
        </header>

        <main className="flex-grow w-full">{children}</main>

        <footer className="mt-24 bg-brand-950 text-brand-100">
          <div className="max-w-5xl mx-auto px-5 py-14 sm:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
              <div className="sm:col-span-1">
                <p className="font-display text-lg font-bold text-white mb-3">
                  calcula<span className="text-brand-300">taxas</span>
                </p>
                <p className="text-sm leading-relaxed text-brand-200/80">
                  A calculadora de taxas e lucro para quem vende no Shopee,
                  Mercado Livre, Amazon e Magalu. Grátis, sem cadastro.
                </p>
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest mb-4 text-brand-300">
                  Ferramenta
                </h4>
                <ul className="space-y-2.5 text-sm">
                  <li>
                    <a href="/" className="no-underline text-brand-100 hover:text-white transition-colors">
                      Calculadora grátis
                    </a>
                  </li>
                  <li>
                    <a href="/#pro" className="no-underline text-brand-100 hover:text-white transition-colors">
                      Modo Pro — R$39,90
                    </a>
                  </li>
                  <li>
                    <a href="/#faq" className="no-underline text-brand-100 hover:text-white transition-colors">
                      Perguntas frequentes
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest mb-4 text-brand-300">
                  Outras ferramentas
                </h4>
                <ul className="space-y-2.5 text-sm">
                  <li>
                    <a
                      href="https://oraculodomei.com.br"
                      rel="noopener"
                      className="no-underline text-brand-100 hover:text-white transition-colors"
                    >
                      🔮 Oráculo do MEI
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://compararsaas.com.br"
                      rel="noopener"
                      className="no-underline text-brand-100 hover:text-white transition-colors"
                    >
                      Comparador SaaS
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://calculaseguro.com.br"
                      rel="noopener"
                      className="no-underline text-brand-100 hover:text-white transition-colors"
                    >
                      Calcula Seguro
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-12 pt-6 border-t border-white/10 text-xs text-brand-200/60 space-y-2">
              <p>
                Taxas atualizadas conforme informações oficiais em Julho/2026.
                Confirme os valores no portal da plataforma.
              </p>
              <p>© 2026 Calcula Taxas. Ferramenta educacional — não constitui aconselhamento financeiro.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
