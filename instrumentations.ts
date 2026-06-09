// instrumentation.ts
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Deshabilita TLS aquí también, una sola vez
    if (process.env.NODE_ENV === 'development') {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    }

    await new Promise(resolve => setTimeout(resolve, 3000));

    try {
      // Llama a cualquier endpoint ligero del .NET — solo para que despierte
      await fetch('https://localhost:7233/portalpadres/v1/useremail/ListarPorCorreo/test@test.com', {
        signal: AbortSignal.timeout(5000),
      });
      console.log('[Warmup] Backend .NET listo');
    } catch {
      console.log('[Warmup] Backend no disponible aún (normal si arranca después)');
    }
  }
}