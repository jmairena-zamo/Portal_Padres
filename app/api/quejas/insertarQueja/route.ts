// Creado por Diego Castro
// Inserta una nueva queja o sugerencia en la base de datos

import { NextRequest, NextResponse } from "next/server";
import { quejaSchema } from "@/app/utils/validations";
import { API_URL } from "@/app/config/api";

export async function POST(request: NextRequest) {
  // Obtener los datos del body de la solicitud
  const body = await request.json();
  const parsed = quejaSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const { telefono, tipo, asunto, mensaje } = parsed.data;

  // Obtener la sesión activa del usuario
  const session = request.cookies.get("session");

  if (!session) {
    return NextResponse.json({ error: "No hay sesion" }, { status: 400 });
  }

  const usuarioData = JSON.parse(session.value);
  const ID_UserEmail = usuarioData.id;
  const usuario = usuarioData.email;

  // Crear la queja o sugerencia en la base de datos
  try {
    const res = await fetch(`${API_URL}/quejassugerencias/Crear`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        iD_UserEmail: ID_UserEmail,
        telefono: telefono,
        tipo: tipo,
        asunto: asunto,
        mensaje: mensaje,
        usuario: usuario,
      }),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Error al Crear Queja o Sugerencia" },
        { status: 500 },
      );
    }

    // Retornar una respuesta exitosa
    return NextResponse.json({
      message: "Queja o Sugerencia Creada Correctamente",
    });
  } catch {
    return NextResponse.json(
      { error: "Error al conectar con el servidor" },
      { status: 500 },
    );
  }
}
