// Creado por Diego Castro
// Pantalla que permite al usuario establecer una nueva contraseña
// a partir de un enlace de recuperación enviado por correo.

import Image from "next/image";
import logozamorano from "../../img/Logo-Universidad-Zamorano.png";
import { BtnOutline } from "@/app/components/ui";
import CambiarContrasenaForm from "./cambiarContrasenaForm";

interface UsuarioRecuperacion {
  id: string;
  correo: string;
  relacion: string;
  iD_Rol: string;
  usuario: string;
}

interface PageProps {
  searchParams: Promise<{
    id?: string;
    token?: string;
  }>;
}

async function obtenerUsuarioRecuperacion(
  id: string,
  token: string,
): Promise<UsuarioRecuperacion | null> {
  try {
    // Opción 1: llamar directamente tu servicio/backend aquí
    // Opción 2: si por ahora solo tienes el endpoint /api/user/obtenerUsuario,
    // puedes hacer fetch desde el servidor a tu URL absoluta

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL;

    const res = await fetch(`/api/user/obtenerUsuario`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, token }),
      cache: "no-store",
    });

    if (!res.ok) return null;

    const data = await res.json();

    if (data.error) return null;

    return data;
  } catch {
    return null;
  }
}

export default async function CambiarContrasenaPage({
  searchParams,
}: PageProps) {
  const { id, token } = await searchParams;

  if (!id || !token) {
    return (
      <div className="fixed inset-0 bg-gray-50 overflow-y-auto">
        <div className="mt-5 mb-5 flex items-center justify-center h-20">
          <Image
            src={logozamorano}
            alt="Logo Zamorano"
            width={300}
            height={75}
          />
        </div>

        <div className="bg-white mx-auto w-full max-w-md p-4 rounded-md shadow-md border border-gray-100 flex flex-col gap-3 mb-10">
          <h2 className="font-bold text-[22px] text-center">
            No se pudo continuar
          </h2>
          <p className="text-center text-[15px] text-red-600">
            Link inválido o expirado
          </p>
          <BtnOutline type="button">Volver al login</BtnOutline>
        </div>
      </div>
    );
  }

  const userData = await obtenerUsuarioRecuperacion(id, token);

  if (!userData) {
    return (
      <div className="fixed inset-0 bg-gray-50 overflow-y-auto">
        <div className="mt-5 mb-5 flex items-center justify-center h-20">
          <Image
            src={logozamorano}
            alt="Logo Zamorano"
            width={300}
            height={75}
          />
        </div>

        <div className="bg-white mx-auto w-full max-w-md p-4 rounded-md shadow-md border border-gray-100 flex flex-col gap-3 mb-10">
          <h2 className="font-bold text-[22px] text-center">
            No se pudo continuar
          </h2>
          <p className="text-center text-[15px] text-red-600">
            Link inválido o expirado
          </p>
        </div>
      </div>
    );
  }

  return <CambiarContrasenaForm token={token} userData={userData} />;
}
