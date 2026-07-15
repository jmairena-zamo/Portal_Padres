// Creado por Diego Castro
// Componente para enviar correo de recuperación de contraseña

import { NextResponse, NextRequest } from "next/server";
import { Resend } from "resend";
import { recuperarContrasenaSchema } from "@/app/utils/validations";
import { API_URL } from "@/app/config/api";
import { enviarCorreoRecuperarCon } from "@/app/services/correoRecuperarCon";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const resend = new Resend(process.env.RESEND_API_KEY);

// Endpoint para enviar correo de recuperación de contraseña
export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = recuperarContrasenaSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const { correo } = parsed.data;

  const correoLimpio = correo.trim();

  try {
    const res = await fetch(
      `${API_URL}/useremail/ListarPorCorreo/${correoLimpio}`,
    );

    if (!res.ok) {
      return NextResponse.json(
        { message: "Correo no válido" },
        { status: 401 },
      );
    }

    const data = await res.json();
    const saveData = {
      id: data.response.iD_UserEmail,
      email: data.response.correoElectronico,
    };

    const id = data.response.iD_UserEmail;
    const token = crypto.randomUUID();

    // Guardar el token en la base de datos
    const tokenRes = await fetch(`${API_URL}/tokensrecuperacion/Crear`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userEmail_ID: id,
        token: token,
      }),
    });

    // Manejo de errores en la respuesta del servidor
    if (!tokenRes.ok) {
      const errorBody = await tokenRes.text();
      console.error("Token error:", tokenRes.status, errorBody);
      return NextResponse.json(
        { message: "Error al generar el token de recuperación" },
        { status: 500 },
      );
    }

    const linkReset = `http://localhost:3000/cambiarContrasena?token=${token}&id=${id}`;

    // Enviar correo de recuperación de contraseña
    enviarCorreoRecuperarCon({
      nombreUsuario: saveData.email,
      urlCambioContrasena: linkReset,
    }).catch((err) =>
      console.error(
        "[login] No se pudo enviar correo de recuperar contraseña:",
        err,
      ),
    );

    return NextResponse.json(
      { message: "Email enviado correctamente." },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: `Error al conectar con el servidor ${error}` },
      { status: 500 },
    );
  }
}
