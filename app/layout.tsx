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

const SITE_URL = "https://resolvekit.com.br";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "ResolveKit — Ferramentas gratuitas para MEIs e autônomos",
  description:
    "Calculadoras, geradores de contratos, cartas de cobrança e consultas CNPJ. Tudo grátis ou com preço justo. Resolva suas pendências em minutos.",
  alternates: { canonical: "/" },
  keywords: [
    "calculadora taxas marketplace",
    "calculadora rescisão trabalhista",
    "carta de cobrança MEI",
    "consulta CNPJ",
    "simulador financiamento imobiliário",
    "contrato de aluguel",
    "contrato prestação serviço",
    "ferramentas MEI",
    "resolvekit",
  ],
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "ResolveKit",
    locale: "pt_BR",
    title: "ResolveKit — Ferramentas gratuitas para MEIs e autônomos",
    description:
      "Calculadoras, geradores de contratos, cartas de cobrança e consultas CNPJ. Tudo grátis ou com preço justo.",
  },
  twitter: {
    card: "summary",
    title: "ResolveKit — Ferramentas para MEI",
    description:
      "Calculadoras, contratos e consultas para resolver sua vida de autônomo.",
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
                resolve<span className="text-brand-600">kit</span>
              </span>
              <span className="hidden sm:inline text-[11px] uppercase tracking-[0.18em] text-ink-faint font-semibold">
                .com.br
              </span>
            </a>
            <div className="flex items-center gap-4">
              <a
                href="/#calculator"
                className="text-sm font-medium text-ink-soft no-underline hover:text-brand-700 transition-colors"
              >
                Calculadora
              </a>
              <a
                href="/#pro"
                className="text-sm font-semibold text-brand-700 no-underline hover:text-brand-900 transition-colors"
              >
                Modo Pro
              </a>
            </div>
          </nav>
        </header>

        <main className="flex-grow w-full">{children}</main>

        <footer className="mt-24 bg-brand-950 text-brand-100">
          <div className="max-w-5xl mx-auto px-5 py-14 sm:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
              <div className="sm:col-span-1">
                <p className="font-display text-lg font-bold text-white mb-3">
                  resolve<span className="text-brand-300">kit</span>
                </p>
                <p className="text-sm leading-relaxed text-brand-200/80">
                  Ferramentas gratuitas e acessíveis para MEIs, autônomos e
                  pequenos empreendedores. Resolva burocracias em minutos.
                </p>
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest mb-4 text-brand-300">
                  Ferramentas
                </h4>
                <ul className="space-y-2.5 text-sm">
                  <li>
                    <a href="/#calculator" className="no-underline text-brand-100 hover:text-white transition-colors">
                      Calculadora de Taxas
                    </a>
                  </li>
                  <li>
                    <a href="https://mc-rescisao-trabalhista.vercel.app" rel="noopener" className="no-underline text-brand-100 hover:text-white transition-colors">
                      Rescisão Trabalhista
                    </a>
                  </li>
                  <li>
                    <a href="https://mc-carta-cobranca.vercel.app" rel="noopener" className="no-underline text-brand-100 hover:text-white transition-colors">
                      Carta de Cobrança
                    </a>
                  </li>
                  <li>
                    <a href="https://mc-cnpj-radar.vercel.app" rel="noopener" className="no-underline text-brand-100 hover:text-white transition-colors">
                      CNPJ Radar
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest mb-4 text-brand-300">
                  Blogs e comparadores
                </h4>
                <ul className="space-y-2.5 text-sm">
                  <li>
                    <a href="https://oraculodomei.com.br" rel="noopener" className="no-underline text-brand-100 hover:text-white transition-colors">
                      🔮 Oráculo do MEI
                    </a>
                  </li>
                  <li>
                    <a href="https://compararsaas.com.br" rel="noopener" className="no-underline text-brand-100 hover:text-white transition-colors">
                      📊 Comparar SaaS
                    </a>
                  </li>
                  <li>
                    <a href="https://calculaseguro.com.br" rel="noopener" className="no-underline text-brand-100 hover:text-white transition-colors">
                      🚗 Calcula Seguro
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-12 pt-6 border-t border-white/10 text-xs text-brand-200/60 space-y-2">
              <p>
                Ferramentas educacionais — não constituem aconselhamento
                jurídico ou financeiro. Confirme as informações nas fontes
                oficiais.
              </p>
              <p>© 2026 ResolveKit. Todos os direitos reservados.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
