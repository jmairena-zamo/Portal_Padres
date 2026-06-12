import { NextRequest, NextResponse } from "next/server";
import { nuevaContrasenaSchema } from "@/app/utils/validations";
import { API_URL } from "@/app/config/api";

export async function PUT(request: NextRequest) {
  const body = await request.json();

  const parsed = nuevaContrasenaSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const {
    id_useremail,
    correoElectronico,
    contrasena,
    relacion,
    iD_Rol,
    usuario,
    token,
  } = parsed.data;

  try {
    //Revalidar el token antes de cambiar
    const tokenRes = await fetch(`${API_URL}/tokensrecuperacion/Validar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: token,
      }),
    });

    if (!tokenRes.ok) {
      return NextResponse.json(
        { error: "Link inválido o expirado" },
        { status: 401 },
      );
    }

    //Actualizar la contraseña
    const res = await fetch(`${API_URL}/useremail/actualizar/${id_useremail}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        correoElectronico: correoElectronico,
        relacion: relacion,
        iD_Rol: iD_Rol,
        contrasena: contrasena,
        usuario: usuario,
        habilitado: 1,
      }),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Error al actualizar contraseña" },
        { status: 500 },
      );
    }

    //Marcar token como usado
    await fetch(`${API_URL}/tokensrecuperacion/MarcarUsado`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: token }),
    });

    return NextResponse.json({
      message: "Contraseña actualizada correctamente",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al conectar con el servidor" },
      { status: 500 },
    );
  }
}
