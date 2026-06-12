//Creado por Diego Castro

import { API_URL } from "@/app/config/api";
import { menuSchema } from "@/app/utils/validations";
import { NextRequest, NextResponse } from "next/server";

//POST /api/menu/crearMenu
//Crear una opcion de menu
export async function POST(request: NextRequest) {
  //Requiere sesion activa; Se obtiene la sesion activa
  const session = request.cookies.get("session");

  if (!session) {
    return NextResponse.json({ error: "No hay sesion" }, { status: 400 });
  }

  const usuarioData = JSON.parse(session.value);
  const usuario = usuarioData.email;

  const body = await request.json();

  //validar el body con Zod
  // Zod espera number; el form envía string
  const datosParseados = {
    ...body,
    posicion: Number(body.posicion),
  };

  const parsed = menuSchema.safeParse(datosParseados);

  if (!parsed.success) {
    console.log("Error Zod:", parsed.error);
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const { opcion, posicion, icono } = parsed.data;

  const res = await fetch(`${API_URL}/menu/Crear`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      opcion: opcion,
      posicion: posicion,
      icono: icono,
      habilitado: 0, //deshabilitado por defecto al crear
      estado: 1, //activado por defecto
      usuario: usuario,
    }),
  });

  if (!res.ok)
    return NextResponse.json({ error: "Error al crear Menu" }, { status: 500 });

  return NextResponse.json({ ok: true });
}
