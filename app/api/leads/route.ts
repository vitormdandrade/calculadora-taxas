import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";

/*
 * Tabela esperada no Supabase:
 *
 *   create table if not exists rescisao_leads (
 *     id uuid primary key default gen_random_uuid(),
 *     nome text not null,
 *     telefone text not null,
 *     email text not null,
 *     resumo text,
 *     created_at timestamptz not null default now()
 *   );
 *
 * DDL versionado em supabase/rescisao_leads.sql
 */

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nome, telefone, email, resumo } = body ?? {};

    if (!nome?.trim() || !telefone || !email?.includes("@")) {
      return NextResponse.json(
        { error: "Informe nome, telefone e e-mail válidos." },
        { status: 400 }
      );
    }

    const supabase = getServiceClient();
    const { error } = await supabase.from("rescisao_leads").insert([
      {
        nome: String(nome).trim(),
        telefone: String(telefone).replace(/\D/g, ""),
        email: String(email).trim().toLowerCase(),
        resumo: resumo ? String(resumo).slice(0, 2000) : null,
      },
    ]);

    if (error) {
      console.error("[leads] supabase insert failed", error);
      return NextResponse.json(
        { error: "Erro ao salvar seus dados." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[leads] request failed", err);
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}
