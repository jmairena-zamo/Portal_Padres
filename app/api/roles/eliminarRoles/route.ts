import { NextResponse,NextRequest } from "next/server";

export async function DELETE(request: NextRequest) {
    const body = await request.json();

    const {iD_Rol} = body;

    const res = await fetch('https://localhost:7233/portalpadres/v1/roles/Eliminar',
        {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                iD_Rol: iD_Rol,
                usuario: 'STRING'
            })
        }
    )

    if (!res.ok) return NextResponse.json({ error: "Error al eliminar Rol" }, { status: 500 })

    return NextResponse.json({ ok: true });
}