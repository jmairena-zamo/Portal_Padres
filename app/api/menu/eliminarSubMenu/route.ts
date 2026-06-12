//Creado pr Diego Castro

import { API_URL } from "@/app/config/api";
import { NextResponse, NextRequest } from "next/server";

//DELETE /api/menu/eliminarSubMenu
//Eliminar submenu por su ID
export async function DELETE(request: NextRequest) {
  //Requiere sesion activa; Se obtiene la sesion activa
  const session = request.cookies.get("session");

  if (!session) {
    return NextResponse.json({ error: "No hay sesion" }, { status: 400 });
  }

  const usuarioData = JSON.parse(session.value);
  const usuario = usuarioData.email;

  const body = await request.json();

  const { iD_SubMenu } = body;

  const res = await fetch(`${API_URL}/submenu/Eliminar`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      iD_SubMenu: iD_SubMenu,
      usuario: usuario,
    }),
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: "Error al Crear Queja o Sugerencia" },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
