// Creado por Diego Castro
// Ruta para obtener un usuario en la base de datos

import { API_URL } from "@/app/config/api";
import { NextRequest, NextResponse } from "next/server";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export async function POST(request: NextRequest) {
  // Obtener la sesión activa del usuario
  const body = await request.json();

  const id = body.id;
  const token = body.token;

  if (!id) {
    return NextResponse.json({ error: "Datos no válidos" }, { status: 500 });
  }

  // Validar el token de recuperación
  const tokenRes = await fetch(`${API_URL}/tokensrecuperacion/Validar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      token: token,
    }),
  });

  // Validar si el token es válido
  if (!tokenRes.ok) {
    return NextResponse.json(
      { error: "Link inválido o expirado" },
      { status: 401 },
    );
  }

  // Obtener el usuario desde la base de datos
  const res = await fetch(`${API_URL}/useremail/Listar/${id}`);

  if (!res.ok) {
    return NextResponse.json(
      { error: "Usuario no encontrado" },
      { status: 404 },
    );
  }

  const data = await res.json();

  // Retornar los datos del usuario
  return NextResponse.json({
    id: data.response.iD_UserEmail,
    correo: data.response.correoElectronico,
    relacion: data.response.relacion,
    iD_Rol: data.response.iD_Rol,
    usuario: data.response.usuarioCreador,
  });
}
