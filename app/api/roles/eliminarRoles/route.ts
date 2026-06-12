import { API_URL } from "@/app/config/api";
import { NextResponse, NextRequest } from "next/server";

export async function DELETE(request: NextRequest) {
  const session = request.cookies.get("session");

  if (!session) {
    return NextResponse.json({ error: "No hay sesion" }, { status: 400 });
  }

  const usuarioData = JSON.parse(session.value);
  const usuario = usuarioData.email;

  const body = await request.json();

  const { iD_Rol } = body;

  const res = await fetch(`${API_URL}/roles/Eliminar`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      iD_Rol: iD_Rol,
      usuario: usuario,
    }),
  });

  if (!res.ok)
    return NextResponse.json(
      { error: "Error al eliminar Rol" },
      { status: 500 },
    );

  return NextResponse.json({ ok: true });
}
