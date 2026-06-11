import user from "../../img/logo-user.png";
import logozamorano from "../../img/Logo-Universidad-Zamorano.png";
import Image from "next/image";
import { BtnPrimario } from "../ui";

interface ModalProps {
  OnClose: () => void;
}

const estudiantes = [
  { nombre: "Diego Sebastian", apellido: "Castro Lagos" },
  { nombre: "María Valentina", apellido: "Mendoza Ortiz" },
  { nombre: "Carlos Eduardo", apellido: "Alvarado Reyes" },
  { nombre: "Ana Lucía", apellido: "Gómez Pastrana" },
  { nombre: "Luis Fernando", apellido: "Rodríguez Zelaya" },
  { nombre: "Sofía Alejandra", apellido: "Benítez Flores" },
  { nombre: "Javier Andrés", apellido: "Martínez Colindres" },
  { nombre: "Valeria Nicolle", apellido: "Castillo Núñez" },
  { nombre: "Gabriel Enrique", apellido: "Pineda Aguilar" },
  { nombre: "Camila Isabella", apellido: "Vásquez Mejía" },
];

export default function ModalSuplantar({ OnClose }: ModalProps) {
  return (
    <div className="fixed inset-0 bg-white flex flex-col">
      {/* logo */}
      <div className="flex items-center justify-center h-22.5 border-b border-gray-200 px-4 shrink-0">
        <Image src={logozamorano} alt="Logo Zamorano" width={280} height={60} />
      </div>

      {/* contenido */}
      <div className="flex flex-col flex-1 overflow-hidden mx-auto w-full max-w-150 px-4 py-6">
        {/* encabezado */}
        <div className="bg-[#008237] text-white rounded-t-lg px-6 py-3 shrink-0">
          <h2 className="text-[20px] font-bold text-center">
            Seleccionar Estudiante
          </h2>
          <p className="text-center text-[13px] opacity-80">
            Elige un estudiante para ver su información
          </p>
        </div>

        {/* lista */}
        <div className="flex-1 overflow-y-auto bg-white border border-t-0 border-gray-200 rounded-b-lg shadow-[0px_3px_5px_3px_rgba(0,0,0,0.1)] p-4 flex flex-col gap-3">
          {estudiantes.map((u, index) => (
            <div
              key={index}
              className="flex items-center gap-4 bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-sm hover:shadow-md hover:border-[#008237] transition-all duration-200"
            >
              <div className="shrink-0">
                <Image
                  src={user}
                  alt="Imagen Estudiante"
                  width={50}
                  height={50}
                  className="rounded-full object-cover w-12.5 h-12.5"
                />
              </div>

              {/* info */}
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-gray-400 uppercase tracking-wide font-semibold">
                  Estudiante
                </p>
                <p className="text-[15px] font-semibold text-gray-800 truncate">
                  {u.nombre}
                </p>
                <p className="text-[13px] text-gray-500 truncate">
                  {u.apellido}
                </p>
              </div>

              {/* botón */}
              <BtnPrimario onClick={OnClose}>Ver</BtnPrimario>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
