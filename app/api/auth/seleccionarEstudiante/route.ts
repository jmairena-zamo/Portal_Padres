// Creado por Diego Castro
// Registra el ingreso cuando selecciona un estudiante

import { NextRequest, NextResponse } from "next/server";
import { registrarIngreso } from "@/app/services/registrarIngreso";

if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

export async function POST(request: NextRequest) {
  // Validar que exista una sesión activa
  const session = request.cookies.get("session");
  if (!session) {
    return NextResponse.json({ error: "Sin sesión activa" }, { status: 401 });
  }

  // Validar que el cuerpo de la solicitud contenga el bannerID
  const usuario = JSON.parse(session.value);
  const { bannerID } = await request.json();
  if (!bannerID) {
    return NextResponse.json(
      { error: "Banner ID es requerido" },
      { status: 400 },
    );
  }
  usuario.bannerID = bannerID;

  // Registrar el ingreso del usuario con el bannerID seleccionado
  const response = NextResponse.json({ ok: true });
  response.cookies.set("session", JSON.stringify(usuario), {
    httpOnly: true,
    secure: true,
    maxAge: 60 * 30,
    path: "/",
  });

  await registrarIngreso(usuario.id, bannerID, usuario.email);

  return response;
}
