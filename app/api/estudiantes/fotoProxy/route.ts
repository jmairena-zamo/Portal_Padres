import { NextRequest, NextResponse } from "next/server";

// Proxy simple para retornar la imagen remota desde el mismo origen.
// Uso: /api/estudiantes/fotoProxy?u=<url_enc>
export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("u");

  if (!url) {
    return NextResponse.json({ error: "missing_url" }, { status: 400 });
  }

  try {
    const upstream = await fetch(url);

    if (!upstream.ok) {
      return NextResponse.json(
        { error: "upstream_error", status: upstream.status },
        { status: upstream.status },
      );
    }

    // Passthrough del body y content-type
    const contentType = upstream.headers.get("content-type") || "image/jpeg";
    return new Response(upstream.body, {
      status: 200,
      headers: { "content-type": contentType },
    });
  } catch (err) {
    // Error de fetch (DNS privada, timeouts, etc.)
    console.error("fotoProxy error:", err);
    return NextResponse.json({ error: "fetch_error" }, { status: 500 });
  }
}
