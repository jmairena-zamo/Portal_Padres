import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest){
    const body = await request.json();

    const res = await fetch('https://localhost:7233/portalpadres/v1/submenurol/Crear',{
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            subMenu_ID: body.subMenu_ID,
            rol_ID: body.rol_ID,
            usuario: "ADMIN"
        })
    });

    if(!res.ok){
        return NextResponse.json({error: "Error al asignar Rol"}, {status: 500})
    }

    return NextResponse.json({ok: true})
}

export async function PUT(request: NextRequest){
    const body = await request.json();

    const res = await fetch(`https://localhost:7233/portalpadres/v1/submenurol/Actualizar`,
        {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                iD_Menu_Rol: body.iD_Menu_Rol,
                habilitado: body.habilitado,
                usuario: "ADMIN"
            })
        }
    );

    if(!res.ok){
        return NextResponse.json({error: 'Error al quitar Rol'}, {status: 500})
    }

    return NextResponse.json({ok: true});
}