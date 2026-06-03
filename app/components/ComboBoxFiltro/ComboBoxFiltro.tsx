import styles from "./ComboBoxFiltro.module.css"

interface Opcion {
    value: number | string
    label: string
}

interface Props {
    opciones: Opcion[]
    valor: number | string
    onChange: (value: number | 'todos') => void
    placeholder?: string
}

export default function ComboBoxFiltro({ opciones, valor, onChange, placeholder = 'Todos' }: Props) {
    return (
        <select
            className={styles.combo}
            value={valor}
            onChange={e => onChange(e.target.value === 'todos' ? 'todos' : Number(e.target.value))}
        >
            <option value="todos">{placeholder}</option>
            {opciones.map(opcion => (
                <option key={opcion.value} value={opcion.value}>{opcion.label}</option>
            ))}
        </select>
    )
}