import { TiStarFullOutline } from "react-icons/ti"
import styles from "./ModalFormulario.module.css"

//Campo individual dentro del modal
interface Campo {
    label: string
    //El contenido del campo puede ser select, input, etc.
    content: React.ReactNode
}

//Props del componente
interface Props {
    titulo: string //Encabezado del Modal
    campos: Campo[] //Lista de campos a renderizar
    onConfirmar: () => void //Boton para confirmar/aceptar
    onCancelar: () => void //Boton para cancelar
    txtConfirmar?: string //texto que se muestra en el boton de confirmar
    deshabilitado?: boolean //deshabilita el boton de confirmar
}


//Modal generico que recibe titulo, campos y tiene dos botones
//Recibe una lista dinamica de campos

export default function ModalFormulario({ titulo, campos, onConfirmar, onCancelar, txtConfirmar = "Guardar", deshabilitado = false }: Props) {
    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <div className={styles.headModal}>
                    <h2>{titulo}</h2>
                </div>
                {/* renderizado de la lista de campos */}
                {campos.map((campo, i) => (
                    <div key={i} className={styles.formGroup}>
                        <label>{campo.label}</label>
                        {campo.content}
                    </div>
                ))}
                <div className={styles.modalBtns}>
                    <button className={styles.Btncrear} disabled={deshabilitado} onClick={onConfirmar}>
                        {txtConfirmar}
                    </button>
                    <button className={styles.Btncancelar} onClick={onCancelar}>
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    )
}