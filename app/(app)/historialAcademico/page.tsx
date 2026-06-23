// Creado por Diego Castro
// Pagina de historial academico

"use client";

import { InformacionEstudiante } from "@/app/components/informacionEstudiante/InformacionEstudiante";
import { useEffect, useState } from "react";
import { Buscador, Loading, Paginacion, Tabla } from "@/app/components/ui";
import { CursoHistorial } from "@/app/respuestasAPI/historialAcademico";

interface FilaHistorial {
  id: string;
  anio: string;
  periodo: string;
  clase: string;
  seccion: string;
  codigo: string;
  nota: string;
}

// Mapear los datos que vienen de la respuesta
function mapearCurso(curso: CursoHistorial): FilaHistorial {
  return {
    id: curso.id,
    anio: curso.term.slice(0, 4),
    periodo: curso.termDescription.replace("C", ""), //eliminar la C de cuatrimestre
    clase: curso.courseLongTitle,
    seccion: curso.courseReferenceNumber,
    codigo: curso.activityAcademic,
    nota: parseFloat(curso.grade).toFixed(2),
  };
}

export default function HistorialAcademico() {
  const [paginaActual, setPaginaActual] = useState(1);
  const [registrosPorPagina, setRegistrosPorPagina] = useState(10);
  const [data, setData] = useState<FilaHistorial[]>([]);
  const [dataFiltrada, setDataFiltrada] = useState<FilaHistorial[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  // Obtener datos y mapearlos
  const cargarDatos = async () => {
    setCargando(true);
    try {
      const res = await fetch("/api/estudiantes/obtenerHistorialAcademico");
      const data = await res.json();
      const filas = (data.response as CursoHistorial[]).map(mapearCurso);
      setData(filas);

      setDataFiltrada(filas);
    } catch (error) {
      console.log("Error de conexión. Intenta de nuevo.");
    } finally {
      setCargando(false);
    }
  };

  const handleCambiarRegistros = (cantidad: number) => {
    setRegistrosPorPagina(cantidad);
    setPaginaActual(1);
  };

  const indexInicio = (paginaActual - 1) * registrosPorPagina;
  const indexFin = indexInicio + registrosPorPagina;
  const datosPaginados = dataFiltrada.slice(indexInicio, indexFin);
  return (
    <div className="flex flex-col mt-3.75 mx-3.75 gap-3.75">
      <InformacionEstudiante />
      <div className="bg-white p-5 shadow-[0px_3px_5px_3px_rgba(0,0,0,0.2)] rounded-[5px] mb-3.75">
        <h2 className="font-bold text-lg">Historial Academico</h2>
        <Buscador
          datos={data}
          campos={["clase", "anio", "periodo", "seccion", "codigo"]}
          placeholder="Buscar..."
          onResultado={(resultados) => {
            setDataFiltrada(resultados);
            setPaginaActual(1);
          }}
        />
        {cargando ? (
          <Loading />
        ) : (
          <>
            <Tabla
              datos={datosPaginados}
              keyExtractor={(item) => item.id}
              claseFilaExtra={(item) =>
                parseFloat(item.nota) < 70 ? "bg-red-400" : ""
              }
              columnas={[
                { header: "Código", accessor: "codigo" },
                { header: "Nombre Materia", accessor: "clase" },
                { header: "Año", accessor: "anio" },
                { header: "Periodo", accessor: "periodo" },
                // { header: "Sección", accessor: "seccion" },
                { header: "Nota Final", accessor: "nota" },
              ]}
            />

            <Paginacion
              totalRegistros={data.length}
              registrosPorPagina={registrosPorPagina}
              paginaActual={paginaActual}
              onCambiarPagina={setPaginaActual}
              onCambiarRegistrosPorPagina={handleCambiarRegistros}
            />
          </>
        )}
      </div>
      {/* <div className="bg-white rounded-[5px] p-3.75 shadow-[0px_3px_5px_3px_rgba(0,0,0,0.3)]">
        <p>
          <strong>Unidades Valorativas Aprobadas:</strong> 140
        </p>
        <p>
          <strong>Índice Académico:</strong> 90
        </p>
      </div> */}
    </div>
  );
}
