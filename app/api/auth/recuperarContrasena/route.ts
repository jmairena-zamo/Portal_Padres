import { NextResponse, NextRequest } from "next/server";
import { Resend } from "resend";
import { loginSchema } from "@/app/utils/validations";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {

    const body = await request.json();
    console.log("1️⃣ Body recibido:", body);
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
        return NextResponse.json(
            { error: 'Datos inválidos' },
            { status: 400 }
        );
    }

    const { correo } = parsed.data;

    const correoLimpio = correo.trim();
    console.log("2️⃣ Correo limpio:", correoLimpio);

    try {
        const res = await fetch(`https://localhost:7233/portalpadres/v1/useremail/ListarPorCorreo/${correoLimpio}`);

        console.log("3️⃣ Status .NET:", res.status);

        if (!res.ok) {
            return NextResponse.json(
                { error: 'Correo o Contraseña Incorrectos' },
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

        const linkReset = `http://localhost:3000/nuevaContrasena?token=${token}&correo=${correo}`;
        console.log("4️⃣ Link generado:", linkReset);

        const emailResult = await resend.emails.send({
            from: "onboarding@resend.dev",
            to: "practicanteit_2@zamorano.edu",
            subject: 'Recuperar contraseña - Portal Padres Zamorano',
            html: "hola"
        });

        console.log("5️⃣ Resultado Resend:", emailResult);

        return NextResponse.json(
            { message: 'Si el correo existe, recibirás un email' },
            { status: 200 }
        );

    } catch (error) {
        return NextResponse.json(
            { error: 'Error al conectar con el servidor' },
            { status: 500 }
        );
    }

}