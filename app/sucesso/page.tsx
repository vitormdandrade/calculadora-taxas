import type { Metadata } from "next";
import { isSessionPaid } from "@/lib/pro";

export const metadata: Metadata = {
  title: "Pagamento confirmado — Modo Pro | Calcula Taxas",
  robots: { index: false },
};

export default async function SucessoPage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  const sessionId = searchParams.session_id;
  const paid = await isSessionPaid(sessionId);

  return (
    <div className="max-w-xl mx-auto px-5 sm:px-8 py-20 text-center">
      {paid ? (
        <>
          <p className="text-5xl mb-6" aria-hidden="true">
            ✅
          </p>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-brand-950 mb-3">
            Pagamento confirmado!
          </h1>
          <p className="text-ink-soft leading-relaxed mb-8">
            O Modo Pro está liberado. Guarde o link abaixo — ele é o seu acesso
            às ferramentas Pro e à planilha de análise.
          </p>
          <a
            href={`/pro?session_id=${encodeURIComponent(sessionId!)}`}
            className="inline-block rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-bold px-8 py-3.5 no-underline transition-colors"
          >
            Abrir o Modo Pro →
          </a>
          <p className="text-xs text-ink-faint mt-6">
            Dica: salve esta página nos favoritos para voltar quando quiser.
          </p>
        </>
      ) : (
        <>
          <p className="text-5xl mb-6" aria-hidden="true">
            ⏳
          </p>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-brand-950 mb-3">
            Não encontramos seu pagamento
          </h1>
          <p className="text-ink-soft leading-relaxed mb-8">
            Se você acabou de pagar, aguarde alguns segundos e recarregue esta
            página. Se o problema continuar, tente novamente pelo botão abaixo.
          </p>
          <a
            href="/#pro"
            className="inline-block rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-bold px-8 py-3.5 no-underline transition-colors"
          >
            Voltar ao Modo Pro
          </a>
        </>
      )}
    </div>
  );
}
