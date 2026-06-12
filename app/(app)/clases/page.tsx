//Creado por Diego Castro
//Pagina donde se mostraran las clases que lleva un estudiante en el periodo actual

"use client";

import { InformacionEstudiante } from "@/app/components/informacionEstudiante/InformacionEstudiante";
import { useState } from "react";
import { Tabla } from "@/app/components/ui";

export default function Clases() {
  const [data, setData] = useState([
    {
      id: 1,
      clase: "Ecología",
      seccion: "123",
      codigo: "CS69",
      acumulativo: 50,
      examenes: 35,
      faltas: 2,
    },
    {
      id: 2,
      clase: "Sociología",
      seccion: "124",
      codigo: "RE66",
      acumulativo: 45,
      examenes: 45,
      faltas: 4,
    },
  ]);

  const notaFinal = (a: number, b: number) => {
    return a + b;
  };

  return (
    <div className="flex flex-col mt-3.75 mx-3.75 gap-3.75">
      <InformacionEstudiante />
      <div className="bg-white p-5 shadow-[0px_3px_5px_3px_rgba(0,0,0,0.3)] rounded-[5px] mb-3.75">
        <h3 className="font-bold text-lg">
          Información academica, Año {new Date().getFullYear()}, Periodo 1
        </h3>
        <Tabla
          datos={data}
          keyExtractor={(item) => item.id}
          columnas={[
            { header: "ID", accessor: "id" },
            { header: "Nombre Materia", accessor: "clase" },
            { header: "Sección", accessor: "seccion" },
            { header: "Código", accessor: "codigo" },
            { header: "Acumulativo", accessor: "acumulativo" },
            { header: "Examenes", accessor: "examenes" },
            {
              header: "Nota",
              render: (item) => item.acumulativo + item.examenes,
            },
            { header: "Faltas", accessor: "faltas" },
          ]}
        />
      </div>
    </div>
  );
}
