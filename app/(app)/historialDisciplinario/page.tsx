//Creado por Diego Castro
//Pagina donde se mostrara el historial acdemico del estudiante

"use client";

import { InformacionEstudiante } from "@/app/components/informacionEstudiante/InformacionEstudiante";
import { useEffect, useState } from "react";
import {
  Buscador,
  Loading,
  Paginacion,
  Tabla,
  Titulo,
  Vacio,
} from "@/app/components/ui";
import {
  accionesEstudiantiles,
  FilaHistorialDisciplinario,
} from "@/app/respuestasAPI/faltas";
import ModalForm from "@/app/components/modals/ModalForm";
import { useHistorialDisciplinario } from "@/app/hooks/useHistorialDisciplinario";
import { useEstudiante } from "@/app/hooks/useEstudiante";

export default function HistorialDisciplinario() {
  const [paginaActual, setPaginaActual] = useState(1);
  const [registrosPorPagina, setRegistrosPorPagina] = useState(10);
  const [filaSeleccionada, setFilaSeleccionada] =
    useState<FilaHistorialDisciplinario | null>(null);
  const [dataFiltrada, setDataFiltrada] = useState<
    FilaHistorialDisciplinario[]
  >([]);
  const { faltasTotales } = useEstudiante();

  const {
    historialDisciplinario,
    cargandoDisciplinario,
    errorDisciplinario,
    reintentarDisciplinario,
  } = useHistorialDisciplinario();

  useEffect(() => {
    setDataFiltrada(historialDisciplinario);
  }, [historialDisciplinario]);

  const handleCambiarRegistros = (cantidad: number) => {
    setRegistrosPorPagina(cantidad);
    setPaginaActual(1);
  };

  const indexInicio = (paginaActual - 1) * registrosPorPagina;
  const indexFin = indexInicio + registrosPorPagina;
  const datosPaginados = dataFiltrada.slice(indexInicio, indexFin);

  const tieneData = historialDisciplinario.length > 0;

  if (cargandoDisciplinario) return <Loading />;
  return (
    <div className="flex flex-col mt-3.75 mx-3.75 gap-3.75">
      <InformacionEstudiante />
      <div className="bg-white p-5 shadow-[0px_3px_5px_3px_rgba(0,0,0,0.3)] rounded-[5px] ">
        <Titulo titulo="Historial Disciplinario" alineado={3} />
        <div className="mt-2.5">
          <Buscador
            datos={historialDisciplinario}
            campos={["tipo", "periodo"]}
            placeholder="Buscar..."
            onResultado={(resultado) => {
              setDataFiltrada(resultado);
              setPaginaActual(1);
            }}
          />
        </div>

        {cargandoDisciplinario ? (
          <Loading />
        ) : errorDisciplinario ? (
          <Vacio
            titulo="Ocurrio un error"
            descripcion="No se pudo cargar la información"
            onReintentar={reintentarDisciplinario}
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
          totalRegistros={historialDisciplinario.length}
          registrosPorPagina={registrosPorPagina}
          paginaActual={paginaActual}
          onCambiarPagina={setPaginaActual}
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
