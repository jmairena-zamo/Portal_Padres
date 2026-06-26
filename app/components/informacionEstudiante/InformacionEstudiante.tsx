//Creado por Diego Castro
//Componente para mostrar la información general de los estudiantes
//Será utilizado en varias páginas como encabezado

"use client";

import Image from "next/image";
import user from "../../img/logo-user.png";
import { useEstudiante } from "@/app/hooks/useEstudiante";

export const InformacionEstudiante = () => {
  const { foto, estudiante } = useEstudiante();

  return (
    <div
      className="
            bg-white flex justify-center items-center gap-36 p-5 
            shadow-[0px_3px_5px_3px_rgba(0,0,0,0.2)] rounded-md w-full 
            max-[800px]:flex-wrap max-[800px]:justify-center max-[800px]:gap-6 
            max-[420px]:flex-col max-[420px]:items-center max-[420px]:p-2 max-[420px]:gap-2
        "
    >
      <div
        className="
                min-w-55 text-start 
                max-[800px]:flex-[1_1_320px] max-[800px]:min-w-70 
                max-[420px]:w-full max-[420px]:min-w-full max-[420px]:text-left
            "
      >
        <h3 className="mb-4 max-[420px]:text-center max-[420px]:mb-2">
          <strong>INFORMACIÓN ESTUDIANTE</strong>
        </h3>
        <p className="mb-2 wrap-break-word max-[420px]:text-sm max-[420px]:mb-1 max-[420px]:leading-[1.3]">
          <strong>Estudiante:</strong> {estudiante?.Nombre}
        </p>
        <p className="mb-2 wrap-break-word max-[420px]:text-sm max-[420px]:mb-1 max-[420px]:leading-[1.3]">
          <strong>Código Estudiante:</strong> {estudiante?.CodigoEstudiante}
        </p>
        <p className="mb-2 wrap-break-word max-[420px]:text-sm max-[420px]:mb-1 max-[420px]:leading-[1.3]">
          <strong>Correo:</strong> {estudiante?.Correo}
        </p>
      </div>

      <div
        className="
                min-w-45 max-[800px]:flex justify-center items-center
                max-[800px]:-order-1 max-[800px]:w-full max-[420px]:min-w-auto
            "
      >
        <Image
          src={foto ? `data:image/jpeg;base64,${foto}` : user}
          alt="Foto del estudiante"
          width={200}
          height={200}
          className="
                        w-40 h-40 object-cover rounded-full shadow-md 
                        max-[800px]:w-40 max-[800px]:h-40 
                        max-[420px]:w-30 max-[420px]:h-30
                    "
        />
      </div>
    </div>
  );
};
