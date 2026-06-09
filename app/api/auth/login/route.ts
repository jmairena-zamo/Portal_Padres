//Creado por Diego Castro

import { loginSchema } from "@/app/utils/validations";
import { NextRequest, NextResponse } from "next/server";
import rateLimit from "@/app/utils/rateLimits";

//POST /api/auth/login
//Autentica al usuario con correo y contraseña
//Crean una cookie si las credenciales son validas
//Aplica un rate limits de 10 intentos en 15 min
//valida a traves de zod antes de prcesar

// Deshabilita la verificación TLS para el entorno de desarrollo local
if (process.env.NODE_ENV === 'development') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

export async function POST(request: NextRequest) {

    // Bloquea la petición si el IP superó el límite de intentos
    const limitResult = rateLimit(request, 10, 15 * 60 * 1000);
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

        // Correo no encontrado en el backend
        if (!res.ok) {
            return NextResponse.json(
                { error: 'Correo o Contraseña Incorrectos' },
                { status: 401 }
            );
        }

        const data = await res.json();

        // Contraseña incorrecta
        if ( contrasenaLimpia != data.response.contrasena){
            return NextResponse.json(
                { error: 'Correo o Contraseña Incorrectos' },
                { status: 401 }
            );
        }

        // Guardar solo los campos necesarios en la cookie de sesión
        const saveData = {
            id: data.response.iD_UserEmail,
            email: data.response.correoElectronico,
            iD_Rol: data.response.iD_Rol
        }

        const response = NextResponse.json({ ok: true });

        // Cookie httpOnly con duración de 30 minutos; secure solo en producción
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