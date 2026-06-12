/**
 * Template del correo enviado cuando se bloquea una cuenta por intentos fallidos.
 * Usa Resend. Creado por Diego.
 */

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface OpcionesCorreoBloqueo {
  correoDestino: string;
  nombreUsuario: string;
  // URL completa del endpoint/página de cambio de contraseña
  urlCambioContrasena: string;
}

/**
 * Envía el correo de cuenta bloqueada con el enlace para restablecer contraseña.
 * Retorna true si se envió correctamente, false si hubo error.
 */
export async function enviarCorreoBloqueo({
  correoDestino,
  nombreUsuario,
  urlCambioContrasena,
}: OpcionesCorreoBloqueo): Promise<boolean> {
  try {
    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? "no-reply@zamorano.edu",
      to: correoDestino,
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
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Cuenta bloqueada</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0"
               style="background:#ffffff;border-radius:8px;overflow:hidden;
                      box-shadow:0 2px 8px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:#1a3c5e;padding:28px 40px;">
              <p style="margin:0;color:#ffffff;font-size:20px;font-weight:bold;">
                Portal de Padres — Universidad Zamorano
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;">
              <p style="margin:0 0 16px;font-size:16px;color:#111827;">
                Hola, <strong>${nombreUsuario}</strong>
              </p>
              <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.6;">
                Detectamos <strong>3 intentos de inicio de sesión fallidos</strong>
                en tu cuenta, por lo que ha sido <strong>bloqueada temporalmente</strong>
                por razones de seguridad.
              </p>
              <p style="margin:0 0 24px;font-size:15px;color:#374151;line-height:1.6;">
                Para recuperar el acceso, debes restablecer tu contraseña haciendo
                clic en el botón de abajo. Una vez que lo hagas, tu cuenta se
                desbloqueará automáticamente.
              </p>

              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
                <tr>
                  <td style="background:#1a3c5e;border-radius:6px;">
                    <a href="${urlCambioContrasena}"
                       style="display:inline-block;padding:14px 28px;
                              color:#ffffff;font-size:15px;font-weight:bold;
                              text-decoration:none;">
                      Restablecer contraseña
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 8px;font-size:13px;color:#6b7280;">
                Si no reconoces esta actividad, contacta al administrador del sistema
                de inmediato.
              </p>
              <p style="margin:0;font-size:13px;color:#6b7280;">
                Este enlace es de un solo uso y expira según la política de tu institución.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;padding:20px 40px;
                       border-top:1px solid #e5e7eb;">
              <p style="margin:0;font-size:12px;color:#9ca3af;text-align:center;">
                Universidad Zamorano · Sistema de información para padres de familia<br/>
                Este es un mensaje automático, por favor no respondas a este correo.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}
