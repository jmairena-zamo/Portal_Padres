import React from "react"
import styles from "./Tabla.module.css"

interface Columna<Table> {
    header: string //texto del encabezado de la columna
    accessor?: keyof Table //Clave del objeto
    render?: (item: Table) => React.ReactNode //Renderizado personalizado
    width?: string  //Ancho de la columna
}

interface Props<Table> {
    columnas: Columna<Table>[] //Se define la columna y como renderizar cada una
    datos: Table[]  //El arreglo de objetos que se mostraran en la tabla
    keyExtractor: (item: Table) => string | number  //Identificador unico por columna
    filaExpandida?: (item: Table) => React.ReactNode //Contenido de fila extendida, en este proyecto para los submenus
    estaExpandida?: (item: Table) => boolean  //Determinar si la fila esta expandida
    claseFilaExtra?: (item: Table) => string  //Mostrar ccs para fila expandida
}

//Tabla generica que soporta renderizado personalizado en sus columnas
export default function Tabla<Table>({ columnas, datos, keyExtractor, filaExpandida, estaExpandida, claseFilaExtra }: Props<Table>) {
    return (
        <div className={styles.wrapper}>
            <table className={styles.table}>
                <thead className={styles.thead}>
                    <tr>
                        {columnas.map((col, i) => (
                            <th key={i} style={col.width ? { width: col.width } : {}}>
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className={styles.tbody}>
                    {datos.map(item => (
                        <React.Fragment key={keyExtractor(item)}>
                            <tr key={keyExtractor(item)} className={claseFilaExtra?.(item) ?? ''}>
                                {columnas.map((col, i) => (
                                    <td key={i}>
                                        {/* render tiene prioridad; si no hay, usa accessor; si no, vacío */}
                                        {col.render
                                            ? col.render(item)
                                            : col.accessor
                                                ? String(item[col.accessor] ?? '')
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
    )
}