//Componente creado por Diego Castro
//Componente para filtrar por medio de un ComboBox

//Modelo para opciones que se veran en el ComboBox
interface Opcion {
    value: number | string
    label: string
}

//Propiedades que recibe el componente
interface Props {
    opciones: Opcion[] 
    valor: number | string 
    onChange: (value: number | 'todos') => void
    placeholder?: string
}

export default function ComboBoxFiltro({ opciones, valor, onChange, placeholder = 'Todos' }: Props) {
    return (
        <select
            className="py-[9px] pr-8 pl-[5px] border border-black rounded-md text-[14px] text-[#333] 
                    cursor-pointer bg-white w-full outline-none focus:border-[#005221] focus:shadow-[0_0_0_2px_rgba(0,130,55,0.15)]"
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