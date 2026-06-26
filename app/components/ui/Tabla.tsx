import React from "react";

interface Columna<Table> {
  header: string; // texto del encabezado de la columna
  accessor?: keyof Table; // clave del objeto
  render?: (item: Table) => React.ReactNode; // renderizado personalizado
  width?: string; // ancho de la columna
}

interface Props<Table> {
  columnas: Columna<Table>[]; // columnas y cómo renderizar cada una
  datos: Table[]; // arreglo de objetos a mostrar
  keyExtractor: (item: Table) => string | number; // identificador único por fila
  filaExpandida?: (item: Table) => React.ReactNode; // contenido de fila expandida (submenús)
  estaExpandida?: (item: Table) => boolean; // determina si la fila está expandida
  claseFilaExtra?: (item: Table) => string; // clases CSS para fila expandida
}

// Tabla genérica que soporta renderizado personalizado en sus columnas
export default function Tabla<Table>({
  columnas,
  datos,
  keyExtractor,
  filaExpandida,
  estaExpandida,
  claseFilaExtra,
}: Props<Table>) {
  return (
    <div className="w-full mt-6.25 max-[800px]:overflow-x-auto max-[800px]:box-border">
      <table className="w-full border-collapse border border-white max-[800px]:whitespace-nowrap max-[800px]:min-w-125">
        <thead>
          <tr>
            {columnas.map((col, i) => (
              <th
                key={i}
                style={col.width ? { width: col.width } : {}}
                className="border border-white text-center bg-[rgb(176,192,173)] p-2 rounded-[5px] 
                                max-[420px]:px-1 max-[420px]:py-1.5 max-[420px]:text-[12px]"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {datos.map((item) => (
            <React.Fragment key={keyExtractor(item)}>
              <tr className={claseFilaExtra?.(item) ?? ""}>
                {columnas.map((col, i) => (
                  <td
                    key={i}
                    className="w-auto text-center p-2.5 border-b border-b-black 
                                        max-[420px]:px-1 max-[420px]:py-1.5 max-[420px]:text-[12px]"
                  >
                    {/* render tiene prioridad; si no hay, usa accessor; si no, vacío */}
                    {col.render
                      ? col.render(item)
                      : col.accessor
                        ? item[col.accessor] !== undefined &&
                          item[col.accessor] !== null
                          ? String(item[col.accessor])
                          : "N/A"
                        : null}
                  </td>
                ))}
              </tr>

              {/* Fila extra que se muestra solo si la fila está marcada como expandida */}
              {estaExpandida?.(item) && filaExpandida?.(item)}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
