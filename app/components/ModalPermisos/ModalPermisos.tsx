import { Rol } from "@/app/interfaces/menus";
import styles from "./ModalPermisos.module.css"

interface Props{
    titulo: string
    roles: Rol[]
    rolesSeleccionados: number[]
    onToggle: (idRol: number) => void
    onGuardar: () => void
    onCancelar: () => void
    guardando: boolean
}

export default function ModalPermisos({ titulo, roles, rolesSeleccionados, onToggle, onGuardar, onCancelar, guardando }: Props) {
    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <div className={styles.headModal}>
                    <h2>Permisos</h2>
                    <h2>{titulo}</h2>
                </div>
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