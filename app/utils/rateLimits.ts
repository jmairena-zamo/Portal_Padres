//Creado por Diego 

import { NextRequest, NextResponse } from "next/server";

// Almacena el conteo de solicitudes por IP en memoria (se reinicia al reiniciar el servidor)
const solicitudes = new Map<string, { cantidad: number; primerSolicitud: number }>();

// Limpia entradas cuya ventana ya expiró para evitar crecimiento indefinido del Map
function limpiarSolicitudesVencidas(interval: number): void {
    const ahora = Date.now();
    for (const [ip, data] of solicitudes) {
        if (ahora - data.primerSolicitud > interval) {
            solicitudes.delete(ip);
        }
    }
}

//  * Middleware de rate limiting basado en IP.
//  * Retorna una respuesta 429 si se supera el límite; null si la solicitud es permitida.

// limit - Máximo de solicitudes permitidas en el intervalo
// interval - Ventana de tiempo en milisegundos
export default function rateLimit(req: NextRequest, limit: number, interval: number): NextResponse | null {

    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
    const ahora = Date.now();

    limpiarSolicitudesVencidas(interval);

    // Registrar IP nueva
    if (!solicitudes.has(ip)) {
        solicitudes.set(ip, { cantidad: 0, primerSolicitud: ahora });
    }

    const data = solicitudes.get(ip)!;

    // Reiniciar ventana si el intervalo ya expiró
    if (ahora - data.primerSolicitud > interval) {
        data.cantidad = 0;
        data.primerSolicitud = ahora;
    }

    data.cantidad += 1;
    solicitudes.set(ip, data);

    //// Bloquear si se superó el límite dentro de la ventana actual
    if (data.cantidad > limit) {
        return NextResponse.json(
            { error: 'Demasiadas solicitudes. Intenta más tarde.' },
            { status: 429 }
        );
    }

    return null;
}