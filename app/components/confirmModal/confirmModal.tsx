//Componente creado por Diego Castro

import styles from './confirmModal.module.css';

interface Props {
    mensaje: string; //Mnesaje que se le muestra al usuario antes de confirmar
    onConfirmar: () => void; //Se ejecuta al presionar aceptar
    onCancelar: () => void; //Se ejecuta al presionar cancelar
}

//Modal de confirmación
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