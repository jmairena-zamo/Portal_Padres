'use client'

import { InformacionEstudiante } from '@/app/components/informacionEstudiante/InformacionEstudiante'
import styles from "../../styles/tablas.module.css"

export default function EstadoCuenta(){
    //useAuth();

    return(
        <div className={styles.pageContent}>
            {/*< InformacionEstudiante />*/}
            <div className={styles.pageCard}>
                <h2>Estado de Cuenta</h2>
                <table className={styles.table}>
                    <thead className={styles.tableHead}>
                        <tr>
                            <th>ID</th>
                            <th>Fecha</th>
                            <th>Tipo Transacción</th>
                            <th>Descripción</th>
                            <th>Débito</th>
                            <th>Crédito</th>
                        </tr>
                    </thead>
                    <tbody className={styles.tableBody}>
                        <tr>
                            <td>1</td>
                            <td>{new Date().getFullYear()}</td>
                            <td>Factura</td>
                            <td>Matricula</td>
                            <td>1,200.00</td>
                            <td>0.00</td>
                        </tr>
                    </tbody>
                </table>
                <div className={styles.btnPages}>
                    <button>Anterior</button>
                    <span>Página 1</span>
                    <button>Siguiente</button>
                </div>
            </div>
        </div>
    )
}