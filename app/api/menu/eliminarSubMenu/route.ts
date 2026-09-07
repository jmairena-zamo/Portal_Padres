// Creado pr Diego Castro
// Elimina un submenu de la base de datos

import { API_URL } from "@/app/config/api";
import { eliminarsubMenuSchema } from "@/app/utils/validations";
import { NextResponse, NextRequest } from "next/server";

//DELETE /api/menu/eliminarSubMenu
//Eliminar submenu por su ID
export async function DELETE(request: NextRequest) {
  //Requiere sesion activa; Se obtiene la sesion activa
  const session = request.cookies.get("session");

  if (!session) {
    return NextResponse.json({ error: "No hay sesion" }, { status: 400 });
  }

  let usuario: string;
  try {
    const usuarioData = JSON.parse(session.value);
    usuario = usuarioData.email;

    if (!usuario) {
      throw new Error("Datos de sesión incompletos");
    }
  } catch {
    return NextResponse.json(
      { error: "Sesión inválida o corrupta" },
      { status: 401 },
    );
  }

  const body = await request.json();
  const parsed = eliminarsubMenuSchema.safeParse(body);

  if (!parsed.success) {
    console.log("Error Zod:", parsed.error);
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const { iD_SubMenu } = parsed.data;

  // Eliminar el submenu en la base de datos
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
