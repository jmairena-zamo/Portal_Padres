'use client'

import { useAuth } from '@/app/hooks/useAuth'
import styles from './page.module.css' 
import { InformacionEstudiante } from '@/app/components/informacionEstudiante/InformacionEstudiante'

export default function EstadoCuenta(){
    //useAuth();

    return(
        <div className={styles.cardsestadocuenta}>
            {/*< InformacionEstudiante />*/}
            <div className={styles.cardestadocuenta}>
                <h2>Estado de Cuenta</h2>
                <table className={styles.tableestadocuenta}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Fecha</th>
                            <th>Tipo Transacción</th>
                            <th>Descripción</th>
                            <th>Débito</th>
                            <th>Crédito</th>
                        </tr>
                    </thead>
                    <tbody>
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
                <div className={styles.btnpages}>
                    <button>
                        Anterior
                    </button>
                    <span>Página 1</span>
                    <button>
                        Siguiente
                    </button>
                </div>
            </div>
        </div>
    )
}