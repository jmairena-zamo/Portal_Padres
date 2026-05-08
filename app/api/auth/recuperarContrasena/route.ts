import { NextResponse, NextRequest } from "next/server";
import { Resend } from "resend";
import { recuperarContrasenaSchema } from "@/app/utils/validations";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {

    const body = await request.json();
    const parsed = recuperarContrasenaSchema.safeParse(body);

    if (!parsed.success) {
        return NextResponse.json(
            { error: 'Datos inválidos' },
            { status: 400 }
        );
    }

    const { correo } = parsed.data;

    const correoLimpio = correo.trim();

    try {
        const res = await fetch(`https://localhost:7233/portalpadres/v1/useremail/ListarPorCorreo/${correoLimpio}`);


        if (!res.ok) {
            return NextResponse.json(
                { message: 'Correo no válido' },
                { status: 401 }
            );
        }

        const data = await res.json();
        const saveData = {
            id: data.response.iD_UserEmail,
            email: data.response.correoElectronico
        }

        const token = crypto.randomUUID();
        const expiracion = Date.now() + 60 * 60 * 1000;

        const linkReset = `http://localhost:3000/cambiarContrasena?token=${token}&correo=${correoLimpio}`;

        const emailResult = await resend.emails.send({
            from: "onboarding@resend.dev",
            to: "practicanteit_2@zamorano.edu",
            //to: "diegocastrol2017@gmail.com",
            subject: 'Recuperar contraseña - Portal Padres Zamorano',
            html: `
                <div style="font-family: Arial, sans-serif;">
                    <h2>Recuperar contraseña</h2>
                    <p>Haz click en el botón para cambiar tu contraseña:</p>
                    <a href="${linkReset}" style="background:#0070f3; color:white; padding:12px 24px; text-decoration:none; border-radius:5px;">
                        Cambiar contraseña
                    </a>
                    <p style="color:gray; font-size:12px; margin-top:20px;">
                        Este link expira en 1 hora.
                    </p>
                </div>
            `
        });


        return NextResponse.json(
            { message: 'Si el correo existe, recibirás un email' },
            { status: 200 }
        );

    } catch (error) {
        return NextResponse.json(
            { message: 'Error al conectar con el servidor' },
            { status: 500 }
        );
    }

}