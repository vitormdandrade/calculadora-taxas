export type MotivoRescisao =
  | "sem_justa_causa"
  | "com_justa_causa"
  | "pedido_demissao"
  | "fim_experiencia";

export type TipoAvisoPrevio = "trabalhado" | "indenizado";

export const MOTIVO_LABEL: Record<MotivoRescisao, string> = {
  sem_justa_causa: "Demissão sem justa causa",
  com_justa_causa: "Demissão com justa causa",
  pedido_demissao: "Pedido de demissão",
  fim_experiencia: "Fim de contrato de experiência",
};

export interface DadosRescisao {
  salario: number;
  dataAdmissao: Date;
  dataDesligamento: Date;
  motivo: MotivoRescisao;
  avisoPrevio: TipoAvisoPrevio;
  /** Períodos de férias vencidas (não gozadas). 0 quando não há. */
  feriasVencidasPeriodos: number;
}

export interface ResultadoRescisao {
  saldoSalario: number;
  diasSaldo: number;
  avisoPrevioIndenizado: number;
  diasAvisoPrevio: number;
  decimoTerceiro: number;
  avosDecimo: number;
  feriasProporcionaisComTerco: number;
  avosFerias: number;
  feriasVencidasComTerco: number;
  feriasVencidasPeriodos: number;
  /** Estimativa dos depósitos de FGTS — informativo, não entra no total. */
  fgtsEstimado: number;
  multaFgts: number;
  total: number;
  mesesContrato: number;
}

/** Meses completos entre duas datas (para tempo de contrato e FGTS). */
function mesesCompletos(inicio: Date, fim: Date): number {
  let meses =
    (fim.getFullYear() - inicio.getFullYear()) * 12 +
    (fim.getMonth() - inicio.getMonth());
  if (fim.getDate() < inicio.getDate()) meses -= 1;
  return Math.max(meses, 0);
}

/**
 * Avos (1/12) devidos entre duas datas: cada mês civil em que houve
 * fração superior a 14 dias trabalhados conta como um avo (CLT, art. 146).
 */
function contarAvos(inicio: Date, fim: Date): number {
  if (fim <= inicio) return 0;
  let avos = 0;
  const cursor = new Date(inicio.getFullYear(), inicio.getMonth(), 1);
  const ultimo = new Date(fim.getFullYear(), fim.getMonth(), 1);

  while (cursor <= ultimo) {
    const fimDoMes = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0);
    const de = inicio > cursor ? inicio : cursor;
    const ate = fim < fimDoMes ? fim : fimDoMes;
    const dias = ate.getDate() - de.getDate() + 1;
    if (dias >= 15) avos += 1;
    cursor.setMonth(cursor.getMonth() + 1);
  }
  return Math.min(avos, 12);
}

/** Último aniversário do período aquisitivo de férias antes do desligamento. */
function ultimoAniversario(admissao: Date, desligamento: Date): Date {
  const aniversario = new Date(
    desligamento.getFullYear(),
    admissao.getMonth(),
    admissao.getDate()
  );
  if (aniversario > desligamento) {
    aniversario.setFullYear(aniversario.getFullYear() - 1);
  }
  return aniversario < admissao ? admissao : aniversario;
}

export function calcularRescisao(dados: DadosRescisao): ResultadoRescisao {
  const {
    salario,
    dataAdmissao,
    dataDesligamento,
    motivo,
    avisoPrevio,
    feriasVencidasPeriodos,
  } = dados;

  const mesesContrato = mesesCompletos(dataAdmissao, dataDesligamento);

  // Saldo de salário: dias trabalhados no mês do desligamento (base 30 dias)
  const diasSaldo = Math.min(dataDesligamento.getDate(), 30);
  const saldoSalario = (salario / 30) * diasSaldo;

  // Aviso prévio: 30 dias + 3 por ano completo, limitado a 90 (Lei 12.506/2011).
  // Indenizado apenas na demissão sem justa causa; quando trabalhado, é pago
  // em folha durante o cumprimento.
  const anosCompletos = Math.floor(mesesContrato / 12);
  const diasAvisoPrevio = Math.min(30 + anosCompletos * 3, 90);
  const avisoPrevioIndenizado =
    motivo === "sem_justa_causa" && avisoPrevio === "indenizado"
      ? (salario / 30) * diasAvisoPrevio
      : 0;

  // 13º proporcional: avos no ano do desligamento (perde na justa causa)
  const inicioAnoDesligamento = new Date(dataDesligamento.getFullYear(), 0, 1);
  const inicioDecimo =
    dataAdmissao > inicioAnoDesligamento ? dataAdmissao : inicioAnoDesligamento;
  const avosDecimo = contarAvos(inicioDecimo, dataDesligamento);
  const decimoTerceiro =
    motivo !== "com_justa_causa" ? (salario / 12) * avosDecimo : 0;

  // Férias proporcionais + 1/3: avos desde o último período aquisitivo
  // (perde na justa causa — CLT, art. 146, parágrafo único)
  const avosFerias = contarAvos(
    ultimoAniversario(dataAdmissao, dataDesligamento),
    dataDesligamento
  );
  const feriasProporcionaisComTerco =
    motivo !== "com_justa_causa"
      ? (salario / 12) * avosFerias * (1 + 1 / 3)
      : 0;

  // Férias vencidas + 1/3: devidas em qualquer modalidade de rescisão
  const feriasVencidasComTerco =
    feriasVencidasPeriodos * salario * (1 + 1 / 3);

  // FGTS estimado (8% ao mês) — base da multa; o depósito em si fica na
  // conta vinculada do trabalhador e não compõe as verbas rescisórias
  const fgtsEstimado = salario * 0.08 * mesesContrato;
  const multaFgts = motivo === "sem_justa_causa" ? fgtsEstimado * 0.4 : 0;

  const total =
    saldoSalario +
    avisoPrevioIndenizado +
    decimoTerceiro +
    feriasProporcionaisComTerco +
    feriasVencidasComTerco +
    multaFgts;

  return {
    saldoSalario,
    diasSaldo,
    avisoPrevioIndenizado,
    diasAvisoPrevio,
    decimoTerceiro,
    avosDecimo,
    feriasProporcionaisComTerco,
    avosFerias,
    feriasVencidasComTerco,
    feriasVencidasPeriodos,
    fgtsEstimado,
    multaFgts,
    total,
    mesesContrato,
  };
}

export function formatBRL(valor: number): string {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
