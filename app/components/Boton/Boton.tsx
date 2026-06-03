import styles from './Boton.module.css'

interface Props {
    onClick?: () => void
    disabled?: boolean
    type?: 'button' | 'submit' | 'reset'
    children: React.ReactNode
    title?: string
}

export const BtnV1 = ({ onClick, disabled, type = 'button', children, title }: Props) => (
    <button className={styles.v1} onClick={onClick} disabled={disabled} type={type} title={title}>
        {children}
    </button>
)

export const BtnV2 = ({ onClick, disabled, type = 'button', children, title }: Props) => (
    <button className={styles.v2} onClick={onClick} disabled={disabled} type={type} title={title}>
        {children}
    </button>
)

export const BtnV3 = ({ onClick, disabled, type = 'button', children, title }: Props) => (
    <button className={styles.v3} onClick={onClick} disabled={disabled} type={type} title={title}>
        {children}
    </button>
)