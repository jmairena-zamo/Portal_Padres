// Creado por Diego Castro
// Template del correo cuando el usuario quiere recuperar su contraseña
// Utiliza Resend

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface OpcionesCorreoRecuperar {
  nombreUsuario: string;
  // URL completa del endpoint/página de cambio de contraseña
  urlCambioContrasena: string;
}

// Envía el correo de para recuperar contraseña
// Retorna true si se envió correctamente, false si hubo error.

export async function enviarCorreoRecuperarCon({
  nombreUsuario,
  urlCambioContrasena,
}: OpcionesCorreoRecuperar): Promise<boolean> {
  try {
    const { error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "practicanteit_2@zamorano.edu",
      subject: "Recuperar contraseña - Portal Padres Zamorano",
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
                    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 500px; background-color: #f9f9f9; border-collapse: collapse;">
                        
                        <tr>
                            <td align="center" bgcolor="#008237" style="padding: 20px 0;">
                                <h1 style="color: #ffffff; margin: 0; font-family: Arial, sans-serif; font-size: 28px;">Zamorano</h1>
                            </td>
                        </tr>

                        <tr>
                            <td style="padding: 30px; font-family: Arial, sans-serif;">
                                <h2 style="color: #333333; text-align: center; margin-top: 0; margin-bottom: 20px;">Recuperar Contraseña</h2>
                                <p style="color: #555555; font-size: 16px; line-height: 1.5; margin-bottom: 30px;">
                                    Recibimos una solicitud para restablecer tu contraseña. Haz click en el botón para continuar:
                                </p>
                                
                                <table align="center" border="0" cellpadding="0" cellspacing="0" style="margin: 30px auto;">
                                    <tr>
                                        <td align="center" bgcolor="#0070f3" style="border-radius: 5px; padding: 5px">
                                            <a href="${urlCambioContrasena}" target="_blank" style="font-size: 16px; font-family: Arial, sans-serif; color: #ffffff; text-decoration: none; border-radius: 5px; padding: 14px 28px; display: inline-block; font-weight: bold; background-color: #0070f3;">
                                                Cambiar Contraseña
                                            </a>
                                        </td>
                                    </tr>
                                </table>

                                <p style="color: #777777; font-size: 12px; text-align: center; margin-top: 30px; margin-bottom: 0; line-height: 1.5;">
                                    Este link expira en 12 horas.
                                </p>
                            </td>
                        </tr>
                    </table>
                </div>
  `.trim();
}
