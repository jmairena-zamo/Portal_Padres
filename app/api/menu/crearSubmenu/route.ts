import { subMenuSchema } from "@/app/utils/validations";
import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    const body = await request.json();

    const datosParseados = {
        ...body,
        posicion: Number(body.posicion)
    };

    const parsed = subMenuSchema.safeParse(datosParseados);

    if (!parsed.success) {
        console.log("Error Zod:", parsed.error);
        return NextResponse.json(
            { error: 'Datos inválidos' },
            { status: 400 }
        );
    }

    const { opcion, posicion } = parsed.data;

    const res = await fetch('https://localhost:7233/portalpadres/v1/submenu/Crear',
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                opcion: opcion,
                posicion: posicion,
                menu_ID: datosParseados.menu_ID,
                icono: 'string',
                habilitado: 0,
                estado: 1,
                usuario: 'DIEGO',
            })
        }
    )

    if (!res.ok) return NextResponse.json({ error: "Error al crear Submenu" }, { status: 500 })

    return NextResponse.json({ ok: true });
}