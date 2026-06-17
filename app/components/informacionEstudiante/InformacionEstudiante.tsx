//Creado por Diego Castro
//Componente para mostrar la información general de los estudiantes
//Será utilizado en varias páginas como encabezado

"use client";

import Image from "next/image";
import user from "../../img/logo-user.png";
import { useEffect, useState } from "react";

export const InformacionEstudiante = () => {
  const [foto, setFoto] = useState<string | null>(null);

  useEffect(() => {
    const cargarFoto = async () => {
      try {
        const res = await fetch("/api/estudiantes/obtenerFoto");
        const data = await res.json();
        setFoto(data.foto ?? null);
      } catch (error) {
        console.log("error con la foto");
        setFoto(null);
      }
    };
    cargarFoto();
  }, []);

  return (
    <div
      className="
            bg-white flex justify-evenly items-center gap-5 p-5 
            shadow-[0px_3px_5px_3px_rgba(0,0,0,0.2)] rounded-md w-full 
            max-[800px]:flex-wrap max-[800px]:justify-center max-[800px]:gap-6 
            max-[420px]:flex-col max-[420px]:items-center max-[420px]:p-2 max-[420px]:gap-2
        "
    >
      <div
        className="
                flex-1 min-w-55 text-start 
                max-[800px]:flex-[1_1_320px] max-[800px]:min-w-70 
                max-[420px]:w-full max-[420px]:min-w-full max-[420px]:text-left
            "
      >
        <h3 className="mb-4 max-[420px]:text-center max-[420px]:mb-2">
          INFORMACIÓN ESTUDIANTE
        </h3>
        <p className="mb-2 wrap-break-word max-[420px]:text-sm max-[420px]:mb-1 max-[420px]:leading-[1.3]">
          <strong>Estudiante:</strong> xxxxx xxxxx xxxxx xxxxx
        </p>
        <p className="mb-2 wrap-break-word max-[420px]:text-sm max-[420px]:mb-1 max-[420px]:leading-[1.3]">
          <strong>Código Estudiante:</strong> xxxxxx
        </p>
        <p className="mb-2 wrap-break-word max-[420px]:text-sm max-[420px]:mb-1 max-[420px]:leading-[1.3]">
          <strong>Correo:</strong> xxxxxxxxxxxxxxxxxx
        </p>
      </div>

      <div
        className="
                flex-1 min-w-55 text-start 
                max-[800px]:flex-[1_1_320px] max-[800px]:min-w-70 
                max-[420px]:w-full max-[420px]:min-w-full max-[420px]:text-left
            "
      >
        <h3 className="mb-4 max-[420px]:text-center max-[420px]:mb-2">
          INFORMACIÓN ESTUDIANTE
        </h3>
        <p className="mb-2 wrap-break-word max-[420px]:text-sm max-[420px]:mb-1 max-[420px]:leading-[1.3]">
          <strong>Estudiante:</strong> xxxxx xxxxx xxxxx xxxxx
        </p>
        <p className="mb-2 wrap-break-word max-[420px]:text-sm max-[420px]:mb-1 max-[420px]:leading-[1.3]">
          <strong>Código Estudiante:</strong> xxxxxx
        </p>
        <p className="mb-2 wrap-break-word max-[420px]:text-sm max-[420px]:mb-1 max-[420px]:leading-[1.3]">
          <strong>Correo:</strong> xxxxxxxxxxxxxxxxxx
        </p>
      </div>

      <div
        className="
                flex justify-center items-center min-w-45 
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
