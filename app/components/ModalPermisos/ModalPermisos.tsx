//Componente creado por Diego Castro
//Componente para el modal permisos roles

import { Rol } from "@/app/interfaces/menus";
import styles from "./ModalPermisos.module.css"

interface Props{
    titulo: string //Encabezado del modal
    roles: Rol[] //Lista con todos los roles
    rolesSeleccionados: number[] //ID de los roles que tengan el permiso activo
    onToggle: (idRol: number) => void //activa o desactiva el rol
    onGuardar: () => void  //Guarda los cambios
    onCancelar: () => void  //Cierra el modal sin guardar
    guardando: boolean  //Bloquea botones si esta guardando
}

//Modal para asignar o quitar roles en un menu o submenu
export default function ModalPermisos({ titulo, roles, rolesSeleccionados, onToggle, onGuardar, onCancelar, guardando }: Props) {
    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <div className={styles.headModal}>
                    <h2>Permisos</h2>
                    <h2>{titulo}</h2>
                </div>
                {/* Lista de roles con su checkbox */}
                <div className={styles.listaRoles}>
                    {roles.map(rol => (
                        <label key={rol.iD_Rol} className={styles.rolItem}>
                            <span>{rol.rol}</span>
                            <input
                                type="checkbox"
                                checked={rolesSeleccionados.includes(rol.iD_Rol)}
                                onChange={() => onToggle(rol.iD_Rol)}
                            />
                        </label>
                    ))}
                </div>

                {/* Botones de guardar y cancelar */}
                <div className={styles.modalBtns}>
                    <button className={styles.Btncrear} onClick={onGuardar} disabled={guardando}>
                        {guardando ? 'Guardando...' : 'Guardar'}
                    </button>
                    <button className={styles.Btncancelar} onClick={onCancelar} disabled={guardando}>
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    )
}