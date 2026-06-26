//Creado por Diego Castro
//Pagina donde se mostrara el historial acdemico del estudiante

"use client";

import { InformacionEstudiante } from "@/app/components/informacionEstudiante/InformacionEstudiante";
import { useEffect, useState } from "react";
import { Loading, Paginacion, Tabla } from "@/app/components/ui";
import { accionesEstudiantiles } from "@/app/respuestasAPI/faltas";
import ModalForm from "@/app/components/modals/ModalForm";

interface FilaHistorialDisciplinario {
  id: number;
  tipo: string;
  fecha?: string;
  periodo?: string;
  descripcionCorta: string;
  descripcionDetallada: string;
  reportadaPor?: string;
  numfaltas: number;
  estado: string;
  motivoRemosion?: string;
  fechaAprobada?: string;
  fechaEliminada?: string;
}

function mapearHistorialDisciplinario(
  m: accionesEstudiantiles,
  index: number,
): FilaHistorialDisciplinario {
  const estado = m.aprobada ? "Aprobada" : m.eliminada ? "Eliminada" : "N/A";

  return {
    id: index,
    tipo: m.tipoCodigoAccion,
    fecha: m.fechaAccion?.substring(0, 10),
    periodo: [m.ano, m.periodo].filter(Boolean).join(" - ") || undefined,
    descripcionCorta: m.descripcionTipoAccion,
    descripcionDetallada: m.descripcionDetallada,
    reportadaPor: m.reportadaPor,
    numfaltas: m.numeroFaltas,
    estado: estado,
    motivoRemosion: m.codigoMotivoRemosion,
    fechaAprobada: m.fechaAprobada?.substring(0, 10),
    fechaEliminada: m.fechaEliminada?.substring(0, 10),
  };
}

export default function HistorialDisciplinario() {
  const [paginaActual, setPaginaActual] = useState(1);
  const [registrosPorPagina, setRegistrosPorPagina] = useState(10);
  const [data, setData] = useState<FilaHistorialDisciplinario[]>([]);
  const [cargando, setCargando] = useState(true);
  const [filaSeleccionada, setFilaSeleccionada] =
    useState<FilaHistorialDisciplinario | null>(null);

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

  if (cargando) return <Loading />;
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
            {
              header: "Descripción",
              accessor: "descripcionCorta",
              width: "400px",
            },
            { header: "Reportada Por", accessor: "reportadaPor" },
            { header: "Num. Faltas", accessor: "numfaltas" },
            { header: "Estado", accessor: "estado" },
            {
              header: "Detalle",
              accessor: "descripcionDetallada",
              render: (item) => (
                <button
                  onClick={() => setFilaSeleccionada(item)}
                  className="truncate max-w-50 text-left text-[#008237] hover:underline cursor-pointer"
                  title="Click para ver el detalle completo"
                >
                  Ver más
                </button>
              ),
            },
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
          <p className="text-gray-700 whitespace-pre-line">
            <strong>Descripción: </strong>
            {filaSeleccionada.descripcionDetallada}
          </p>
          <p className="text-gray-700 whitespace-pre-line flex flex-col">
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
