import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade — ResolveKit",
  description:
    "Política de Privacidade do ResolveKit em conformidade com a LGPD: quais dados coletamos, como usamos, cookies e seus direitos como titular.",
  alternates: { canonical: "/privacidade" },
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "12 de julho de 2026";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-brand-950">
        {title}
      </h2>
      <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-ink-soft">
        {children}
      </div>
    </section>
  );
}

export default function PrivacidadePage() {
  return (
    <article className="max-w-3xl mx-auto px-5 sm:px-8 pt-10 sm:pt-16 pb-20">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600 mb-3">
        Legal
      </p>
      <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-brand-950">
        Política de Privacidade
      </h1>
      <p className="mt-2 text-sm text-ink-faint">
        Última atualização: {LAST_UPDATED}
      </p>

      <p className="mt-8 text-[15px] leading-relaxed text-ink-soft">
        Esta Política descreve como o ResolveKit (resolvekit.com.br) trata
        dados pessoais, em conformidade com a Lei Geral de Proteção de Dados
        (Lei nº 13.709/18 — LGPD). Nosso princípio é a minimização: coletamos o
        mínimo necessário para operar as ferramentas.
      </p>

      <Section title="Quais dados coletamos">
        <p>
          <strong className="text-ink font-semibold">
            Dados inseridos nas calculadoras
          </strong>{" "}
          (preços, custos, valores de rescisão, dados de contratos): são
          processados no seu navegador sempre que possível e{" "}
          <strong className="text-ink font-semibold">
            não são armazenados em nossos servidores
          </strong>
          . Ao fechar a página, eles desaparecem.
        </p>
        <p>
          <strong className="text-ink font-semibold">Dados de pagamento:</strong>{" "}
          pagamentos são processados integralmente pela Stripe (Stripe, Inc.),
          certificada PCI-DSS nível 1.{" "}
          <strong className="text-ink font-semibold">
            Não armazenamos dados de cartão de crédito
          </strong>{" "}
          — recebemos da Stripe apenas a confirmação do pagamento e o e-mail
          informado no checkout, usado para liberar o acesso ao produto
          adquirido. A política de privacidade da Stripe está disponível em
          stripe.com/br/privacy.
        </p>
        <p>
          <strong className="text-ink font-semibold">
            Dados de navegação:
          </strong>{" "}
          registros técnicos básicos (endereço IP, navegador, páginas
          acessadas) podem ser coletados pela nossa infraestrutura de
          hospedagem para segurança e métricas agregadas de uso.
        </p>
      </Section>

      <Section title="Como usamos os dados">
        <p>Usamos dados pessoais exclusivamente para:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Processar pagamentos e liberar acesso a produtos e assinaturas;</li>
          <li>Enviar comunicações transacionais (confirmação de compra, recibo);</li>
          <li>Cumprir obrigações legais, fiscais e regulatórias;</li>
          <li>Prevenir fraude e garantir a segurança da Plataforma.</li>
        </ul>
        <p>
          Não vendemos dados pessoais e não os compartilhamos com terceiros
          para fins de marketing.
        </p>
      </Section>

      <Section title="Cookies">
        <p>
          Utilizamos apenas cookies estritamente necessários ao funcionamento
          da Plataforma — por exemplo, para manter o acesso Pro liberado após a
          compra. Não utilizamos cookies de rastreamento publicitário. Você
          pode bloquear ou apagar cookies nas configurações do seu navegador;
          algumas funcionalidades (como o acesso Pro) podem deixar de
          funcionar.
        </p>
      </Section>

      <Section title="Seus direitos (LGPD)">
        <p>
          Como titular de dados, você pode, a qualquer momento, solicitar:
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            <strong className="text-ink font-semibold">Acesso</strong> — confirmação de quais dados tratamos sobre você;
          </li>
          <li>
            <strong className="text-ink font-semibold">Correção</strong> — atualização de dados incompletos ou desatualizados;
          </li>
          <li>
            <strong className="text-ink font-semibold">Eliminação</strong> — exclusão dos seus dados, ressalvadas as retenções exigidas por lei;
          </li>
          <li>
            <strong className="text-ink font-semibold">Portabilidade</strong> — cópia dos dados em formato estruturado;
          </li>
          <li>
            <strong className="text-ink font-semibold">Revogação de consentimento</strong> — quando o tratamento se basear em consentimento.
          </li>
        </ul>
        <p>
          Para exercer qualquer direito, escreva para{" "}
          <a
            href="mailto:contato@resolvekit.com.br"
            className="font-semibold text-brand-700 underline underline-offset-2 hover:text-brand-900"
          >
            contato@resolvekit.com.br
          </a>
          . Responderemos nos prazos previstos pela LGPD. Você também pode
          apresentar reclamação à Autoridade Nacional de Proteção de Dados
          (ANPD).
        </p>
      </Section>

      <Section title="Retenção e segurança">
        <p>
          Registros de pagamento são retidos pelo prazo exigido pela legislação
          fiscal brasileira. Dados de navegação são retidos por período
          limitado para fins de segurança. Adotamos medidas técnicas e
          organizacionais razoáveis para proteger os dados sob nossa
          responsabilidade, incluindo criptografia em trânsito (HTTPS).
        </p>
      </Section>

      <Section title="Alterações e contato">
        <p>
          Esta Política pode ser atualizada a qualquer momento; a versão
          vigente estará sempre nesta página com a data da última atualização.
          Ela complementa os nossos{" "}
          <a
            href="/termos"
            className="font-semibold text-brand-700 underline underline-offset-2 hover:text-brand-900"
          >
            Termos de Serviço
          </a>
          .
        </p>
      </Section>
    </article>
  );
}
