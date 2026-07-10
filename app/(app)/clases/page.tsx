//Creado por Diego Castro
//Pagina donde se mostraran las clases que lleva un estudiante en el periodo actual

"use client";

import { InformacionEstudiante } from "@/app/components/informacionEstudiante/InformacionEstudiante";
import { useEffect, useState } from "react";
import { Loading, Tabla, Titulo, Vacio } from "@/app/components/ui";
import { useClasesPeriodo } from "@/app/hooks/useClasesPeriodo";

export default function Clases() {
  const { clasesPeriodo, cargandoClases, errorClases, reintentarClase } =
    useClasesPeriodo();

  const tieneData = clasesPeriodo.length > 0;

  if (cargandoClases) return <Loading />;

  return (
    <div className="flex flex-col mt-3.75 mx-3.75 gap-3.75">
      <InformacionEstudiante />
      <div className="bg-white p-5 shadow-[0px_3px_5px_3px_rgba(0,0,0,0.3)] rounded-[5px] mb-3.75">
        <Titulo
          titulo={`Información academica, Año ${new Date().getFullYear()}, Periodo Actual`}
          alineado={3}
        />
        {cargandoClases ? (
          <Loading />
        ) : errorClases ? (
          <Vacio
            titulo="Ocurrio un Error."
            descripcion="No se pudo cargar la información de clases."
            onReintentar={reintentarClase}
          />
        ) : !tieneData ? (
          <Vacio
            titulo="No hay información."
            descripcion="No existe información de clases."
          />
        ) : (
          <Tabla
            datos={clasesPeriodo}
            keyExtractor={(item) => item.codigo}
            claseFilaExtra={(item) =>
              parseFloat(item.Nota) < 60 ? "bg-red-300" : ""
            }
            columnas={[
              { header: "Codigo", accessor: "codigo" },
              { header: "Nombre Materia", accessor: "asignatura" },
              { header: "Sección", accessor: "seccion" },
              { header: "Periodo", accessor: "periodo" },
              { header: "Nota", accessor: "Nota" },
            ]}
          />
        )}
      </div>
    </div>
  );
}
