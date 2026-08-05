// Creado por Diego Castro
// Pagina donde se mostrara el historial disciplinario del estudiante
// Se mostrara la informacion de cada falta, como el tipo, fecha, periodo, descripcion corta, reportada por, numero de faltas y estado

"use client";

import { InformacionEstudiante } from "@/app/components/informacionEstudiante/InformacionEstudiante";
import { useCallback, useMemo, useState } from "react";
import {
  Buscador,
  ComboBoxFiltro,
  Loading,
  Paginacion,
  Tabla,
  Titulo,
  Vacio,
} from "@/app/components/ui";
import { FilaHistorialDisciplinario } from "@/app/interfaces/faltas";
import ModalForm from "@/app/components/modals/ModalForm";
import { useHistorialDisciplinario } from "@/app/hooks/useHistorialDisciplinario";
import { useEstudiante } from "@/app/hooks/useEstudiante";

// Opciones para el filtro de estado
const opcionesEstado = [
  { value: "Eliminada", label: "ELIMINADA" },
  { value: "Aprobada", label: "APROBADA" },
];

// Constante para definir los campos que se pueden buscar en el historial disciplinario
const CAMPOS_BUSQUEDA: (keyof FilaHistorialDisciplinario)[] = [
  "tipo",
  "periodo",
];

export default function HistorialDisciplinario() {
  const [filaSeleccionada, setFilaSeleccionada] =
    useState<FilaHistorialDisciplinario | null>(null);
  const { faltasTotales } = useEstudiante();

  // Estado para manejar la paginación (qué página y cuántos registros mostrar)
  const [paginacion, setPaginacion] = useState({
    paginaActual: 1,
    registrosPorPagina: 10,
    estadoFiltro: "todos" as number | string | "todos",
  });

  // Estado para manejar la búsqueda (si está activa y qué datos mostrar)
  const [busqueda, setBusqueda] = useState({
    dataFiltrada: [] as FilaHistorialDisciplinario[],
    busquedaActiva: false,
  });

  // Hook que trae la información del historial disciplinario
  const {
    historialDisciplinario,
    cargandoDisciplinario,
    errorDisciplinario,
    reintentarDisciplinario,
  } = useHistorialDisciplinario();

  // Función que se ejecuta cuando se hace una búsqueda
  const handleResultadoBusqueda = useCallback(
    (resultados: FilaHistorialDisciplinario[]) => {
      setBusqueda({ dataFiltrada: resultados, busquedaActiva: true });
      setPaginacion((prev) => ({ ...prev, paginaActual: 1 }));
    },
    [],
  );

  // Función para cambiar el filtro de estado
  const handleCambiarEstadoFiltro = useCallback(
    (value: number | string | "todos") => {
      setPaginacion((prev) => ({
        ...prev,
        estadoFiltro: value,
        paginaActual: 1,
      }));
    },
    [],
  );

  // Función para cambiar cuántos registros se muestran por página
  const handleCambiarRegistros = useCallback((cantidad: number) => {
    setPaginacion((prev) => ({
      ...prev,
      registrosPorPagina: cantidad,
      paginaActual: 1,
    }));
  }, []);

  // Función para cambiar de página
  const handleCambiarPagina = useCallback((pagina: number) => {
    setPaginacion((prev) => ({ ...prev, paginaActual: pagina }));
  }, []);

  // Extraemos valores actuales de paginación y búsqueda
  const { paginaActual, registrosPorPagina, estadoFiltro } = paginacion;
  const { dataFiltrada, busquedaActiva } = busqueda;

  // Filtramos los datos según el estado seleccionado y si hay búsqueda activa
  const datosBase = busquedaActiva ? dataFiltrada : historialDisciplinario;

  // Filtramos los datos según el estado seleccionado
  const datosAMostrar = useMemo(() => {
    if (estadoFiltro === "todos") {
      return datosBase;
    }
    return datosBase.filter((item) => item.estado === estadoFiltro);
  }, [datosBase, estadoFiltro]);

  // Calculamos los índices para la paginación de datos
  const indexInicio = (paginaActual - 1) * registrosPorPagina;
  const indexFin = indexInicio + registrosPorPagina;
  const datosPaginados = datosAMostrar.slice(indexInicio, indexFin);

  // Verificamos si hay datos para mostrar
  const tieneData = datosPaginados && datosPaginados.length > 0;

  if (cargandoDisciplinario) return <Loading />;
  return (
    <div className="flex flex-col mt-3.75 mx-3.75 gap-3.75">
      <InformacionEstudiante />
      <div className="bg-white p-5 shadow-[0px_1px_5px_rgba(0,0,0,0.2)] rounded-lg mb-3.75">
        <Titulo titulo="Historial Disciplinario" alineado={3} />
        <div className="mt-2.5"></div>
        {!errorDisciplinario && (
          <div className="mt-2.5 mb-5 w-full flex gap-3.75 max-[420px]:flex-col">
            <div className="w-4/5 flex justify-center items-center max-[420px]:w-full">
              <Buscador
                datos={historialDisciplinario}
                campos={CAMPOS_BUSQUEDA}
                placeholder="Buscar..."
                onResultado={handleResultadoBusqueda}
              />
            </div>
            <div className="flex items-center text-[#555555] gap-3.75 max-[420px]:gap-1.25">
              <h4>Estado:</h4>
              <ComboBoxFiltro
                valor={estadoFiltro}
                placeholder="Todos"
                opciones={opcionesEstado}
                onChange={handleCambiarEstadoFiltro}
              />
            </div>
          </div>
        )}

        {/* Si hay error, mostramos mensaje; si no, mostramos la tabla */}
        {errorDisciplinario ? (
          <Vacio
            titulo="Ocurrio un error"
            descripcion="No se pudo cargar la información"
            onReintentar={() => reintentarDisciplinario()}
          />
        ) : !tieneData ? (
          <Vacio
            titulo="No hay datos disponibles"
            descripcion="No se encontraron registros de Historial Disciplinario para mostrar"
          />
        ) : (
          <>
            <Tabla
              datos={datosPaginados}
              keyExtractor={(item) => item.id}
              columnas={[
                { header: "Tipo", accessor: "tipo" },
                { header: "Fecha", accessor: "fecha" },
                { header: "Periodo", accessor: "periodo" },
                {
                  header: "Descripción",
                  accessor: "descripcionCorta",
                  width: "400px",
                },
                { header: "Reportada Por", accessor: "reportadaPor" },
                { header: "Num. Faltas", accessor: "numfaltas" },
                {
                  header: "Estado",
                  accessor: "estado",
                  render: (item) =>
                    item.estado === "Eliminada" ? (
                      <span className="text-red-600">{item.estado}</span>
                    ) : (
                      <span>{item.estado}</span>
                    ),
                },
                {
                  header: "Detalle",
                  accessor: "descripcionDetallada",
                  render: (item) => (
                    <button
                      type="button"
                      onClick={() => setFilaSeleccionada(item)}
                      className="truncate max-w-50 text-left text-[#007BFF] hover:underline cursor-pointer"
                      title="Click para ver el detalle completo"
                    >
                      Ver más
                    </button>
                  ),
                },
              ]}
            />
            <h2 className="font-bold text-[16px] text-[#173426] mt-3.75 mb-2 ml-3.5">
              Faltas Totales: {faltasTotales}
            </h2>
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
      {filaSeleccionada && (
        <ModalForm
          titulo="Descripción Detallada"
          onConfirmar={() => setFilaSeleccionada(null)}
          onCancelar={() => setFilaSeleccionada(null)}
          txtConfirmar="Cerrar"
          ocultarCancelar={true}
        >
          <p className="text-sm text-gray-500">
            {filaSeleccionada.fecha} · {filaSeleccionada.tipo}
          </p>
          <p className="text-[#666666] whitespace-pre-line">
            <strong>Descripción: </strong>
            {filaSeleccionada.descripcionDetallada}
          </p>
          <p className="text-[#666666] whitespace-pre-line flex flex-col">
            <span>
              <strong>Estado:</strong> {filaSeleccionada.estado}
            </span>
            {filaSeleccionada.estado === "Eliminada" ? (
              <>
                <span>
                  <strong>Motivo:</strong> {filaSeleccionada.motivoRemosion}
                </span>
                <span>
                  <strong>Fecha Eliminada:</strong>{" "}
                  {filaSeleccionada.fechaEliminada}
                </span>
              </>
            ) : (
              <span>
                <strong>Fecha Aprobada:</strong>{" "}
                {filaSeleccionada.fechaAprobada}
              </span>
            )}
          </p>
        </ModalForm>
      )}
    </div>
  );
}
