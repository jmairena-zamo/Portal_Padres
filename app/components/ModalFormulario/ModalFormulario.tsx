import styles from "./ModalFormulario.module.css"

interface Campo {
    label: string
    content: React.ReactNode
}

interface Props {
    titulo: string
    campos: Campo[]
    onConfirmar: () => void
    onCancelar: () => void
    txtConfirmar?: string
    deshabilitado?: boolean
}

export default function ModalFormulario({ titulo, campos, onConfirmar, onCancelar, txtConfirmar = "Guardar", deshabilitado = false }: Props) {
    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <div className={styles.headModal}>
                    <h2>{titulo}</h2>
                </div>
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