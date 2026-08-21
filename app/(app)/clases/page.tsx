//Creado por Diego Castro
//Pagina donde se mostraran las clases que lleva un estudiante en el periodo actual
//Se mostrara la informacion de cada clase, como el codigo, nombre de la materia, seccion, periodo y nota

"use client";

import { InformacionEstudiante } from "@/app/components/informacionEstudiante/InformacionEstudiante";
import { Loading, Tabla, Titulo, Vacio } from "@/app/components/ui";
import { useClasesPeriodo } from "@/app/hooks/useClasesPeriodo";

export default function Clases() {
  // Estado para manejar la información de las clases del periodo actual
  const { clasesPeriodo, cargandoClases, errorClases, reintentarClase } =
    useClasesPeriodo();

  // Constante para saber si contiene data, de lo contrario mostrar mensaje de vacío
  const tieneData = clasesPeriodo.length > 0;

  if (cargandoClases) return <Loading />;

  return (
    <div className="flex flex-col mt-3.75 mx-3.75 gap-3.75">
      <InformacionEstudiante />
      <div className="bg-white px-5 pt-5 pb-10 shadow-[0px_1px_5px_rgba(0,0,0,0.2)] rounded-lg mb-3.75">
        <Titulo
          titulo={`Información academica, Año ${new Date().getFullYear()}, Periodo Actual`}
          alineado={3}
        />
        {/* Si hay error, mostramos mensaje; si no, mostramos la tabla */}
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
            titulo="No hay datos disponibles"
            descripcion="No se encontraron registros de Clases para mostrar"
          />
        ) : (
          <Tabla
            datos={clasesPeriodo}
            keyExtractor={(item) =>
              `${item.anio} - ${item.periodo} - ${item.asignatura}`
            }
            // claseFilaExtra={(item) =>
            //   parseFloat(item.calificacion) < 60 ? "bg-red-300" : ""
            // }
            columnas={[
              { header: "Año", accessor: "anio" },
              { header: "Periodo", accessor: "periodo" },
              { header: "Nombre Materia", accessor: "asignatura" },
              { header: "Calificación", accessor: "calificacion" },
            ]}
          />
        )}
      </div>
    </div>
  );
}
