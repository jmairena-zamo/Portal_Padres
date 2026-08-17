// Creado por Diego Castro
// Pagina de historial academico
// Se mostrara la informacion de cada clase, como el codigo, nombre de la materia, seccion, periodo y nota

"use client";

import { InformacionEstudiante } from "@/app/components/informacionEstudiante/InformacionEstudiante";
import { useCallback, useMemo, useState } from "react";
import {
  Buscador,
  Loading,
  Paginacion,
  Titulo,
  Vacio,
} from "@/app/components/ui";
import { FilaHistorial } from "@/app/interfaces/historialAcademico";
import { useHistorialAcademico } from "@/app/hooks/useHistorialAcademico";

// Campos que se pueden buscar en el historial academico
const CAMPOS_BUSQUEDA: (keyof FilaHistorial)[] = [
  "cursoCodigo",
  "anio",
  "periodo",
  "cursoNombre",
];

const obtenerNumeroPeriodo = (periodo: string) => {
  const match = periodo.match(/(\d+)/);
  return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER;
};

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

  // Agrupar siempre sobre el conjunto completo de datos a mostrar
  // (ya sea resultados filtrados por búsqueda o el historial completo),
  // y luego paginar los grupos resultantes.
  const gruposPorAnioPeriodo = useMemo(() => {
    const grupos = new Map<
      string,
      { anio: string; periodo: string; clases: FilaHistorial[] }
    >();

    datosAMostrar.forEach((fila) => {
      const clave = `${fila.anio}-${fila.periodo}`;
      const grupoExistente = grupos.get(clave);

      if (grupoExistente) {
        grupoExistente.clases.push(fila);
        return;
      }

      grupos.set(clave, {
        anio: fila.anio,
        periodo: fila.periodo,
        clases: [fila],
      });
    });

    return [...grupos.values()].sort((a, b) => {
      const anioDiferencia = Number(b.anio) - Number(a.anio);
      if (anioDiferencia !== 0) return anioDiferencia;
      return obtenerNumeroPeriodo(b.periodo) - obtenerNumeroPeriodo(a.periodo);
    });
  }, [datosAMostrar]);

  // Paginar los grupos (en lugar de paginar filas antes de agrupar)
  const gruposPaginados = gruposPorAnioPeriodo.slice(indexInicio, indexFin);

  // Verificamos si hay datos para mostrar
  const tieneData = datosAMostrar && datosAMostrar.length > 0;

  if (cargandoHistorialAcademico) return <Loading />;

  return (
    <div className="flex flex-col mt-3.75 mx-3.75 gap-3.75">
      <InformacionEstudiante />
      <div className="bg-white p-5 shadow-[0px_1px_5px_rgba(0,0,0,0.2)] rounded-lg mb-3.75">
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
            <div className="mt-5 space-y-4">
              {gruposPaginados.map((grupo) => (
                <section
                  key={`${grupo.anio}-${grupo.periodo}`}
                  className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 py-3 bg-slate-100 border-b border-slate-200">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                        Año
                      </p>
                      <h3 className="text-lg font-bold text-slate-800">
                        {grupo.anio}
                      </h3>
                    </div>

                    <div className="mt-2 sm:mt-0">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                        Periodo
                      </p>
                      <span className="inline-flex items-center rounded-full bg-[#0f172a] px-3 py-1 text-sm font-medium text-white">
                        {grupo.periodo}
                      </span>
                    </div>
                  </div>

                  <div className="divide-y divide-slate-200">
                    {grupo.clases.map((clase) => (
                      <div
                        key={`${clase.cursoCodigo}-${clase.cursoNombre}`}
                        className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                            {clase.cursoCodigo}
                          </p>
                          <p className="mt-1 text-base font-semibold text-slate-800">
                            {clase.cursoNombre}
                          </p>
                        </div>

                        <div className="flex items-center justify-between gap-3 sm:justify-end">
                          <span className="text-sm text-slate-500">
                            Nota final
                          </span>
                          <span
                            className={`inline-flex min-w-[4.5rem] justify-center rounded-full px-2.5 py-1 text-sm font-bold ${
                              Number(clase.calificacion) < 60
                                ? "bg-red-100 text-red-700"
                                : "bg-emerald-100 text-emerald-700"
                            }`}
                          >
                            {clase.calificacion}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>{" "}
          </>
        )}
      </div>
    </div>
  );
}
