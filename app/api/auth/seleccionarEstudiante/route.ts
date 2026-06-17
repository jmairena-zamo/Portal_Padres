// Creado por Diego Castro
// Registra el ingreso cuando selecciona un estudiante

import { NextRequest, NextResponse } from "next/server";
import { registrarIngreso } from "@/app/services/registrarIngreso";

if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

export async function POST(request: NextRequest) {
  const session = request.cookies.get("session");
  if (!session) {
    return NextResponse.json({ error: "Sin sesión activa" }, { status: 401 });
  }

  const usuario = JSON.parse(session.value);
  const { bannerID } = await request.json();

  await registrarIngreso(usuario.id, bannerID, usuario.email);

  return NextResponse.json({ ok: true });
}
