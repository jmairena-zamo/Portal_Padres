//Creado pr Diego Castro
//Modal que se muestra al rol administrador para suplantar estudiante

"use client";
import user from "../../img/logo-user.png";
import logozamorano from "../../img/Logo-Universidad-Zamorano.png";
import Image from "next/image";
import { BtnPrimario, Buscador } from "../ui";
import { useState } from "react";
import { registrarIngreso } from "@/app/services/registrarIngreso";

//Cerrar el modal luego de seleccinar estudiante
interface ModalProps {
  OnClose: () => void;
  onSeleccionar: (estudiante: { id: number; nombre: string }) => void;
}

export default function ModalSuplantar({ OnClose, onSeleccionar }: ModalProps) {
  //Array temporal de estudiantes
  const estudiantesIniciales = [
    { id: 1, nombre: "Diego Sebastian", apellido: "Castro Lagos" },
    { id: 2, nombre: "María Valentina", apellido: "Mendoza Ortiz" },
    { id: 3, nombre: "Carlos Eduardo", apellido: "Alvarado Reyes" },
    { id: 4, nombre: "Ana Lucía", apellido: "Gómez Pastrana" },
    { id: 5, nombre: "Luis Fernando", apellido: "Rodríguez Zelaya" },
    { id: 6, nombre: "Sofía Alejandra", apellido: "Benítez Flores" },
    { id: 7, nombre: "Javier Andrés", apellido: "Martínez Colindres" },
    { id: 8, nombre: "Valeria Nicolle", apellido: "Castillo Núñez" },
    { id: 9, nombre: "Gabriel Enrique", apellido: "Pineda Aguilar" },
    { id: 10, nombre: "Camila Isabella", apellido: "Vásquez Mejía" },
  ];
  const [todosEstudiantes] = useState(estudiantesIniciales);
  const [estudiantesFiltrados, setEstudiantesFiltrados] =
    useState(estudiantesIniciales);

  //registra el ingreso con el bannerID del estudiante
  const seleccionarEstudiante = async (estudiante: {
    id: number;
    nombre: string;
  }) => {
    await fetch("/api/auth/seleccionarEstudiante", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bannerID: estudiante.id }), // reemplaza con el real cuando tengas los datos
    });
    onSeleccionar(estudiante);
    OnClose();
  };

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
          <div className="p-1.5">
            <Buscador
              datos={todosEstudiantes}
              campos={["nombre"]}
              placeholder="Buscar estudiante..."
              onResultado={(resultados) => {
                setEstudiantesFiltrados(resultados);
              }}
            />
          </div>
          {estudiantesFiltrados.map((u, index) => (
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
              <BtnPrimario onClick={() => seleccionarEstudiante(u)}>
                Ver
              </BtnPrimario>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
