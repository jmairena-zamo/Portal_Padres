//Componente creado por Diego Castro
//Componente para filtrar por medio de un ComboBox

//Modelo para opciones que se veran en el ComboBox
interface Opcion {
  value: number | string;
  label: string;
}

//Propiedades que recibe el componente
interface Props {
  opciones: Opcion[];
  valor: number | string;
  onChange: (value: number | string | "todos") => void;
  placeholder?: string;
}

export default function ComboBoxFiltro({
  opciones,
  valor,
  onChange,
  placeholder = "Todos",
}: Props) {
  return (
    <select
      className="py-2.25 pr-8 pl-1.25 border border-gray-300 text-[#30545b] rounded-md text-[14px] text-[#333] 
                    cursor-pointer bg-white w-full outline-none focus:border-[#005221] focus:shadow-[0_0_0_2px_rgba(0,130,55,0.15)]"
      value={valor}
      onChange={(e) => {
        const val = e.target.value;
        if (val === "todos") return onChange("todos");
        const opcionOriginal = opciones.find((o) => String(o.value) === val);
        onChange(opcionOriginal?.value ?? val);
      }}
    >
      <option value="todos">{placeholder}</option>
      {opciones.map((opcion) => (
        <option key={opcion.value} value={opcion.value}>
          {opcion.label}
        </option>
      ))}
    </select>
  );
}
