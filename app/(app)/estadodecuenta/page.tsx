// Creado por Diego Castro
// Página donde se muestra el estado de cuenta del estudiante
// Se mostrará la información de cada transacción, como el ID,
// fecha, tipo de transacción, descripción, categoría, monto, saldo e intereses

"use client";

import {
  Buscador,
  Loading,
  Paginacion,
  Tabla,
  Titulo,
  Vacio,
} from "@/app/components/ui";
import { useEstadoCuenta } from "@/app/hooks/useEstadoCuenta";
import { FilaCuenta } from "@/app/interfaces/estadoCuenta";
import { useCallback, useState } from "react";

export default function EstadoCuenta() {
  // Estado para manejar la paginación (qué página y cuántos registros mostrar)
  const [paginacion, setPaginacion] = useState({
    paginaActual: 1,
    registrosPorPagina: 10,
  });

  // Estado para manejar la búsqueda (si está activa y qué datos mostrar)
  const [busqueda, setBusqueda] = useState({
    dataFiltrada: [] as FilaCuenta[],
    busquedaActiva: false,
  });

  // Hook que trae la información del estado de cuenta
  const {
    estadoCuenta,
    cargandoEstadoCuenta,
    errorEstadoCuenta,
    reintentarEstadoCuenta,
    balance,
  } = useEstadoCuenta();

  // Función que se ejecuta cuando se hace una búsqueda
  const handleResultadoBusqueda = useCallback((resultados: FilaCuenta[]) => {
    setBusqueda({ dataFiltrada: resultados, busquedaActiva: true });
    setPaginacion((prev) => ({ ...prev, paginaActual: 1 })); // Reinicia a la primera página
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

  // Si hay búsqueda activa, mostramos los resultados filtrados; si no, todo el estado de cuenta
  const datosAMostrar = busquedaActiva ? dataFiltrada : estadoCuenta;

  // Calculamos qué registros mostrar según la página y cantidad seleccionada
  const indexInicio = (paginaActual - 1) * registrosPorPagina;
  const indexFin = indexInicio + registrosPorPagina;
  const datosPaginados = datosAMostrar.slice(indexInicio, indexFin);

  // Constante para saber si contiene data, de lo contrario mostrar mensaje de vacío
  const tieneData = datosPaginados && datosPaginados.length > 0;

  // Si está cargando, mostramos el componente de carga
  if (cargandoEstadoCuenta) return <Loading />;

  return (
    <div className="flex flex-col mt-3.75 mx-3.75 gap-3.75">
      {/*< InformacionEstudiante />*/}

      <div className="bg-white p-5 shadow-[0px_1px_5px_rgba(0,0,0,0.2)] rounded-lg mb-3.75">
        <Titulo titulo="Estado de Cuenta" alineado={3} />

        {/* Buscador para filtrar registros */}
        {!errorEstadoCuenta && (
          <div className="mt-2.5">
            <Buscador
              datos={estadoCuenta}
              placeholder="Buscar..."
              campos={["tipo", "categoria", "descripcion"]}
              onResultado={handleResultadoBusqueda}
            />
          </div>
        )}

        {/* Si hay error, mostramos mensaje; si no, mostramos la tabla */}
        {errorEstadoCuenta ? (
          <Vacio
            titulo="Ocurrió un error"
            descripcion="No se pudo obtener la información"
            onReintentar={reintentarEstadoCuenta}
          />
        ) : !tieneData ? (
          <Vacio
            titulo="No hay datos disponibles"
            descripcion="No se encontraron registros para mostrar"
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

            {/* Controles de paginación */}
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
    </div>
  );
}
