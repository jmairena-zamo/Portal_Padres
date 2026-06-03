import React from "react"
import styles from "./Tabla.module.css"

interface Columna<Table> {
    header: string
    accessor?: keyof Table
    render?: (item: Table) => React.ReactNode
    width?: string
}

interface Props<Table> {
    columnas: Columna<Table>[]
    datos: Table[]
    keyExtractor: (item: Table) => string | number
    filaExpandida?: (item: Table) => React.ReactNode
    estaExpandida?: (item: Table) => boolean
    claseFilaExtra?: (item: Table) => string
}

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
                                        {col.render
                                            ? col.render(item)
                                            : col.accessor
                                                ? String(item[col.accessor] ?? '')
                                                : null}
                                    </td>
                                ))}
                            </tr>
                            {estaExpandida?.(item) && filaExpandida?.(item)}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    )
}