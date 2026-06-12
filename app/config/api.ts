export const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_URL) {
  throw new Error(
    "Falta configurar la variable NEXT_PUBLIC_API_BASE_URL en el .env.local",
  );
}
