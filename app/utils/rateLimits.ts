import { NextRequest, NextResponse } from "next/server";

const solicitudes = new Map<string, { cantidad: number; primerSolicitud: number }>();

export default function rateLimit(req: NextRequest, limit: number, interval: number): NextResponse | null {

    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    const ahora = Date.now();

    if (!solicitudes.has(ip)) {
        solicitudes.set(ip, { cantidad: 0, primerSolicitud: ahora });
    }

    const data = solicitudes.get(ip)!;

    if (ahora - data.primerSolicitud > interval) {
        data.cantidad = 0;
        data.primerSolicitud = ahora;
    }

    data.cantidad += 1;
    solicitudes.set(ip, data);

    if (data.cantidad > limit) {
        return NextResponse.json(
            { error: 'Demasiadas solicitudes. Intenta más tarde.' },
            { status: 429 }
        );
    }

    return null;
}