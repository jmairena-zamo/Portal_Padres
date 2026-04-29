import styles from './page.module.css'

export default function QuejasSugerencias(){
    return (
        <div className={styles.contentQS}>
            <form className={styles.mainform}>
                <h2>¡Quejas y Sugerencias!</h2>
                <h3>Siempre es un gusto saber su opinión sobre nuestro servicio</h3>
                <div className={styles.contentinputs}>
                    <div className={styles.inputgroup}>
                        <label>Telefono:
                        </label>
                        <input type="text" placeholder="Ingrese Telefono" className={styles.input}/>
                    </div>
                    <div className={styles.inputgroup}>
                        <label>Opción:</label>
                        <hr />
                        <div className={styles.radiogroup}>
                            <label htmlFor="">
                                <input
                                    type="radio"
                                    name="tipo"
                                    value="queja"
                                /> Queja
                            </label>
                            <label htmlFor="">

                                <input
                                    type="radio"
                                    name="tipo"
                                    value="sugerencia"
                                /> Sugerencia</label>
                        </div>

                    </div>
                    <div className={styles.inputgroup}>
                        <label htmlFor="">Asunto:</label>
                        <textarea 
                            placeholder="Ingrese Asunto"
                            className={styles.textarea }

                        /> 
                    </div>
                    <div className={styles.inputgroup}>
                        <label htmlFor="">Mensaje:</label>
                        <textarea 
                            placeholder="Ingrese su Comentario..."
                            className={styles.textarea }
                        /> 
                    </div>

                    <input className={styles.submit} type="submit" value="Enviar" />

                </div>

            </form>
        </div>
    )
}