//Creado por Diego Castro
//Componente para mostrar la información general de los estudiantes
//Será utilizado en varias páginas como encabezado

"use client";

import Image from "next/image";
import user from "../../img/logo-user.png";
import { useEstudiante } from "@/app/hooks/useEstudiante";
import { Titulo } from "@/app/components/ui/Titulo";

export const InformacionEstudiante = () => {
  // Obtenemos la información del estudiante y su foto desde el hook useEstudiante
  const { foto, estudiante } = useEstudiante();

  return (
    <div
      className="
            bg-white flex justify-center items-center gap-36 p-5 
            shadow-[0px_3px_5px_3px_rgba(0,0,0,0.2)] rounded-lg w-full 
              max-[1000px]:flex-wrap max-[1000px]:justify-center max-[1000px]:gap-6 
              max-[800px]:flex-wrap max-[800px]:justify-center max-[800px]:gap-6 
            max-[420px]:flex-col max-[420px]:items-center max-[420px]:p-2 max-[420px]:gap-2
        "
    >
      <div
        className="
                min-w-55 text-start text-[#30545b] 
                  max-[1000px]:flex-[1_1_320px] max-[1000px]:min-w-70 
                  max-[800px]:flex-[1_1_320px] max-[800px]:min-w-70 
                max-[420px]:w-full max-[420px]:min-w-full max-[420px]:text-left
            "
      >
        <Titulo titulo="Información del Estudiante" alineado={1} />
        <p className="mt-2.5 mb-2 wrap-break-word max-[420px]:text-sm max-[420px]:mb-1 max-[420px]:leading-[1.3]">
          <span>
            <strong>Estudiante:</strong>
          </span>{" "}
          <span>{estudiante?.Nombre}</span>
        </p>
        <p className="mb-2 wrap-break-word max-[420px]:text-sm max-[420px]:mb-1 max-[420px]:leading-[1.3]">
          <span>
            <strong>Código Estudiante:</strong>
          </span>{" "}
          <span>{estudiante?.CodigoEstudiante}</span>
        </p>
        <p className="mb-2 wrap-break-word max-[420px]:text-sm max-[420px]:mb-1 max-[420px]:leading-[1.3]">
          <span>
            <strong>Correo:</strong>
          </span>{" "}
          <span>{estudiante?.Correo}</span>
        </p>
      </div>

      <div
        className="
                min-w-45 max-[1000px]:flex justify-center items-center
                max-[1000px]:-order-1 max-[1000px]:w-full
                max-[800px]:flex justify-center items-center
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
                          max-[1000px]:w-40 max-[1000px]:h-40 
                          max-[800px]:w-40 max-[800px]:h-40 
                          max-[420px]:w-30 max-[420px]:h-30
                    "
        />
      </div>
    </div>
  );
};
