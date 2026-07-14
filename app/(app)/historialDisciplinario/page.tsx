//Creado por Diego Castro
//Pagina donde se mostrara el historial acdemico del estudiante

"use client";

import { InformacionEstudiante } from "@/app/components/informacionEstudiante/InformacionEstudiante";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Buscador,
  ComboBoxFiltro,
  Loading,
  Paginacion,
  Tabla,
  Titulo,
  Vacio,
} from "@/app/components/ui";
import {
  accionesEstudiantiles,
  FilaHistorialDisciplinario,
} from "@/app/interfaces/faltas";
import ModalForm from "@/app/components/modals/ModalForm";
import { useHistorialDisciplinario } from "@/app/hooks/useHistorialDisciplinario";
import { useEstudiante } from "@/app/hooks/useEstudiante";

const opcionesTipo = [
  { value: "Eliminada", label: "ELIMINADA" },
  { value: "Aprobada", label: "APROBADA" },
];

const CAMPOS_BUSQUEDA: (keyof FilaHistorialDisciplinario)[] = [
  "tipo",
  "periodo",
];

export default function HistorialDisciplinario() {
  // const [paginaActual, setPaginaActual] = useState(1);
  // const [registrosPorPagina, setRegistrosPorPagina] = useState(10);
  const [filaSeleccionada, setFilaSeleccionada] =
    useState<FilaHistorialDisciplinario | null>(null);
  // const [dataFiltrada, setDataFiltrada] = useState<
  //   FilaHistorialDisciplinario[]
  // >([]);
  const { faltasTotales } = useEstudiante();
  // const [busquedaActiva, setBusquedaActiva] = useState(false);

  const [paginacion, setPaginacion] = useState({
    paginaActual: 1,
    registrosPorPagina: 10,
    estadoFiltro: "todos" as number | string | "todos",
  });
  const [busqueda, setBusqueda] = useState({
    dataFiltrada: [] as FilaHistorialDisciplinario[],
    busquedaActiva: false,
  });

  const {
    historialDisciplinario,
    cargandoDisciplinario,
    errorDisciplinario,
    reintentarDisciplinario,
  } = useHistorialDisciplinario();

  const handleResultadoBusqueda = useCallback(
    (resultados: FilaHistorialDisciplinario[]) => {
      setBusqueda({ dataFiltrada: resultados, busquedaActiva: true });
      setPaginacion((prev) => ({ ...prev, paginaActual: 1 }));
    },
    [],
  );

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

  const handleCambiarRegistros = useCallback((cantidad: number) => {
    setPaginacion((prev) => ({
      ...prev,
      registrosPorPagina: cantidad,
      paginaActual: 1,
    }));
  }, []);

  const handleCambiarPagina = useCallback((pagina: number) => {
    setPaginacion((prev) => ({ ...prev, paginaActual: pagina }));
  }, []);

  const { paginaActual, registrosPorPagina, estadoFiltro } = paginacion;
  const { dataFiltrada, busquedaActiva } = busqueda;

  const datosBase = busquedaActiva ? dataFiltrada : historialDisciplinario;

  const datosAMostrar = useMemo(() => {
    if (estadoFiltro === "todos") {
      return datosBase;
    }
    return datosBase.filter((item) => item.estado === estadoFiltro);
  }, [datosBase, estadoFiltro]);

  // const handleResultadosBusqueda = useCallback(
  //   (resultados: FilaHistorialDisciplinario[]) => {
  //     setDataFiltrada(resultados);
  //     setBusquedaActiva(true);
  //     setPaginaActual(1);
  //   },
  //   [],
  // );

  // const datoAMostrar = busquedaActiva ? dataFiltrada : historialDisciplinario;

  // const handleCambiarRegistros = (cantidad: number) => {
  //   setRegistrosPorPagina(cantidad);
  //   setPaginaActual(1);
  // };

  const indexInicio = (paginaActual - 1) * registrosPorPagina;
  const indexFin = indexInicio + registrosPorPagina;
  const datosPaginados = datosAMostrar.slice(indexInicio, indexFin);

  const tieneData = historialDisciplinario.length > 0;

  if (cargandoDisciplinario) return <Loading />;
  return (
    <div className="flex flex-col mt-3.75 mx-3.75 gap-3.75">
      <InformacionEstudiante />
      <div className="bg-white p-5 shadow-[0px_3px_5px_3px_rgba(0,0,0,0.3)] rounded-[5px] ">
        <Titulo titulo="Historial Disciplinario" alineado={3} />
        <div className="mt-2.5"></div>
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
              opciones={opcionesTipo}
              onChange={handleCambiarEstadoFiltro}
            />
          </div>
        </div>

        {cargandoDisciplinario ? (
          <Loading />
        ) : errorDisciplinario ? (
          <Vacio
            titulo="Ocurrio un error"
            descripcion="No se pudo cargar la información"
            onReintentar={() => {
              reintentarDisciplinario;
            }}
          />
        ) : !tieneData ? (
          <Vacio
            titulo="No hay Información"
            descripcion="No existe Historial Disciplinario"
          />
        ) : (
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
        )}

        <h2 className="font-bold text-[16px] text-[#173426] mt-3.75 mb-3.75 ml-3.5">
          Faltas Totales: {faltasTotales}
        </h2>
        <Paginacion
          totalRegistros={datosAMostrar.length}
          registrosPorPagina={registrosPorPagina}
          paginaActual={paginaActual}
          onCambiarPagina={handleCambiarPagina}
          onCambiarRegistrosPorPagina={handleCambiarRegistros}
        />
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
