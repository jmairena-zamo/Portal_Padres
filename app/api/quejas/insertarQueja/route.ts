import { NextRequest, NextResponse } from "next/server";
import { quejaSchema } from "@/app/utils/validations";

export async function POST(request: NextRequest){
    const body = await request.json();

    const parsed = quejaSchema.safeParse(body);

    if (!parsed.success) {
        return NextResponse.json(
            { error: 'Datos inválidos' },
            { status: 400 }
        );
    }

    const { telefono, tipo, asunto, mensaje } = parsed.data;

    const session = request.cookies.get('session');

    if(!session){
        return NextResponse.json(
            { error: 'No hay sesion'},
            { status: 400 }
        )
    }

    const usuarioData = JSON.parse(session.value);
    const ID_UserEmail = usuarioData.id;
    const usuario = usuarioData.email;

    try {
        const res = await fetch('https://localhost:7233/portalpadres/v1/quejassugerencias/Crear',
            {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    iD_UserEmail: ID_UserEmail,
                    telefono: telefono,
                    tipo: tipo,
                    asunto: asunto,
                    mensaje: mensaje,
                    usuario: usuario
                })
            }
        );

        if (!res.ok) {
            return NextResponse.json(
                { error: 'Error al Crear Queja o Sugerencia' },
                { status: 500 }
            )
        }

        return NextResponse.json({ message: 'Queja o Sugerencia Creada Correctamente' });
        
    } catch (error) {
        return NextResponse.json(
            { error: 'Error al conectar con el servidor' },
            { status: 500 }
        );
    }
}