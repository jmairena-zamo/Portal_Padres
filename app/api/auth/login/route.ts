// Creado por Diego Castro

import { loginSchema } from "@/app/utils/validations";
import { NextRequest, NextResponse } from "next/server";
import rateLimit from "@/app/utils/rateLimits";
import { enviarCorreoBloqueo } from "@/app/services/correoBloqueado";
import { API_URL } from "@/app/config/api";
import { registrarIngreso } from "@/app/services/registrarIngreso";

// POST /api/auth/login
// Autentica al usuario con correo y contraseña
// Crea una cookie httpOnly si las credenciales son válidas
// Capa 1: rate limit por IP — 10 intentos en 15 min
// Capa 2: bloqueo de cuenta por intentos fallidos — controlado con campo habilitado en BD

if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

const MAX_INTENTOS = 3;
const VENTANA_MS = 1 * 60 * 1000;

// Conteo de intentos fallidos en memoria por correo.
// Solo se usa para contar
// Se reinicia al hacer login exitoso o al bloquear la cuenta.
interface RegistroIntentos {
  cantidad: number;
  primerIntento: number; // timestamp en ms
}
const intentosFallidos = new Map<string, RegistroIntentos>();

// Tipado del objeto usuario que devuelve el backend
interface Usuario {
  iD_UserEmail: number;
  correoElectronico: string;
  relacion: string;
  habilitado: number;
  iD_Rol: number;
  contrasena: string;
}

/**
 * Llama al PUT del backend para actualizar el campo habilitado del usuario.
 * Envía el objeto completo que devolvió ListarPorCorreo con habilitado modificado.
 * Nota: el backend maneja contraseña en texto plano — esto es responsabilidad del equipo .NET.
 */
async function actualizarHabilitado(
  usuario: Usuario,
  habilitado: 0 | 1,
): Promise<boolean> {
  try {
    const res = await fetch(
      `${API_URL}/useremail/Actualizar/${usuario.iD_UserEmail}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...usuario, habilitado }),
      },
    );
    return res.ok;
  } catch (err) {
    console.error("[login] Error al actualizar habilitado:", err);
    return false;
  }
}

// Registra un intento fallido de login para el correo dado.
function registrarIntento(correo: string): number {
  const ahora = Date.now();
  const registro = intentosFallidos.get(correo);

  // Sin registro previo, o la ventana de 1 hora ya expiró → reiniciar
  if (!registro || ahora - registro.primerIntento > VENTANA_MS) {
    intentosFallidos.set(correo, { cantidad: 1, primerIntento: ahora });
    return 1;
  }

  // Dentro de la ventana → incrementar
  registro.cantidad += 1;
  intentosFallidos.set(correo, registro);
  return registro.cantidad;
}

export async function POST(request: NextRequest) {
  // ── Capa 1: rate limit por IP ──────────────────────────────────────────────
  const limitResult = rateLimit(request, 10, 15 * 60 * 1000);
  if (limitResult) return limitResult;

  // ── Validación Zod ─────────────────────────────────────────────────────────
  const body = await request.json();
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const correoLimpio = parsed.data.correo.trim().toLowerCase();
  const contrasenaLimpia = parsed.data.contrasena.trim();

  try {
    // ── Obtener usuario del backend ──────────────────────────────────────────
    const res = await fetch(
      `${API_URL}/useremail/ListarPorCorreo/${correoLimpio}`,
    );

    // Correo no encontrado
    // no se cuentan intentos todavia, solo se verifica que exista el correo
    if (!res.ok) {
      return NextResponse.json(
        { error: "Correo o Contraseña Incorrectos" },
        { status: 401 },
      );
    }

    const data = await res.json();
    const usuario: Usuario = data.response;

    // ── Capa 2: verificar si la cuenta está bloqueada en BD ──────────────────
    if (usuario.habilitado === 0) {
      return NextResponse.json(
        {
          error:
            "Tu cuenta está bloqueada por múltiples intentos fallidos. " +
            "Revisa tu correo para restablecer tu contraseña.",
        },
        { status: 403 },
      );
    }

    // ── Contraseña incorrecta → contar intento ───────────────────────────────
    if (contrasenaLimpia !== usuario.contrasena) {
      const intentosActuales = registrarIntento(correoLimpio);
      // const intentosRestantes = MAX_INTENTOS - intentosActuales;

      // ── Límite alcanzado: bloquear en BD y enviar correo ───────────────────
      if (intentosActuales >= MAX_INTENTOS) {
        const id = usuario.iD_UserEmail;
        const token = crypto.randomUUID();
        const tokenRes = await fetch(`${API_URL}/tokensrecuperacion/Crear`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userEmail_ID: id,
            token: token,
          }),
        });

        if (!tokenRes.ok) {
          return NextResponse.json(
            { message: "Error al generar el token de recuperación" },
            { status: 500 },
          );
        }
        const linkReset = `http://localhost:3000/cambiarContrasena?token=${token}&id=${id}`;
        intentosFallidos.delete(correoLimpio); // limpiar conteo en memoria

        // Bloquear en BD (habilitado → 0)
        const bloqueadaOk = await actualizarHabilitado(usuario, 0);

        if (!bloqueadaOk) {
          // Si falla el PUT, igual avisamos pero no bloqueamos la UX
          console.error(
            `[login] No se pudo bloquear en BD la cuenta: ${correoLimpio}`,
          );
        }

        // Enviar correo — fire & forget para no retrasar la respuesta
        enviarCorreoBloqueo({
          nombreUsuario: usuario.correoElectronico,
          urlCambioContrasena: linkReset,
        }).catch((err) =>
          console.error("[login] No se pudo enviar correo de bloqueo:", err),
        );

        return NextResponse.json(
          {
            error:
              "Has superado el límite de intentos. Tu cuenta ha sido bloqueada. " +
              "Te enviamos un correo para restablecer tu contraseña.",
          },
          { status: 403 },
        );
      }

      // Aún quedan intentos
      return NextResponse.json(
        {
          error: "Correo o Contraseña Incorrectos",
          // error: `Correo o Contraseña Incorrectos. Te ${intentosRestantes === 1 ? "queda" : "quedan"} ${intentosRestantes} intento${intentosRestantes !== 1 ? "s" : ""}.`,
        },
        { status: 401 },
      );
    }

    // ── Login exitoso ────────────────────────────────────────────────────────
    intentosFallidos.delete(correoLimpio); // limpiar conteo si había intentos previos

    // let bannerID: number | null;

    // Intentamos obtener el nombre del rol desde el API para no depender del id
    let rolNombre: string | null = null;
    try {
      const resRoles = await fetch(`${API_URL}/roles/Listar`);
      if (resRoles.ok) {
        const rolesData = await resRoles.json();
        const rolesList: { iD_Rol: number; rol: string }[] =
          rolesData.response || [];
        const match = rolesList.find((r) => r.iD_Rol === usuario.iD_Rol);
        rolNombre = match ? match.rol : null;
      }
    } catch (err) {
      console.error("[login] No se pudo obtener lista de roles:", err);
    }

    // Si el rol corresponde a administrador (según nombre), bannerID es nulo
    const adminNames = ["administrador", "admin"];
    const isAdminRole =
      rolNombre && adminNames.includes(rolNombre.trim().toLowerCase());

    const bannerID = isAdminRole ? null : 27027;

    const saveData = {
      id: usuario.iD_UserEmail,
      email: usuario.correoElectronico,
      iD_Rol: usuario.iD_Rol,
      rolNombre: rolNombre,
      bannerID: bannerID,
    };

    // Registrar ingreso inicial al sistema
    await registrarIngreso(
      usuario.iD_UserEmail,
      bannerID,
      usuario.correoElectronico,
    );

    // console.log(saveData);

    const response = NextResponse.json({ ok: true });

    // Cookie httpOnly con duración de 30 minutos; secure solo en producción
    response.cookies.set("session", JSON.stringify(saveData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("[login] Error al conectar con la API:", error);
    return NextResponse.json(
      { error: "Error al conectar con el servidor" },
      { status: 500 },
    );
  }
}
