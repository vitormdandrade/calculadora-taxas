import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termos de Serviço — ResolveKit",
  description:
    "Termos de Serviço do ResolveKit: condições de uso, isenção de responsabilidade legal, limitação de responsabilidade e LGPD.",
  alternates: { canonical: "/termos" },
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "12 de julho de 2026";

function Section({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-brand-950">
        {number}. {title}
      </h2>
      <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-ink-soft">
        {children}
      </div>
    </section>
  );
}

export default function TermosPage() {
  return (
    <article className="max-w-3xl mx-auto px-5 sm:px-8 pt-10 sm:pt-16 pb-20">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600 mb-3">
        Legal
      </p>
      <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-brand-950">
        Termos de Serviço
      </h1>
      <p className="mt-2 text-sm text-ink-faint">
        Última atualização: {LAST_UPDATED}
      </p>

      <div className="mt-8 rounded-lg bg-amber-50 border border-amber-300 px-4 py-3 text-sm leading-relaxed text-amber-800">
        <strong className="font-semibold">Resumo em linguagem simples:</strong>{" "}
        o ResolveKit oferece ferramentas de cálculo e geração de modelos de
        documentos. Não somos um escritório de advocacia, contabilidade ou
        consultoria financeira. Nossas ferramentas são pontos de partida — para
        situações complexas ou de alto valor, consulte um profissional
        habilitado.
      </div>

      <Section number="1" title="Aceitação dos Termos">
        <p>
          Ao acessar ou utilizar qualquer ferramenta do ResolveKit
          (resolvekit.com.br) e de seus produtos associados (a
          &ldquo;Plataforma&rdquo;), você declara ter lido, compreendido e
          concordado integralmente com estes Termos de Serviço. Se você não
          concorda com qualquer disposição destes Termos, não utilize a
          Plataforma.
        </p>
        <p>
          Podemos atualizar estes Termos a qualquer momento. A versão vigente
          estará sempre disponível nesta página, com a data da última
          atualização indicada no topo. O uso continuado da Plataforma após
          alterações constitui aceitação dos novos Termos.
        </p>
      </Section>

      <Section number="2" title="Descrição do Serviço">
        <p>
          O ResolveKit é uma plataforma de ferramentas digitais de autosserviço
          voltadas a MEIs, autônomos e pequenos empreendedores, incluindo
          calculadoras (taxas de marketplace, verbas rescisórias,
          financiamentos), geradores de modelos de documentos (contratos,
          cartas de cobrança) e consultas a dados públicos (CNPJ).
        </p>
        <p>
          <strong className="text-ink font-semibold">
            A Plataforma é uma ferramenta de geração de modelos e de cálculo
            educacional — não é assessoria jurídica, contábil ou financeira.
          </strong>{" "}
          Os documentos gerados são modelos genéricos baseados na legislação
          brasileira federal; requisitos estaduais e municipais podem variar e
          não são contemplados. Os cálculos utilizam tabelas e regras públicas
          que podem estar desatualizadas ou não refletir a sua situação
          específica.
        </p>
      </Section>

      <Section number="3" title="Isenção de Responsabilidade Legal">
        <p>
          <strong className="text-ink font-semibold">
            Não somos um escritório de advocacia.
          </strong>{" "}
          O ResolveKit não é inscrito na Ordem dos Advogados do Brasil (OAB),
          não exerce advocacia e não fornece aconselhamento jurídico, nos
          termos da Lei nº 8.906/94. O uso da Plataforma não cria qualquer
          relação advogado-cliente entre você e o ResolveKit, seus sócios,
          funcionários ou colaboradores.
        </p>
        <p>
          Da mesma forma, não somos escritório de contabilidade nem instituição
          autorizada a prestar consultoria de investimentos ou aconselhamento
          financeiro regulado. Os resultados das calculadoras têm caráter
          exclusivamente educacional e informativo.
        </p>
        <p>
          Você é o único responsável por revisar, adaptar e validar qualquer
          documento ou cálculo gerado pela Plataforma antes de utilizá-lo. Para
          situações que envolvam valores relevantes, litígio, relações de
          trabalho, imóveis ou qualquer risco jurídico, recomendamos
          expressamente a consulta a advogado, contador ou outro profissional
          habilitado.
        </p>
      </Section>

      <Section number="4" title="Indenização">
        <p>
          Você concorda em defender, indenizar e isentar o ResolveKit, suas
          empresas afiliadas, sócios, administradores, funcionários e
          prestadores de serviço de toda e qualquer reclamação, demanda, ação
          judicial ou extrajudicial, perda, dano, custo ou despesa (incluindo
          honorários advocatícios razoáveis) decorrente de: (a) seu uso ou mau
          uso da Plataforma; (b) documentos gerados, editados ou enviados por
          você a terceiros; (c) decisões tomadas com base em cálculos ou
          informações obtidas na Plataforma; (d) violação destes Termos ou de
          qualquer lei aplicável; ou (e) violação de direitos de terceiros.
        </p>
      </Section>

      <Section number="5" title="Limitação de Responsabilidade">
        <p>
          Na máxima extensão permitida pela legislação brasileira, a
          responsabilidade total do ResolveKit por quaisquer danos decorrentes
          do uso da Plataforma fica{" "}
          <strong className="text-ink font-semibold">
            limitada ao valor efetivamente pago
          </strong>{" "}
          por você pelo produto ou assinatura nos 12 (doze) meses anteriores ao
          evento que deu origem à reclamação. Para ferramentas gratuitas, a
          responsabilidade fica limitada a R$0,00 (zero reais), ressalvadas as
          hipóteses de dolo ou culpa grave.
        </p>
        <p>
          O ResolveKit não responde por lucros cessantes, perda de dados, danos
          indiretos ou consequenciais, nem por resultados incorretos derivados
          de dados desatualizados de terceiros (tabelas de taxas de
          marketplaces, índices financeiros, bases públicas de CNPJ e
          protestos).
        </p>
        <p>
          Nada nestes Termos exclui ou limita direitos que não possam ser
          excluídos ou limitados nos termos do Código de Defesa do Consumidor
          (Lei nº 8.078/90).
        </p>
      </Section>

      <Section number="6" title="Privacidade e LGPD">
        <p>
          Tratamos dados pessoais em conformidade com a Lei Geral de Proteção
          de Dados (Lei nº 13.709/18 — LGPD). Os dados inseridos nas
          calculadoras são processados localmente no seu navegador sempre que
          possível e não são armazenados em nossos servidores. Pagamentos são
          processados pela Stripe — não armazenamos dados de cartão de crédito.
        </p>
        <p>
          Para detalhes sobre coleta, uso, cookies e seus direitos como
          titular de dados, consulte nossa{" "}
          <a
            href="/privacidade"
            className="font-semibold text-brand-700 underline underline-offset-2 hover:text-brand-900"
          >
            Política de Privacidade
          </a>
          .
        </p>
      </Section>

      <Section number="7" title="Lei Aplicável e Foro">
        <p>
          Estes Termos são regidos pelas leis da República Federativa do
          Brasil. Fica eleito o foro da Comarca de São Paulo/SP para dirimir
          quaisquer controvérsias decorrentes destes Termos, com renúncia
          expressa a qualquer outro, por mais privilegiado que seja,
          ressalvado o direito do consumidor de optar pelo foro de seu
          domicílio, nos termos da legislação aplicável.
        </p>
        <p>
          Dúvidas sobre estes Termos podem ser enviadas para{" "}
          <a
            href="mailto:contato@resolvekit.com.br"
            className="font-semibold text-brand-700 underline underline-offset-2 hover:text-brand-900"
          >
            contato@resolvekit.com.br
          </a>
          .
        </p>
      </Section>
    </article>
  );
}
