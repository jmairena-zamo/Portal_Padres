//Creado por Diego Castro
//Pagina donde se mostrara el historial acdemico del estudiante

"use client";

import { InformacionEstudiante } from "@/app/components/informacionEstudiante/InformacionEstudiante";
import { useEffect, useState } from "react";
import { Paginacion, Tabla } from "@/app/components/ui";
import { accionesEstudiantiles } from "@/app/respuestasAPI/faltas";

interface FilaHistorialDisciplinario {
  id: number;
  tipo: string;
  fecha?: string;
  periodo?: number;
  descripcionCorta: string;
  descripcionDetallada: string;
  reportadaPor?: string;
}

function mapearHistorialDisciplinario(
  m: accionesEstudiantiles,
  index: number,
): FilaHistorialDisciplinario {
  return {
    id: index,
    tipo: m.tipoCodigoAccion,
    fecha: m.fechaAccion,
    periodo: m.periodo,
    descripcionCorta: m.descripcionTipoAccion,
    descripcionDetallada: m.descripcionDetallada,
    reportadaPor: m.reportadaPor,
  };
}

export default function HistorialDisciplinario() {
  const [paginaActual, setPaginaActual] = useState(1);
  const [registrosPorPagina, setRegistrosPorPagina] = useState(10);
  //Datos de prueba para mostrar en la tabla
  // const [data, setData] = useState([
  //   { id: 1, faltas: 1, clase: "Quimica", fecha: "27/04/2026", estado: "Leve" },
  //   {
  //     id: 2,
  //     faltas: 2,
  //     clase: "Biologia",
  //     fecha: "27/04/2026",
  //     estado: "Grave",
  //   },
  // ]);
  const [data, setData] = useState<FilaHistorialDisciplinario[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarData = async () => {
      try {
        const res = await fetch("/api/estudiantes/obtenerFaltas");
        const data = await res.json();
        const filas = (
          data.AccionesEstudiantiles as accionesEstudiantiles[]
        ).map(mapearHistorialDisciplinario);
        setData(filas);
      } catch (error) {
      } finally {
        setCargando(false);
      }
    };
    cargarData();
  }, []);

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
        <h2 className="font-bold text-lg">Historial Disciplinario</h2>
        <Tabla
          datos={datosPaginados}
          keyExtractor={(item) => item.id}
          columnas={[
            { header: "Tipo", accessor: "tipo" },
            { header: "Fecha", accessor: "fecha" },
            { header: "Periodo", accessor: "periodo" },
            { header: "Descripción", accessor: "descripcionCorta" },
            { header: "Detalle", accessor: "descripcionDetallada" },
            { header: "Reportada Por", accessor: "reportadaPor" },
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
    </div>
  );
}
