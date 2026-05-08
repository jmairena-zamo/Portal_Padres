import { loginSchema } from "@/app/utils/validations";
import { NextRequest, NextResponse } from "next/server";
import rateLimit from "@/app/utils/rateLimits";

export async function POST(request: NextRequest) {

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    const limitResult = rateLimit(request, 5, 15 * 60 * 1000);
    if (limitResult) return limitResult;

    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
        return NextResponse.json(
            { error: 'Datos inválidos' },
            { status: 400 }
        );
    }

    const { correo } = parsed.data;
    const { contrasena } = parsed.data;

    const correoLimpio = correo.trim();
    const contrasenaLimpia = contrasena.trim();

    try {
        const res = await fetch(`https://localhost:7233/portalpadres/v1/useremail/ListarPorCorreo/${correoLimpio}`);

        if (!res.ok) {
            return NextResponse.json(
                { error: 'Correo o Contraseña Incorrectos' },
                { status: 401 }
            );
        }

        const data = await res.json();

        if ( contrasenaLimpia != data.response.contrasena){
            return NextResponse.json(
                { error: 'Correo o Contraseña Incorrectos' },
                { status: 401 }
            );
        }

        const saveData = {
            id: data.response.iD_UserEmail,
            email: data.response.correoElectronico
        }

        const response = NextResponse.json({ ok: true });
        response.cookies.set('session', JSON.stringify(saveData), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 30 * 60,
            path: '/',
        });

        return response;

    } catch (error) {
        console.log("Error al conectar con la API:", error);
        return NextResponse.json(
            { error: 'Error al conectar con el servidor' },
            { status: 500 }
        );
    }
}