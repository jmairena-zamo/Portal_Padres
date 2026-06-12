/**
 * Control de intentos de login fallidos por usuario.
 * Almacenado en memoria — se reinicia al reiniciar el servidor.
 * Creado por Diego Castro
 */

const MAX_INTENTOS = 3;
// Ventana de 1 hora en ms — tras esto los intentos se reinician si la cuenta no fue bloqueada
const VENTANA_MS = 60 * 60 * 1000;

interface RegistroIntentos {
  cantidad: number;
  primerIntento: number;
  bloqueada: boolean;
}

// Clave: correo/usuario en minúsculas para evitar duplicados por capitalización
const intentosPorUsuario = new Map<string, RegistroIntentos>();

/** Limpia registros cuya ventana expiró y no están bloqueados */
function limpiarVencidos(): void {
  const ahora = Date.now();
  for (const [usuario, registro] of intentosPorUsuario) {
    if (!registro.bloqueada && ahora - registro.primerIntento > VENTANA_MS) {
      intentosPorUsuario.delete(usuario);
    }
  }
}

/**
 * Registra un intento fallido para el usuario.
 * Retorna el estado actualizado después del intento.
 */
export function registrarIntentoFallido(usuario: string): {
  intentosRestantes: number;
  cuentaBloqueada: boolean;
  esNuevoBloqueado: boolean; // true solo en el momento exacto en que se bloquea
} {
  limpiarVencidos();

  const clave = usuario.toLowerCase();
  const ahora = Date.now();

  if (!intentosPorUsuario.has(clave)) {
    intentosPorUsuario.set(clave, {
      cantidad: 0,
      primerIntento: ahora,
      bloqueada: false,
    });
  }

  const registro = intentosPorUsuario.get(clave)!;

  // Si la cuenta ya estaba bloqueada, no incrementar más
  if (registro.bloqueada) {
    return {
      intentosRestantes: 0,
      cuentaBloqueada: true,
      esNuevoBloqueado: false,
    };
  }

  // Reiniciar ventana si ya expiró (cuenta no bloqueada)
  if (ahora - registro.primerIntento > VENTANA_MS) {
    registro.cantidad = 0;
    registro.primerIntento = ahora;
  }

  registro.cantidad += 1;

  const esNuevoBloqueado = registro.cantidad >= MAX_INTENTOS;

  if (esNuevoBloqueado) {
    registro.bloqueada = true;
  }

  intentosPorUsuario.set(clave, registro);

  return {
    intentosRestantes: Math.max(0, MAX_INTENTOS - registro.cantidad),
    cuentaBloqueada: esNuevoBloqueado,
    esNuevoBloqueado,
  };
}

/**
 * Consulta si una cuenta está bloqueada sin modificar el registro.
 */
export function estaBloqueada(usuario: string): boolean {
  const registro = intentosPorUsuario.get(usuario.toLowerCase());
  return registro?.bloqueada ?? false;
}

/**
 * Desbloquea la cuenta y reinicia el conteo.
 * Llamar tras un cambio de contraseña exitoso.
 */
export function desbloquearCuenta(usuario: string): void {
  intentosPorUsuario.delete(usuario.toLowerCase());
}

/**
 * Reinicia el conteo de intentos tras un login exitoso.
 */
export function reiniciarIntentos(usuario: string): void {
  intentosPorUsuario.delete(usuario.toLowerCase());
}
