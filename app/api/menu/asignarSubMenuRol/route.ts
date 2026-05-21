import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest){
    const body = await request.json();

    const res = await fetch('https://localhost:7233/portalpadres/v1/submenurol/Crear',{
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body)
    });

    if(!res.ok){
        return NextResponse.json({error: "Error al asignar Rol"}, {status: 500})
    }

    return NextResponse.json({ok: true})
}

export async function DELETE(request: NextRequest){
    const body = await request.json();
    const { iD_Menu_Rol } = body;

    const res = await fetch(
        `https://localhost:7233/portalpadres/v1/submenurol/Eliminar/${iD_Menu_Rol}`,
        {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        }
    );

    if(!res.ok){
        return NextResponse.json({error: 'Error al quitar Rol'}, {status: 500})
    }

    return NextResponse.json({ok: true});
}