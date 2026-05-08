import { NextRequest, NextResponse } from "next/server";
import { nuevaContrasenaSchema } from "@/app/utils/validations";

export async function PUT(request: NextRequest) {
    const body = await request.json();

    const parsed = nuevaContrasenaSchema.safeParse(body);

    if (!parsed.success) {
        return NextResponse.json(
            { error: 'Datos inválidos' },
            { status: 400 }
        );
    }

    const { id_useremail, correoElectronico, contrasena, relacion, tipoUsuario, usuario } = parsed.data;

    try {
        const res = await fetch(`https://localhost:7233/portalpadres/v1/useremail/actualizar/${id_useremail}`,
            {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    correoElectronico: correoElectronico,
                    relacion: relacion,
                    tipoUsuario: tipoUsuario,
                    contrasena: contrasena,
                    usuario: usuario
                })
            }
        )

        if (!res.ok) {
            return NextResponse.json(
                { error: 'Error al actualizar contraseña' },
                { status: 500 }
            )
        }

        return NextResponse.json({ message: 'Contraseña actualizada correctamente' });

    } catch (error) {
        return NextResponse.json(
            { error: 'Error al conectar con el servidor' },
            { status: 500 }
        );
    }
}