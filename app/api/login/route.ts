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

    const correoLimpio = correo.trim();

    try {
        const res = await fetch(`https://localhost:7233/portalpadres/v1/useremail/ListarPorCorreo/${correoLimpio}`);

        if (!res.ok) {
            return NextResponse.json(
                { error: 'Correo no encontrado' },
                { status: 401 }
            );
        }

        const data = await res.json();
        console.log(data);

        const response = NextResponse.json({ ok: true });
        response.cookies.set('session', JSON.stringify(data), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60,
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