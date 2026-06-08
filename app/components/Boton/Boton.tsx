//Componente de Botones creado por Diego Castro/Practicanteit2
//Este componente es para poder reutilizar botones 

import styles from './Boton.module.css'

interface Props {
    onClick?: () => void
    disabled?: boolean
    type?: 'button' | 'submit' | 'reset' //Los tipos de botones que pueden ser enviados, por default es button
    children: React.ReactNode
    title?: string
}

//Boton para Acciones de aceptar, editar o confirmar
export const BtnV1 = ({ onClick, disabled, type = 'button', children, title }: Props) => (
    <button className={styles.v1} onClick={onClick} disabled={disabled} type={type} title={title}>
        {children}
    </button>
)

//Boton para Acciones de eliminar y cancelar
export const BtnV2 = ({ onClick, disabled, type = 'button', children, title }: Props) => (
    <button className={styles.v2} onClick={onClick} disabled={disabled} type={type} title={title}>
        {children}
    </button>
)

//Boton alternativo, utilizado para el boton de gestionar roles de este proyecto
export const BtnV3 = ({ onClick, disabled, type = 'button', children, title }: Props) => (
    <button className={styles.v3} onClick={onClick} disabled={disabled} type={type} title={title}>
        {children}
    </button>
)