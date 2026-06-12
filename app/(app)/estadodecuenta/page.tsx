//Creado por Diego Castro
//Pagina donde se mostrara la información del estado de cuenta del estudiante

"use client";

import { InformacionEstudiante } from "@/app/components/informacionEstudiante/InformacionEstudiante";
import { Paginacion, Tabla } from "@/app/components/ui";
import { useState } from "react";

export default function EstadoCuenta() {
  const [paginaActual, setPaginaActual] = useState(1);
  const [registrosPorPagina, setRegistrosPorPagina] = useState(10);
  const [data, setData] = useState([
    {
      id: 1,
      fecha: "Quimica",
      tipo: "123",
      descripcion: "CC05",
      debito: "2025",
      credito: 3,
    },
  ]);

  const handleCambiarRegistros = (cantidad: number) => {
    setRegistrosPorPagina(cantidad);
    setPaginaActual(1);
  };

  const indexInicio = (paginaActual - 1) * registrosPorPagina;
  const indexFin = indexInicio + registrosPorPagina;
  const datosPaginados = data.slice(indexInicio, indexFin);

  return (
    <div className="flex flex-col mt-3.75 mx-3.75 gap-3.75">
      {/*< InformacionEstudiante />*/}
      <div className="bg-white p-5 shadow-[0px_3px_5px_3px_rgba(0,0,0,0.3)] rounded-[5px] mb-3.75">
        <h2 className="font-bold text-lg">Estado de Cuenta</h2>
        <Tabla
          datos={datosPaginados}
          keyExtractor={(item) => item.id}
          columnas={[
            { header: "ID", accessor: "id" },
            { header: "Fecha", accessor: "fecha" },
            { header: "Tipo Transacción", accessor: "tipo" },
            { header: "Descripción", accessor: "descripcion" },
            { header: "Débito", accessor: "debito" },
            { header: "Crédito", accessor: "credito" },
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
    </div>
  );
}
