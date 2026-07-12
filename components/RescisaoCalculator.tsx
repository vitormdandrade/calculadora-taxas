"use client";

import { useMemo, useState } from "react";
import {
  calcularRescisao,
  formatBRL,
  MOTIVO_LABEL,
  type MotivoRescisao,
  type TipoAvisoPrevio,
  type ResultadoRescisao,
} from "@/lib/rescisao";
import CheckoutButton from "@/components/CheckoutButton";
import LegalWarningBR from "@/components/LegalWarningBR";

const CONSENT_LABEL =
  "Entendo que esta é uma estimativa baseada na CLT e que os valores reais podem variar conforme convenção coletiva, adicionais e particularidades do meu caso. Este relatório não substitui a consulta com um advogado ou contador.";

function maskSalario(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";
  return (parseInt(digits, 10) / 100).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function parseSalario(raw: string): number {
  return parseFloat(raw.replace(/\./g, "").replace(",", ".")) || 0;
}

function maskTelefone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (!digits) return "";
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function ReceiptLine({
  label,
  sublabel,
  valor,
  inativo,
}: {
  label: string;
  sublabel?: string;
  valor: number;
  inativo?: boolean;
}) {
  if (inativo) {
    return (
      <div className="flex justify-between gap-4 opacity-40">
        <dt className="text-ink-soft">
          {label}
          {sublabel ? (
            <span className="block text-xs text-ink-faint">{sublabel}</span>
          ) : null}
        </dt>
        <dd className="tabular-nums text-ink-faint line-through">
          {formatBRL(0)}
        </dd>
      </div>
    );
  }
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-ink-soft">
        {label}
        {sublabel ? (
          <span className="block text-xs text-ink-faint">{sublabel}</span>
        ) : null}
      </dt>
      <dd className="font-semibold tabular-nums">{formatBRL(valor)}</dd>
    </div>
  );
}

function LeadForm({ resumo }: { resumo: string }) {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    if (!nome.trim()) return setErro("Informe seu nome.");
    if (telefone.replace(/\D/g, "").length < 10)
      return setErro("Informe um telefone válido com DDD.");
    if (!email.includes("@")) return setErro("Informe um e-mail válido.");

    setLoading(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, telefone, email, resumo }),
      });
      if (!res.ok) throw new Error();
      setEnviado(true);
    } catch {
      setErro("Erro ao enviar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  if (enviado) {
    return (
      <div
        role="status"
        className="rounded-lg bg-brand-50 border border-brand-200 px-4 py-3 text-sm"
      >
        <p className="font-semibold text-brand-800">
          ✓ Solicitação enviada com sucesso!
        </p>
        <p className="text-brand-700 text-xs mt-1">
          Um advogado trabalhista parceiro entrará em contato em até 24 horas.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <input
          type="text"
          placeholder="Seu nome completo"
          aria-label="Nome completo"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="rounded-lg border border-brand-900/15 bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint/60 focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        <input
          type="tel"
          placeholder="(11) 99999-9999"
          aria-label="Telefone com DDD"
          value={telefone}
          onChange={(e) => setTelefone(maskTelefone(e.target.value))}
          className="rounded-lg border border-brand-900/15 bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint/60 focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        <input
          type="email"
          placeholder="seu@email.com"
          aria-label="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-lg border border-brand-900/15 bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint/60 focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>
      {erro ? (
        <p className="text-xs text-red-700 bg-red-50 rounded-md px-3 py-2" role="alert">
          {erro}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={loading}
        className="w-full sm:w-auto rounded-lg border border-brand-600 text-brand-700 hover:bg-brand-50 disabled:opacity-60 font-semibold text-sm px-5 py-2.5 transition-colors"
      >
        {loading ? "Enviando…" : "Solicitar análise gratuita"}
      </button>
      <p className="text-xs text-ink-faint">
        O resumo do seu cálculo será enviado junto. Seus dados são protegidos
        (LGPD) e não serão compartilhados além do parceiro que fará o contato.
      </p>
    </form>
  );
}

export default function RescisaoCalculator() {
  const [salario, setSalario] = useState("");
  const [dataAdmissao, setDataAdmissao] = useState("");
  const [dataDesligamento, setDataDesligamento] = useState("");
  const [motivo, setMotivo] = useState<MotivoRescisao>("sem_justa_causa");
  const [avisoPrevio, setAvisoPrevio] = useState<TipoAvisoPrevio>("indenizado");
  const [temFeriasVencidas, setTemFeriasVencidas] = useState(false);
  const [periodosVencidos, setPeriodosVencidos] = useState("1");
  const [erro, setErro] = useState<string | null>(null);
  const [resultado, setResultado] = useState<ResultadoRescisao | null>(null);
  const [showLead, setShowLead] = useState(false);

  function handleCalcular() {
    setErro(null);
    const salarioNum = parseSalario(salario);
    if (!salarioNum || salarioNum <= 0) {
      setErro("Informe um salário bruto válido.");
      return;
    }
    if (!dataAdmissao) {
      setErro("Informe a data de admissão.");
      return;
    }
    if (!dataDesligamento) {
      setErro("Informe a data de desligamento.");
      return;
    }
    const admissao = new Date(dataAdmissao + "T00:00:00");
    const desligamento = new Date(dataDesligamento + "T00:00:00");
    if (desligamento <= admissao) {
      setErro("A data de desligamento deve ser após a data de admissão.");
      return;
    }

    setResultado(
      calcularRescisao({
        salario: salarioNum,
        dataAdmissao: admissao,
        dataDesligamento: desligamento,
        motivo,
        avisoPrevio,
        feriasVencidasPeriodos: temFeriasVencidas
          ? Math.max(parseInt(periodosVencidos, 10) || 1, 1)
          : 0,
      })
    );
    setShowLead(false);
    setTimeout(() => {
      document
        .getElementById("resultado")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }

  const resumoLead = useMemo(() => {
    if (!resultado) return "";
    return [
      `Motivo: ${MOTIVO_LABEL[motivo]}`,
      `Admissão: ${dataAdmissao} · Desligamento: ${dataDesligamento}`,
      `Salário bruto: R$ ${salario}`,
      `Aviso prévio: ${avisoPrevio}`,
      `Férias vencidas: ${resultado.feriasVencidasPeriodos} período(s)`,
      `Total estimado: ${formatBRL(resultado.total)}`,
    ].join(" | ");
  }, [resultado, motivo, dataAdmissao, dataDesligamento, salario, avisoPrevio]);

  const inputClass =
    "w-full rounded-lg border border-brand-900/15 bg-white px-3.5 py-3 text-base text-ink focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-shadow";

  const avisoAplicavel = motivo === "sem_justa_causa";

  return (
    <section
      aria-label="Calculadora de rescisão trabalhista"
      className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(320px,400px)] gap-8 lg:gap-12 items-start"
    >
      {/* ── Formulário ── */}
      <div>
        <div className="mb-6">
          <label htmlFor="motivo" className="block text-sm font-semibold text-ink mb-1.5">
            Motivo da rescisão
          </label>
          <select
            id="motivo"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value as MotivoRescisao)}
            className={inputClass}
          >
            <option value="sem_justa_causa">
              Demissão sem justa causa (empresa demite)
            </option>
            <option value="pedido_demissao">
              Pedido de demissão (funcionário pede)
            </option>
            <option value="com_justa_causa">
              Demissão com justa causa (falta grave)
            </option>
            <option value="fim_experiencia">
              Fim de contrato de experiência
            </option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="admissao" className="block text-sm font-semibold text-ink mb-1.5">
              Data de admissão
            </label>
            <input
              id="admissao"
              type="date"
              value={dataAdmissao}
              max={dataDesligamento || undefined}
              onChange={(e) => setDataAdmissao(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="desligamento" className="block text-sm font-semibold text-ink mb-1.5">
              Data de desligamento
            </label>
            <input
              id="desligamento"
              type="date"
              value={dataDesligamento}
              min={dataAdmissao || undefined}
              onChange={(e) => setDataDesligamento(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="salario" className="block text-sm font-semibold text-ink mb-1.5">
            Salário mensal bruto
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint text-sm font-medium">
              R$
            </span>
            <input
              id="salario"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              placeholder="2.500,00"
              value={salario}
              onChange={(e) => setSalario(maskSalario(e.target.value))}
              className="w-full rounded-lg border border-brand-900/15 bg-white pl-11 pr-4 py-3 text-lg font-semibold text-ink tabular-nums placeholder:text-ink-faint/50 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-shadow"
            />
          </div>
        </div>

        <fieldset className="mb-6" disabled={!avisoAplicavel}>
          <legend className="text-sm font-semibold text-ink mb-2.5">
            Aviso prévio
            {!avisoAplicavel ? (
              <span className="ml-2 font-normal text-ink-faint text-xs">
                aplicável apenas na demissão sem justa causa
              </span>
            ) : null}
          </legend>
          <div className={`flex gap-2 ${!avisoAplicavel ? "opacity-40" : ""}`} role="radiogroup">
            {(
              [
                ["indenizado", "Indenizado"],
                ["trabalhado", "Trabalhado"],
              ] as const
            ).map(([value, label]) => {
              const selected = avisoPrevio === value;
              return (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setAvisoPrevio(value)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors border ${
                    selected
                      ? "bg-brand-950 text-white border-brand-950"
                      : "bg-white text-ink-soft border-brand-900/15 hover:border-brand-600 hover:text-brand-800"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </fieldset>

        <label className="flex items-start gap-3 mb-4 cursor-pointer select-none rounded-lg border border-brand-900/10 bg-brand-50 px-4 py-3">
          <input
            type="checkbox"
            checked={temFeriasVencidas}
            onChange={(e) => setTemFeriasVencidas(e.target.checked)}
            className="mt-1 h-4 w-4 accent-teal-700"
          />
          <span>
            <span className="block text-sm font-semibold text-ink">
              Tenho férias vencidas (não gozadas)
            </span>
            <span className="block text-xs text-ink-soft mt-0.5">
              Períodos aquisitivos completos que você não tirou. São pagos com
              1/3 em qualquer modalidade de rescisão.
            </span>
          </span>
        </label>

        {temFeriasVencidas ? (
          <div className="mb-6 max-w-[200px]">
            <label htmlFor="periodos" className="block text-sm font-semibold text-ink mb-1.5">
              Quantos períodos?
            </label>
            <select
              id="periodos"
              value={periodosVencidos}
              onChange={(e) => setPeriodosVencidos(e.target.value)}
              className={inputClass}
            >
              {["1", "2", "3"].map((n) => (
                <option key={n} value={n}>
                  {n} {n === "1" ? "período" : "períodos"}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        {erro ? (
          <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 mb-4" role="alert">
            {erro}
          </p>
        ) : null}

        <button
          type="button"
          onClick={handleCalcular}
          className="w-full rounded-lg bg-brand-950 hover:bg-brand-900 text-white font-bold text-base py-3.5 transition-colors"
        >
          Calcular rescisão
        </button>
      </div>

      {/* ── Recibo de resultado ── */}
      <div id="resultado" className="lg:sticky lg:top-6">
        <div className="bg-white rounded-t-xl shadow-[0_2px_16px_rgba(4,47,44,0.10)] px-6 pt-6 pb-8 receipt-edge">
          <div className="flex items-baseline justify-between mb-1">
            <p className="font-display text-sm font-bold uppercase tracking-[0.14em] text-brand-700">
              Verbas rescisórias
            </p>
            {resultado ? (
              <p className="text-xs text-ink-faint">
                {resultado.mesesContrato}{" "}
                {resultado.mesesContrato === 1 ? "mês" : "meses"}
              </p>
            ) : null}
          </div>
          <p className="text-xs text-ink-faint mb-5">
            {resultado
              ? MOTIVO_LABEL[motivo]
              : "preencha os dados e calcule"}
          </p>

          {resultado ? (
            <dl className="space-y-3 text-[15px]">
              <ReceiptLine
                label="Saldo de salário"
                sublabel={`${resultado.diasSaldo} dias trabalhados no mês`}
                valor={resultado.saldoSalario}
              />
              <ReceiptLine
                label="Aviso prévio indenizado"
                sublabel={
                  resultado.avisoPrevioIndenizado > 0
                    ? `${resultado.diasAvisoPrevio} dias (30 + 3 por ano, máx. 90)`
                    : motivo === "sem_justa_causa"
                    ? "aviso trabalhado — pago em folha"
                    : "não se aplica neste caso"
                }
                valor={resultado.avisoPrevioIndenizado}
                inativo={resultado.avisoPrevioIndenizado === 0}
              />
              <ReceiptLine
                label="13º proporcional"
                sublabel={`${resultado.avosDecimo}/12 avos`}
                valor={resultado.decimoTerceiro}
                inativo={motivo === "com_justa_causa"}
              />
              <ReceiptLine
                label="Férias proporcionais + 1/3"
                sublabel={`${resultado.avosFerias}/12 avos`}
                valor={resultado.feriasProporcionaisComTerco}
                inativo={motivo === "com_justa_causa"}
              />
              {resultado.feriasVencidasPeriodos > 0 ? (
                <ReceiptLine
                  label="Férias vencidas + 1/3"
                  sublabel={`${resultado.feriasVencidasPeriodos} período(s)`}
                  valor={resultado.feriasVencidasComTerco}
                />
              ) : null}
              <ReceiptLine
                label="Multa de 40% do FGTS"
                sublabel={
                  resultado.multaFgts > 0
                    ? "devida na demissão sem justa causa"
                    : "não se aplica neste caso"
                }
                valor={resultado.multaFgts}
                inativo={resultado.multaFgts === 0}
              />

              <div className="rule-dashed my-4" aria-hidden="true" />

              <div className="flex justify-between gap-4 text-sm">
                <dt className="text-ink-faint">
                  FGTS depositado (saque, fora do total)
                </dt>
                <dd className="tabular-nums text-ink-soft">
                  {formatBRL(resultado.fgtsEstimado)}
                </dd>
              </div>

              <div className="flex justify-between items-baseline gap-4 pt-1">
                <dt className="font-display font-bold text-ink">
                  Total rescisório
                </dt>
                <dd className="font-display text-3xl font-extrabold tabular-nums text-brand-700">
                  {formatBRL(resultado.total)}
                </dd>
              </div>

              <p className="text-xs text-ink-faint pt-1">
                Valores brutos, sem descontos de INSS e IRRF. Cálculo
                estimativo baseado na CLT.
              </p>
            </dl>
          ) : (
            <div className="py-8 text-center">
              <p className="font-display text-4xl font-extrabold text-brand-900/10 tabular-nums mb-3">
                R$ 0,00
              </p>
              <p className="text-sm text-ink-faint max-w-[26ch] mx-auto">
                Informe salário, datas e motivo para ver o breakdown das suas
                verbas.
              </p>
            </div>
          )}
        </div>

        {resultado ? (
          <div className="mt-6 space-y-5">
            <LegalWarningBR value={resultado.total} label="verbas rescisórias" />

            <div className="rounded-xl bg-brand-950 text-white p-5">
              <h3 className="font-display font-bold">Relatório PDF completo</h3>
              <p className="text-sm text-brand-100/70 mt-1 mb-4">
                Memória de cálculo detalhada, direitos explicados verba a verba
                e orientações para a homologação.
              </p>
              <CheckoutButton
                payload={{ product: "rescisao-pdf" }}
                consentLabel={CONSENT_LABEL}
                className="w-full rounded-lg bg-brand-400 hover:bg-brand-300 disabled:opacity-60 disabled:cursor-not-allowed text-brand-950 font-bold text-base py-3.5 transition-colors"
              >
                Baixar PDF completo — R$14,90
              </CheckoutButton>
              <p className="text-xs text-brand-100/50 mt-3 text-center">
                Pagamento processado pela Stripe.
              </p>
            </div>

            <div className="rounded-xl bg-white border border-brand-900/10 p-5">
              <h3 className="font-display font-bold text-brand-950">
                Quer que um advogado trabalhista revise seu caso?
              </h3>
              <p className="text-sm text-ink-soft mt-1 mb-4">
                Análise gratuita e sem compromisso. Enviamos o resumo do seu
                cálculo para agilizar.
              </p>
              {showLead ? (
                <LeadForm resumo={resumoLead} />
              ) : (
                <button
                  type="button"
                  onClick={() => setShowLead(true)}
                  className="rounded-lg border border-brand-600 text-brand-700 hover:bg-brand-50 font-semibold text-sm px-5 py-2.5 transition-colors"
                >
                  Quero a revisão gratuita
                </button>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
