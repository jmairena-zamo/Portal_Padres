import { API_URL } from "@/app/config/api";
import { NextRequest, NextResponse } from "next/server";

//POST /api/menu/asignarMenuRol
//Asigna un rol a un menu
//Crea el registro en la tabla Tbl_Menu_Rol
export async function POST(request: NextRequest) {
  //Requiere sesion activa; Se obtiene la sesion activa
  const session = request.cookies.get("session");

  if (!session) {
    return NextResponse.json({ error: "No hay sesion" }, { status: 400 });
  }

  const usuarioData = JSON.parse(session.value);
  const usuario = usuarioData.email;

  const body = await request.json();

  const res = await fetch(`${API_URL}/menurol/Crear`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      menu_ID: body.menu_ID,
      rol_ID: body.rol_ID,
      usuario: usuario,
    }),
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: "Error al asignar Rol" },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}

//PUT /api/menu/asignarMenuRol
//Activa o desactiva un rol en un menu
export async function PUT(request: NextRequest) {
  //Requiere sesion activa; Se obtiene la sesion activa
  const session = request.cookies.get("session");

  if (!session) {
    return NextResponse.json({ error: "No hay sesion" }, { status: 400 });
  }

  const usuarioData = JSON.parse(session.value);
  const usuario = usuarioData.email;

  const body = await request.json();

  const res = await fetch(`${API_URL}/menurol/Actualizar`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      iD_Menu_Rol: body.iD_Menu_Rol,
      habilitado: body.habilitado,
      usuario: usuario,
    }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Error al quitar Rol" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
