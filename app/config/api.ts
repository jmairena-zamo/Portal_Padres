// Creado por Diego Castro
// constante para obtener la url base del api

export const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
export const API_URL_ZAMO =
  process.env.NEXT_PUBLIC_URL_API_ZAMO || process.env.URL_API_ZAMO;

if (!API_URL || !API_URL_ZAMO) {
  throw new Error("Falta configurar la variable en el .env.local");
}
