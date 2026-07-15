// Creado por Diego Castro
// Ruta para actualizar un rol en la base de datos

import { API_URL } from "@/app/config/api";
import { NextResponse, NextRequest } from "next/server";

export async function PUT(request: NextRequest) {
  const body = await request.json();

  // Validar que el body contenga los campos necesarios
  if (!body.iD_Rol || !body.rol) {
    return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
  }
  const res = await fetch(`${API_URL}/roles/Actualizar/${body.iD_Rol}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      rol: body.rol,
      usuario: "STRING",
    }),
  });

  if (!res.ok)
    return NextResponse.json({ error: "Error al crear Rol" }, { status: 500 });

  return NextResponse.json({ ok: true });
}
