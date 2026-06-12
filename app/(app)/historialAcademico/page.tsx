"use client";

import { InformacionEstudiante } from "@/app/components/informacionEstudiante/InformacionEstudiante";
import { useState } from "react";
import index from "./page.module.css";
import { Paginacion, Tabla } from "@/app/components/ui";

export default function HistorialAcademico() {
  //useAuth();

  const [paginaActual, setPaginaActual] = useState(1);
  const [registrosPorPagina, setRegistrosPorPagina] = useState(10);

  const [data, setData] = useState([
    {
      id: 1,
      clase: "Quimica",
      seccion: "123",
      codigo: "CC05",
      anio: "2025",
      periodo: 3,
      nota: 90.98,
      estado: "APB",
      uv: 4,
    },
    {
      id: 2,
      clase: "Biologia",
      seccion: "124",
      codigo: "CC06",
      anio: "2026",
      periodo: 1,
      nota: 76.98,
      estado: "APB",
      uv: 4,
    },
    {
      id: 3,
      clase: "Biologia",
      seccion: "124",
      codigo: "CC06",
      anio: "2026",
      periodo: 1,
      nota: 76.98,
      estado: "APB",
      uv: 4,
    },
    {
      id: 4,
      clase: "Biologia",
      seccion: "124",
      codigo: "CC06",
      anio: "2026",
      periodo: 1,
      nota: 76.98,
      estado: "APB",
      uv: 4,
    },
    {
      id: 5,
      clase: "Biologia",
      seccion: "124",
      codigo: "CC06",
      anio: "2026",
      periodo: 1,
      nota: 76.98,
      estado: "APB",
      uv: 4,
    },
    {
      id: 6,
      clase: "Biologia",
      seccion: "124",
      codigo: "CC06",
      anio: "2026",
      periodo: 1,
      nota: 76.98,
      estado: "APB",
      uv: 4,
    },
    {
      id: 7,
      clase: "Biologia",
      seccion: "124",
      codigo: "CC06",
      anio: "2026",
      periodo: 1,
      nota: 76.98,
      estado: "APB",
      uv: 4,
    },
  ]);

  const handleCambiarRegistros = (cantidad: number) => {
    setRegistrosPorPagina(cantidad);
    setPaginaActual(1);
  };

  const indexInicio = (paginaActual - 1) * registrosPorPagina;
  const indexFin = indexInicio + registrosPorPagina;
  const datosPaginados = data.slice(indexInicio, indexFin);
  return (
    <div className="flex flex-col mt-3.75 mx-3.75 gap-3.75">
      <InformacionEstudiante />
      <div className="bg-white p-5 shadow-[0px_3px_5px_3px_rgba(0,0,0,0.3)] rounded-[5px] mb-3.75">
        <h2 className="font-bold text-lg">Historial Academico</h2>
        <Tabla
          datos={datosPaginados}
          keyExtractor={(item) => item.id}
          columnas={[
            { header: "ID", accessor: "id" },
            { header: "Año", accessor: "anio" },
            { header: "Periodo", accessor: "seccion" },
            { header: "Nombre Materia", accessor: "clase" },
            { header: "Sección", accessor: "seccion" },
            { header: "Código", accessor: "codigo" },
            { header: "Nota Final", accessor: "nota" },
            { header: "Estado", accessor: "estado" },
            { header: "UV", accessor: "uv" },
          ]}
        />

        <Paginacion
          totalRegistros={data.length}
          registrosPorPagina={registrosPorPagina}
          paginaActual={paginaActual}
          onCambiarPagina={setPaginaActual}
          onCambiarRegistrosPorPagina={handleCambiarRegistros}
        />
      </div>
      <div className="bg-white rounded-[5px] p-3.75 shadow-[0px_3px_5px_3px_rgba(0,0,0,0.3)]">
        <p>
          <strong>Unidades Valorativas Aprobadas:</strong> 140
        </p>
        <p>
          <strong>Índice Académico:</strong> 90
        </p>
      </div>
    </div>
  );
}
