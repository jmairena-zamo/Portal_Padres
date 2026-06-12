import { NextResponse, NextRequest } from "next/server";
import { Resend } from "resend";
import { recuperarContrasenaSchema } from "@/app/utils/validations";
import LogoZamorano from "../../../img/Logo-Universidad-Zamorano.png";
import { API_URL } from "@/app/config/api";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const resend = new Resend(process.env.RESEND_API_KEY);

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
    //const expiracion = Date.now() + 30 * 60 * 1000;

    const tokenRes = await fetch(`${API_URL}/tokensrecuperacion/Crear`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userEmail_ID: id,
        token: token,
      }),
    });

    if (!tokenRes.ok) {
      const errorBody = await tokenRes.text();
      console.error("Token error:", tokenRes.status, errorBody);
      return NextResponse.json(
        { message: "Error al generar el token de recuperación" },
        { status: 500 },
      );
    }

    const linkReset = `http://localhost:3000/cambiarContrasena?token=${token}&id=${id}`;

    const emailResult = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "practicanteit_2@zamorano.edu",
      //to: "diegocastrol2017@gmail.com",
      subject: "Recuperar contraseña - Portal Padres Zamorano",
      html: `
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
                                            <a href="${linkReset}" target="_blank" style="font-size: 16px; font-family: Arial, sans-serif; color: #ffffff; text-decoration: none; border-radius: 5px; padding: 14px 28px; display: inline-block; font-weight: bold; background-color: #0070f3;">
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
            `,
    });

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
