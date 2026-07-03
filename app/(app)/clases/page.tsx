//Creado por Diego Castro
//Pagina donde se mostraran las clases que lleva un estudiante en el periodo actual

"use client";

import { InformacionEstudiante } from "@/app/components/informacionEstudiante/InformacionEstudiante";
import { useEffect, useState } from "react";
import { Loading, Tabla, Titulo } from "@/app/components/ui";
import { useClasesPeriodo } from "@/app/hooks/useClasesPeriodo";

export default function Clases() {
  const [cargando, setCargando] = useState<boolean>(false);
  // const [data, setData] = useState([
  //   {
  //     id: 1,
  //     clase: "Ecología",
  //     seccion: "123",
  //     codigo: "CS69",
  //     acumulativo: 50,
  //     examenes: 35,
  //     faltas: 2,
  //   },
  //   {
  //     id: 2,
  //     clase: "Sociología",
  //     seccion: "124",
  //     codigo: "RE66",
  //     acumulativo: 45,
  //     examenes: 45,
  //     faltas: 4,
  //   },
  // ]);

  // const notaFinal = (a: number, b: number) => {
  //   return a + b;
  // };

  const { clasesPeriodo, cargandoClases, errorClases, reintentarClase } =
    useClasesPeriodo();

  useEffect(() => {
    setCargando(true);
    setTimeout(() => setCargando(false), 1000);
  }, []);

  if (cargando) return <Loading />;

  return (
    <div className="flex flex-col mt-3.75 mx-3.75 gap-3.75">
      <InformacionEstudiante />
      <div className="bg-white p-5 shadow-[0px_3px_5px_3px_rgba(0,0,0,0.3)] rounded-[5px] mb-3.75">
        <Titulo
          titulo={`Información academica, Año ${new Date().getFullYear()}, Periodo Actual`}
          alineado={3}
        />
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
      </div>
    </div>
  );
}
