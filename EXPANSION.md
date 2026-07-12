# ResolveKit — Expansion Strategy

**Última atualização:** 12 de julho de 2026
**Objetivo:** consolidar os 6 produtos standalone (Vercel apps separados) como subpaths de resolvekit.com.br, transformando um portfólio fragmentado em um hub único com marca, SEO e receita compartilhados.

## Por que consolidar

- **SEO composto:** cada produto standalone constrói autoridade de domínio isolada em `*.vercel.app` (praticamente zero). Como subpath, cada ferramenta herda e alimenta a autoridade de resolvekit.com.br.
- **Cross-sell nativo:** usuário que calcula rescisão é candidato à carta de cobrança; quem consulta CNPJ é candidato ao contrato de serviço. Hoje esses funis não se conectam.
- **Assinatura viável:** o plano ResolveKit Pro (R$19,90/mês) só faz sentido se as ferramentas estiverem sob o mesmo teto, checkout e sessão.
- **Compliance centralizado:** um único `/termos`, `/privacidade`, `DisclaimerBanner` e `LegalWarningBR` protegem todos os produtos, em vez de replicar (ou esquecer) proteções em 7 repositórios.

## Fase 1 — Legal Hardening ✅ (concluída nesta iteração)

- `DisclaimerBanner` (variantes legal/financeira/educacional) e `LegalWarningBR` (limiar R$20.000) criados como componentes reutilizáveis.
- `/termos` (não é assessoria jurídica, indenização, limitação de responsabilidade, LGPD, foro SP) e `/privacidade` (LGPD) publicados.
- Checkboxes obrigatórios de consentimento no checkout do Modo Pro e nos planos de assinatura.
- Badges de risco (🟢 Educacional / 🟡 Simulação / 🔴 Documento Legal) em todos os cards do hub.

**Regra permanente:** nenhuma ferramenta migra para o hub sem passar pelo checklist legal — disclaimer em toda etapa do wizard, checkbox antes do pagamento, aviso de jurisdição, link para `/termos`.

## Fase 2 — Migrar Rescisão Trabalhista → `/rescisao`

**Prazo estimado:** semanas 1–3 · **Risco do produto:** 🔴 alto (cálculo CLT; erro = dano financeiro real)

- Portar o wizard de cálculo do repo `mc-rescisao-trabalhista` para `app/rescisao/`.
- Migrar o checkout do PDF (R$14,90) para o `/api/checkout` existente (novo `price_id`), e incluir a ferramenta no gate do ResolveKit Pro.
- **Mitigação de risco:**
  - `DisclaimerBanner variant="financial" riskLevel="high"` em todas as etapas; texto explícito: "cálculo estimativo — confirme com contador ou advogado trabalhista".
  - `LegalWarningBR` no resultado (verbas rescisórias frequentemente excedem R$20.000).
  - Data de vigência das tabelas (INSS, IRRF, salário mínimo) exibida no resultado e no PDF.
  - Redirect 301 do domínio antigo por no mínimo 12 meses.

## Fase 3 — Migrar Carta de Cobrança → `/cobranca`

**Prazo estimado:** semanas 3–5 · **Risco do produto:** 🔴 alto (linguagem jurídica; risco de exercício ilegal da advocacia)

- Portar o gerador do repo `mc-carta-cobranca` para `app/cobranca/`; checkout R$9,90 no fluxo Stripe do hub.
- **Mitigação de risco:**
  - Reposicionar o copy: "modelo de carta" (nunca "notificação extrajudicial" como serviço prestado).
  - Remover do template qualquer assinatura que sugira representação legal; o remetente é sempre o próprio usuário.
  - Checkbox obrigatório antes do download: "entendo que este é um modelo e não constitui assessoria jurídica".
  - `LegalWarningBR` quando o valor cobrado exceder R$20.000 (recomendar advogado para cobrança judicial).

## Fase 4 — Migrar CNPJ Radar → `/cnpj`

**Prazo estimado:** semanas 5–7 · **Risco do produto:** 🟡 médio (dados públicos desatualizados → risco de alegação de difamação)

- Portar consulta do repo `mc-cnpj-radar` para `app/cnpj/`; checkout R$4,90 avulso + incluído no Pro.
- **Mitigação de risco:**
  - Timestamp "dados consultados em {data} na fonte {fonte}" em todo resultado e PDF.
  - Disclaimer fixo: "dados públicos podem estar desatualizados; não use como única base para decisão de crédito".
  - Processo de correção/remoção documentado em `/privacidade` (LGPD aplica-se a dados de sócios pessoas físicas).

## Fase 5 — Migrar Contrato de Aluguel → `/contrato-aluguel`

**Prazo estimado:** semanas 7–10 · **Risco do produto:** 🔴 crítico (documento com efeito vinculante; Lei 8.906/94)

- Última migração deliberadamente: exige o hardening mais rigoroso e serve de template para o Contrato Freela depois.
- **Mitigação de risco:**
  - `DisclaimerBanner variant="legal" riskLevel="high"` em **cada etapa** do wizard, sem exceção.
  - Checkbox obrigatório antes da geração E antes do download (dupla confirmação para documento vinculante).
  - Aviso de jurisdição: "modelo baseado na Lei do Inquilinato (8.245/91) federal; exigências estaduais/municipais e de cartório podem variar".
  - `LegalWarningBR` quando aluguel anualizado ou caução exceder R$20.000.
  - Revisão anual do template por advogado contratado (custo estimado: R$2.000–4.000/ano) — barato comparado ao risco.

## Fase 6 — Google Ads para a marca ResolveKit

**Prazo estimado:** a partir da semana 8 (após 3+ ferramentas no hub)

- Campanhas de search em intenção transacional: "calculadora rescisão CLT", "modelo carta de cobrança", "taxa shopee 2026", "consultar cnpj protestos".
- Orçamento inicial: R$1.500/mês, teto de CPA de R$8 para produtos avulsos e R$25 para assinatura.
- Landing = a própria ferramenta (grátis na entrada, upsell Pro no resultado) — o modelo freemium já validado na Calculadora de Taxas.
- **Atenção legal em anúncios:** nunca anunciar como "advocacia", "jurídico" ou "contabilidade"; usar "modelo", "calculadora", "simulador". Google Ads pode exigir verificação para anúncios de serviços financeiros — manter copy no enquadramento educacional.

## Fase 7 — Programa de afiliados (blogs → ResolveKit)

**Prazo estimado:** a partir da semana 12

- Os três sites de conteúdo próprios (Oráculo do MEI, Comparar SaaS, Calcula Seguro) tornam-se o piloto do programa: links rastreados (UTM + cupom) para o hub.
- Abrir depois para blogs de contabilidade/MEI terceiros: comissão de 30% na primeira mensalidade ou 20% em produtos avulsos, via cupom dedicado.
- Materiais prontos para afiliados (banners, textos) já com os disclaimers embutidos — afiliado não pode prometer "resolva sua rescisão sem advogado".

## Projeção de receita (cenário conservador)

| Mês | Marco | MRR estimado |
|-----|-------|--------------|
| M1 | Hub atual (taxas + assinatura) | R$300–600 |
| M2 | + Rescisão no hub | R$800–1.500 |
| M3 | + Cobrança + CNPJ | R$1.500–2.500 |
| M4 | + Contrato Aluguel + Ads ativos | R$2.500–4.500 |
| M6 | + Afiliados maduros | R$5.000–8.000 |

Premissas: conversão free→pago de 1,5–2,5% (benchmark atual da Calculadora), ticket médio avulso R$12, 60% da receita nova vindo de assinaturas a partir do M4. Revisar mensalmente contra dados reais do Stripe.

## Riscos transversais

- **Regressão de SEO na migração:** manter redirects 301 dos domínios `*.vercel.app` antigos por 12+ meses; migrar uma ferramenta por vez e monitorar Search Console por 2 semanas antes da próxima.
- **Acoplamento de deploy:** um bug no hub agora derruba todas as ferramentas. Mitigar com preview deployments obrigatórios e smoke test das rotas críticas (`/`, `/marketplace`, `/api/webhook`) antes de promover.
- **Risco jurídico residual:** o hardening da Fase 1 reduz mas não elimina. Contratar revisão jurídica pontual antes de lançar as Fases 3 e 5 (documentos vinculantes) e formalizar CNPJ/contrato social adequados à operação.
- **Dependência da Stripe:** único processador. Aceitável por ora; reavaliar Pix direto (menor taxa) quando MRR > R$5.000.
