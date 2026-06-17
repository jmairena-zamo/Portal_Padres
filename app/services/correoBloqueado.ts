// Creado por Diego Castro
// Template del correo enviado cuando se bloquea una cuenta por intentos fallidos.
// Utiliza Resend

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface OpcionesCorreoBloqueo {
  nombreUsuario: string;
  // URL completa del endpoint/página de cambio de contraseña
  urlCambioContrasena: string;
}

/**
 * Envía el correo de cuenta bloqueada con el enlace para restablecer contraseña.
 * Retorna true si se envió correctamente, false si hubo error.
 */
export async function enviarCorreoBloqueo({
  nombreUsuario,
  urlCambioContrasena,
}: OpcionesCorreoBloqueo): Promise<boolean> {
  try {
    const { error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "practicanteit_2@zamorano.edu",
      subject: "Cuenta bloqueada — Portal de Padres Zamorano",
      html: plantillaHTML({ nombreUsuario, urlCambioContrasena }),
    });

    if (error) {
      console.error("[enviarCorreoBloqueo] Error de Resend:", error);
      return false;
    }

    return true;
  } catch (err) {
    console.error("[enviarCorreoBloqueo] Excepción inesperada:", err);
    return false;
  }
}

// ─── HTML del correo ────────────────────────────────────────────────────────

function plantillaHTML({
  nombreUsuario,
  urlCambioContrasena,
}: {
  nombreUsuario: string;
  urlCambioContrasena: string;
}): string {
  return `
<div style="font-family: Arial, sans-serif; background-color: #ffffff; margin: 0; padding: 20px;">
  <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%"
         style="max-width: 500px; background-color: #f9f9f9; border-collapse: collapse;">
 
    <!-- Header verde igual al de recuperar contraseña -->
    <tr>
      <td align="center" bgcolor="#008237" style="padding: 20px 0;">
        <h1 style="color: #ffffff; margin: 0; font-family: Arial, sans-serif; font-size: 28px;">
          Zamorano
        </h1>
      </td>
    </tr>
 
    <!-- Cuerpo -->
    <tr>
      <td style="padding: 30px; font-family: Arial, sans-serif;">
        <h2 style="color: #333333; text-align: center; margin-top: 0; margin-bottom: 20px;">
          Cuenta Bloqueada
        </h2>
 
        <p style="color: #555555; font-size: 16px; line-height: 1.5; margin-bottom: 16px;">
          Hola, <strong>${nombreUsuario}</strong>
        </p>
 
        <p style="color: #555555; font-size: 16px; line-height: 1.5; margin-bottom: 16px;">
          Detectamos <strong>3 intentos de inicio de sesión fallidos</strong> en tu cuenta,
          por lo que ha sido <strong>bloqueada temporalmente</strong> por razones de seguridad.
        </p>
 
        <p style="color: #555555; font-size: 16px; line-height: 1.5; margin-bottom: 30px;">
          Para recuperar el acceso, restablece tu contraseña haciendo clic en el botón:
        </p>
 
        <!-- Botón azul igual al de recuperar contraseña -->
        <table align="center" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto 30px;">
          <tr>
            <td align="center" bgcolor="#0070f3" style="border-radius: 5px; padding: 5px;">
              <a href="${urlCambioContrasena}" target="_blank"
                 style="font-size: 16px; font-family: Arial, sans-serif; color: #ffffff;
                        text-decoration: none; border-radius: 5px; padding: 14px 28px;
                        display: inline-block; font-weight: bold; background-color: #0070f3;">
                Restablecer Contraseña
              </a>
            </td>
          </tr>
        </table>
 
        <p style="color: #777777; font-size: 12px; text-align: center; margin-bottom: 8px; line-height: 1.5;">
          Si no reconoces esta actividad, contacta al administrador del sistema de inmediato.
        </p>
      </td>
    </tr>
 
  </table>
</div>
  `.trim();
}
