import { NextResponse, NextRequest } from "next/server";

export async function DELETE(request: NextRequest) {

    const session = request.cookies.get('session');

    if (!session) {
        return NextResponse.json(
            { error: 'No hay sesion' },
            { status: 400 }
        )
    }

    const usuarioData = JSON.parse(session.value);
    const usuario = usuarioData.email;

    const body = await request.json();

    const { iD_Menu } = body;

    const res = await fetch('https://localhost:7233/portalpadres/v1/menu/Eliminar',
        {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                iD_Menu: iD_Menu,
                usuario: usuario
            })
        }
    )

    if (!res.ok) {
        return NextResponse.json(
            { error: 'Error al Crear Queja o Sugerencia' },
            { status: 500 }
        )
    }

    return NextResponse.json({ ok: true });
}