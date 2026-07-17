// Creado por Diego Castro
// Pagina de historial academico
// Se mostrara la informacion de cada clase, como el codigo, nombre de la materia, seccion, periodo y nota

"use client";

import { InformacionEstudiante } from "@/app/components/informacionEstudiante/InformacionEstudiante";
import { useCallback, useState } from "react";
import {
  Buscador,
  Loading,
  Paginacion,
  Tabla,
  Titulo,
  Vacio,
} from "@/app/components/ui";
import { FilaHistorial } from "@/app/interfaces/historialAcademico";
import { useHistorialAcademico } from "@/app/hooks/useHistorialAcademico";

// Campos que se pueden buscar en el historial academico
const CAMPOS_BUSQUEDA: (keyof FilaHistorial)[] = [
  "clase",
  "anio",
  "periodo",
  "codigo",
];

export default function HistorialAcademico() {
  // Estado para manejar la paginación (qué página y cuántos registros mostrar)
  const [paginacion, setPaginacion] = useState({
    paginaActual: 1,
    registrosPorPagina: 10,
  });

  // Estado para manejar la búsqueda (si está activa y qué datos mostrar)
  const [busqueda, setBusqueda] = useState({
    dataFiltrada: [] as FilaHistorial[],
    busquedaActiva: false,
  });

  // Hook que trae la información del historial academico
  const {
    historialAcademico,
    cargandoHistorialAcademico,
    errorHistorialAcademico,
    reintentarHistorialAcademico,
  } = useHistorialAcademico();

  // Función que se ejecuta cuando se hace una búsqueda
  const handleResultadoBusqueda = useCallback((resultados: FilaHistorial[]) => {
    setBusqueda({ dataFiltrada: resultados, busquedaActiva: true });
    setPaginacion((prev) => ({ ...prev, paginaActual: 1 }));
  }, []);

  // Función para cambiar cuántos registros se muestran por página
  const handleCambiarRegistros = useCallback((cantidad: number) => {
    setPaginacion({ registrosPorPagina: cantidad, paginaActual: 1 });
  }, []);

  // Función para cambiar de página
  const handleCambiarPagina = useCallback((pagina: number) => {
    setPaginacion((prev) => ({ ...prev, paginaActual: pagina }));
  }, []);

  // Extraemos valores actuales de paginación y búsqueda
  const { paginaActual, registrosPorPagina } = paginacion;
  const { dataFiltrada, busquedaActiva } = busqueda;

  const datosAMostrar = busquedaActiva ? dataFiltrada : historialAcademico;

  // Calculamos los índices para la paginación de datos
  const indexInicio = (paginaActual - 1) * registrosPorPagina;
  const indexFin = indexInicio + registrosPorPagina;
  const datosPaginados = datosAMostrar.slice(indexInicio, indexFin);

  // Verificamos si hay datos para mostrar
  const tieneData = datosPaginados && datosPaginados.length > 0;

  if (cargandoHistorialAcademico) return <Loading />;
  // if (cargandoHistorialAcademico && !errorHistorialAcademico)
  //   return <Loading />;

  return (
    <div className="flex flex-col mt-3.75 mx-3.75 gap-3.75">
      <InformacionEstudiante />
      <div className="bg-white p-5 shadow-[0px_3px_5px_3px_rgba(0,0,0,0.2)] rounded-[5px] mb-3.75">
        <Titulo titulo="Historial Academico" alineado={3} />
        {!errorHistorialAcademico && (
          <div className="mt-2.5">
            <Buscador
              datos={historialAcademico}
              campos={CAMPOS_BUSQUEDA}
              placeholder="Buscar..."
              onResultado={handleResultadoBusqueda}
            />
          </div>
        )}

        {/* Si hay error, mostramos mensaje; si no, mostramos la tabla */}
        {errorHistorialAcademico ? (
          <Vacio
            titulo="Ocurrio un error"
            descripcion="No se pudo cargar la información"
            onReintentar={() => reintentarHistorialAcademico()}
          />
        ) : !tieneData ? (
          <Vacio
            titulo="No hay datos disponibles"
            descripcion="No se encontraron registros de Historial Academico para mostrar"
          />
        ) : (
          <>
            <Tabla
              datos={datosPaginados}
              keyExtractor={(item) => item.id}
              claseFilaExtra={(item) =>
                parseFloat(item.nota) < 60 ? "bg-red-300" : ""
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
              totalRegistros={datosAMostrar.length}
              registrosPorPagina={registrosPorPagina}
              paginaActual={paginaActual}
              onCambiarPagina={handleCambiarPagina}
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
