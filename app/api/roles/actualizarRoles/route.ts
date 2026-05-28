import { NextResponse,NextRequest } from "next/server";

export async function PUT(request: NextRequest) {
    const body = await request.json();

    const res = await fetch(`https://localhost:7233/portalpadres/v1/roles/Actualizar/${body.iD_Rol}`,
        {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                rol: body.rol,
                usuario: 'STRING'
            })
        }
    )

    if (!res.ok) return NextResponse.json({ error: "Error al crear Rol" }, { status: 500 })

    return NextResponse.json({ ok: true });
}