//Creado por Diego Castro
//Componente para mostrar la información general de los estudiantes
//Será utilizado en varias páginas como encabezado

"use client";

import Image from "next/image";
import user from "../../img/logo-user.png";
import { useEstudiante } from "@/app/hooks/useEstudiante";
import { Titulo } from "@/app/components/ui/Titulo";
import { useEffect, useState } from "react";

export const InformacionEstudiante = () => {
  // Obtenemos la información del estudiante y su foto desde el hook useEstudiante
  const { estudiante } = useEstudiante();
  const [fotoError, setFotoError] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFotoError(false);
  }, [estudiante?.codigoEstudiante]);

  return (
    <div
      className="
            bg-white flex flex-col-reverse gap-6 px-2 py-5
            shadow-[0px_1px_5px_rgba(0,0,0,0.2)] rounded-lg w-full
            sm:px-35 sm:flex-row
        "
    >
      {/* Contenedor información: Título + Datos */}
      <div className="flex-1 flex flex-col gap-4">
        <Titulo titulo="Información del Estudiante" alineado={1} />

        <div className="grid grid-cols-2 gap-4 gap-y-3">
          <div className="flex flex-col text-[#30545b]">
            <span className="font-semibold text-sm">Estudiante</span>
            <span className="text-sm break-words">
              {estudiante?.nombreCompleto ?? "N/A"}
            </span>
          </div>
          <div className="flex flex-col text-[#30545b]">
            <span className="font-semibold text-sm">Código Estudiante</span>
            <span className="text-sm">
              {estudiante?.codigoEstudiante ?? "N/A"}
            </span>
          </div>
          <div className="flex flex-col text-[#30545b]">
            <span className="font-semibold text-sm">Carrera</span>
            <span className="text-sm break-words">
              {estudiante?.carreraNombre ?? "N/A"}
            </span>
          </div>
          <div className="flex flex-col text-[#30545b]">
            <span className="font-semibold text-sm">Código Carrera</span>
            <span className="text-sm">
              {estudiante?.carreraCodigo ?? "N/A"}
            </span>
          </div>
          <div className="flex flex-col text-[#30545b]">
            <span className="font-semibold text-sm">País</span>
            <span className="text-sm">{estudiante?.pais ?? "N/A"}</span>
          </div>
          <div className="flex flex-col text-[#30545b]">
            <span className="font-semibold text-sm">Año de Carrera</span>
            <span className="text-sm">{estudiante?.carreraAnio ?? "N/A"}</span>
          </div>
        </div>
      </div>

      {/* Contenedor foto: Lado derecho */}
      <div className="flex-shrink-0 flex justify-center items-center max-[1000px]:justify-center max-[800px]:justify-center max-[420px]:justify-center">
        <Image
          src={
            estudiante?.fotografiaUrl && !fotoError
              ? `/api/estudiantes/fotoProxy?u=${encodeURIComponent(
                  estudiante.fotografiaUrl,
                )}`
              : user
          }
          alt="Foto del estudiante"
          width={200}
          onError={() => setFotoError(true)}
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
