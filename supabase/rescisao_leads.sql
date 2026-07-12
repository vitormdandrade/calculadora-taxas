-- Leads da calculadora de rescisão (/rescisao)
-- Executar no SQL Editor do projeto Supabase compartilhado.
create table if not exists rescisao_leads (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  telefone text not null,
  email text not null,
  resumo text,
  created_at timestamptz not null default now()
);

alter table rescisao_leads enable row level security;
-- Sem policies: apenas a service role (API /api/leads) lê e escreve.
