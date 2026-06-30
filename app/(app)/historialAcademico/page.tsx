// Creado por Diego Castro
// Pagina de historial academico

"use client";

import { InformacionEstudiante } from "@/app/components/informacionEstudiante/InformacionEstudiante";
import { useEffect, useState } from "react";
import {
  Buscador,
  Loading,
  Paginacion,
  Tabla,
  Vacio,
} from "@/app/components/ui";
import {
  CursoHistorial,
  FilaHistorial,
} from "@/app/respuestasAPI/historialAcademico";
import { useEstudiante } from "@/app/hooks/useEstudiante";

export default function HistorialAcademico() {
  const [paginaActual, setPaginaActual] = useState(1);
  const [registrosPorPagina, setRegistrosPorPagina] = useState(10);
  const [dataFiltrada, setDataFiltrada] = useState<FilaHistorial[]>([]);

  const {
    historialAcademico,
    cargandoHistorialAca,
    errorHistorialAca,
    reintentarHistorialAca,
  } = useEstudiante();

  useEffect(() => {
    setDataFiltrada(historialAcademico);
  }, [historialAcademico]);

  const handleCambiarRegistros = (cantidad: number) => {
    setRegistrosPorPagina(cantidad);
    setPaginaActual(1);
  };

  const indexInicio = (paginaActual - 1) * registrosPorPagina;
  const indexFin = indexInicio + registrosPorPagina;
  const datosPaginados = dataFiltrada.slice(indexInicio, indexFin);

  const tieneData = historialAcademico.length > 0;

  if (cargandoHistorialAca) return <Loading />;
  return (
    <div className="flex flex-col mt-3.75 mx-3.75 gap-3.75">
      <InformacionEstudiante />
      <div className="bg-white p-5 shadow-[0px_3px_5px_3px_rgba(0,0,0,0.2)] rounded-[5px] mb-3.75">
        <h2 className="font-bold text-lg">Historial Academico</h2>
        <Buscador
          datos={historialAcademico}
          campos={["clase", "anio", "periodo", "codigo"]}
          placeholder="Buscar..."
          onResultado={(resultados) => {
            setDataFiltrada(resultados);
            setPaginaActual(1);
          }}
        />
        {cargandoHistorialAca ? (
          <Loading />
        ) : errorHistorialAca ? (
          <Vacio
            titulo="Ocurrio un error"
            descripcion="No se pudo cargar la información"
            onReintentar={reintentarHistorialAca}
          />
        ) : !tieneData ? (
          <Vacio
            titulo="No hay Información"
            descripcion="No existe Historial Academico"
          />
        ) : (
          <>
            <Tabla
              datos={datosPaginados}
              keyExtractor={(item) => item.id}
              claseFilaExtra={(item) =>
                parseFloat(item.nota) < 60 ? "bg-red-400" : ""
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
              totalRegistros={historialAcademico.length}
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
