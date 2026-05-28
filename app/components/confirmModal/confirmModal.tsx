import styles from './confirmModal.module.css';

interface Props {
    mensaje: string;
    onConfirmar: () => void;
    onCancelar: () => void;
}

export default function ConfirmModal({ mensaje, onConfirmar, onCancelar }: Props) {
    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <div className={styles.headModal}>
                    <h2>¿Estás seguro?</h2>
                </div>
                <p className={styles.mensajeConfirm}>{mensaje}</p>
                <div className={styles.modalBtns}>
                    <button onClick={onConfirmar} className={styles.BtnAceptar}>
                        Aceptar
                    </button>
                    <button onClick={onCancelar} className={styles.Btncancelar}>
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
}