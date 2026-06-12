/**
 * Llamar desde el flujo de cambio de contraseña una vez que el .NET confirme
 * el cambio exitoso. Desbloquea la cuenta en memoria.
 * Creado por Diego
 */

import { NextRequest, NextResponse } from "next/server";
import { desbloquearCuenta } from "@/app/utils/conteoLogin";

export async function POST(req: NextRequest) {
  let body: { usuario?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { status: 400, message: "Body inválido", response: null },
      { status: 400 },
    );
  }

  const { usuario } = body;

  if (!usuario) {
    return NextResponse.json(
      { status: 400, message: "El campo usuario es requerido", response: null },
      { status: 400 },
    );
  }

  desbloquearCuenta(usuario);

  return NextResponse.json(
    {
      status: 200,
      message: "Cuenta desbloqueada exitosamente",
      response: null,
    },
    { status: 200 },
  );
}
