# Calculadora de Taxas

Calculadora de taxas, comissões e lucro para vendedores de marketplace no
Brasil — Shopee, Mercado Livre, Amazon e Magalu.

- **Grátis:** cálculo individual por plataforma/categoria, sem cadastro.
- **Modo Pro (R$39,90, pagamento único via Stripe):** cálculo em lote via CSV
  (processado no navegador), comparação lado a lado das 4 plataformas,
  download de planilha de análise e ponto de equilíbrio.

## Stack

Next.js 14 (App Router) · TypeScript · Tailwind CSS 3 · Stripe · pnpm · Vercel.

## Rodando

```bash
pnpm install
cp .env.example .env.local   # preencha as chaves da Stripe
pnpm dev
```

`pnpm build` precisa passar sem variáveis de ambiente — o cliente Stripe é
instanciado de forma lazy em request time (`lib/stripe.ts`).

## Arquitetura de acesso Pro

Sem banco de dados: o `session_id` do Stripe Checkout funciona como token de
acesso. `/pro` e `/sucesso` re-verificam a sessão contra a API da Stripe a
cada visita (`lib/pro.ts`). O webhook (`/api/webhook`) apenas registra a
compra para reconciliação.

## Tabelas de taxas

Hardcoded em `lib/fees.ts`, conforme informações oficiais das plataformas em
Julho/2026. Atualize lá quando as plataformas mudarem as comissões.
