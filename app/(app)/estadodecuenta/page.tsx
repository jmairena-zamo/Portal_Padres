//Creado por Diego Castro
//Pagina donde se mostrara la información del estado de cuenta del estudiante

"use client";

import { InformacionEstudiante } from "@/app/components/informacionEstudiante/InformacionEstudiante";
import {
  Buscador,
  Loading,
  Paginacion,
  Tabla,
  Titulo,
  Vacio,
} from "@/app/components/ui";
import { useEstadoCuenta } from "@/app/hooks/useEstadoCuenta";
import {
  FilaCuenta,
  mapearMovimiento,
  MovimientoCuenta,
} from "@/app/respuestasAPI/estadoCuenta";
import { useEffect, useState } from "react";

export default function EstadoCuenta() {
  const [paginaActual, setPaginaActual] = useState(1);
  const [registrosPorPagina, setRegistrosPorPagina] = useState(10);
  const [dataFiltrada, setDataFiltrada] = useState<FilaCuenta[]>([]);

  const {
    estadoCuenta,
    cargandoEstadoCuenta,
    errorEstadoCuenta,
    reintentarEstadoCuenta,
    balance,
  } = useEstadoCuenta();

  const handleCambiarRegistros = (cantidad: number) => {
    setRegistrosPorPagina(cantidad);
    setPaginaActual(1);
  };

  const indexInicio = (paginaActual - 1) * registrosPorPagina;
  const indexFin = indexInicio + registrosPorPagina;
  const datosPaginados = dataFiltrada.slice(indexInicio, indexFin);

  if (cargandoEstadoCuenta) return <Loading />;

  return (
    <div className="flex flex-col mt-3.75 mx-3.75 gap-3.75">
      {/*< InformacionEstudiante />*/}
      <div className="bg-white p-5 shadow-[0px_3px_5px_3px_rgba(0,0,0,0.2)] rounded-[5px] mb-3.75">
        <Titulo titulo="Estado de Cuenta" alineado={3} />
        <div className="mt-2.5">
          <Buscador
            datos={estadoCuenta}
            placeholder="Buscar..."
            campos={["tipo", "categoria", "descripcion"]}
            onResultado={(resultados) => {
              setDataFiltrada(resultados);
              setPaginaActual(1);
            }}
          />
        </div>

        {cargandoEstadoCuenta ? (
          <Loading />
        ) : errorEstadoCuenta ? (
          <Vacio
            titulo="Ocurrio un error"
            descripcion="No se pudo obtener la información"
            onReintentar={reintentarEstadoCuenta}
          />
        ) : (
          <>
            <Tabla
              datos={datosPaginados}
              keyExtractor={(item) => item.id}
              columnas={[
                { header: "ID", accessor: "id" },
                { header: "Fecha", accessor: "fecha" },
                { header: "Tipo Transacción", accessor: "tipo" },
                { header: "Descripción", accessor: "descripcion" },
                { header: "Categoria", accessor: "categoria" },
                { header: "Monto", accessor: "monto" },
                { header: "Saldo", accessor: "saldo" },
                { header: "Intereses", accessor: "intereses" },
              ]}
            />

            <h2 className="font-bold text-[16px] text-[#173426] mt-3.75 mb-3.75 ml-3.5">
              Balance: {balance}
            </h2>

            <Paginacion
              totalRegistros={estadoCuenta.length}
              registrosPorPagina={registrosPorPagina}
              paginaActual={paginaActual}
              onCambiarPagina={setPaginaActual}
              onCambiarRegistrosPorPagina={handleCambiarRegistros}
            />
          </>
        )}
      </div>
    </div>
  );
}
