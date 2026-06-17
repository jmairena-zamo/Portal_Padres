//Creado por Diego Castro
//Pagina donde se mostrara la información del estado de cuenta del estudiante

"use client";

import { InformacionEstudiante } from "@/app/components/informacionEstudiante/InformacionEstudiante";
import { Buscador, Loading, Paginacion, Tabla } from "@/app/components/ui";
import { MovimientoCuenta } from "@/app/respuestasAPI/estadoCuenta";
import { useEffect, useState } from "react";

interface FilaCuenta {
  id: number;
  fecha: string;
  descripcion: string;
  categoria: string;
  tipo: string;
  monto: number;
  saldo: number;
}

function mapearMovimiento(m: MovimientoCuenta): FilaCuenta {
  return {
    id: m.tbraccD_TRAN_NUMBER,
    fecha: new Date(m.tbraccD_EFFECTIVE_DATE).toLocaleDateString("es-HN"),
    descripcion: m.tbbdetC_DESC,
    categoria: m.ttvdcaT_DESC,
    tipo: m.tbbdetC_TYPE_IND_DESC,
    monto: m.tbraccD_AMOUNT,
    saldo: m.tbraccD_BALANCE,
  };
}

export default function EstadoCuenta() {
  const [paginaActual, setPaginaActual] = useState(1);
  const [registrosPorPagina, setRegistrosPorPagina] = useState(10);
  const [data, setData] = useState<FilaCuenta[]>([]);
  const [dataFiltrada, setDataFiltrada] = useState<FilaCuenta[]>([]);
  const [cargando, setCargando] = useState(true);
  const [balance, setBalance] = useState<number>(0);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const res = await fetch("/api/estudiantes/obtenerEstadoCuenta");
      const data = await res.json();
      const filas = (data.response.details as MovimientoCuenta[]).map(
        mapearMovimiento,
      );
      setData(filas);
      setDataFiltrada(filas);
      setBalance(data.response.balance);
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
      {/*< InformacionEstudiante />*/}
      <div className="bg-white p-5 shadow-[0px_3px_5px_3px_rgba(0,0,0,0.2)] rounded-[5px] mb-3.75">
        <h2 className="font-bold text-lg">Estado de Cuenta</h2>
        <Buscador
          datos={data}
          placeholder="Buscar..."
          campos={["tipo", "categoria"]}
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
              columnas={[
                { header: "ID", accessor: "id" },
                { header: "Fecha", accessor: "fecha" },
                { header: "Tipo Transacción", accessor: "tipo" },
                { header: "Descripción", accessor: "descripcion" },
                { header: "Categoria", accessor: "categoria" },
                { header: "Monto", accessor: "monto" },
                { header: "Saldo", accessor: "saldo" },
              ]}
            />

            <h2 className="font-bold text-lg mt-3.75">Balance: {balance}</h2>

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
    </div>
  );
}
