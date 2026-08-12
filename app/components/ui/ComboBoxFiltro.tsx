//Componente creado por Diego Castro
//Componente para filtrar por medio de un select nativo con estilo personalizado
"use client";

// Props para el componente Opcion
interface Opcion {
  value: number | string;
  label: string;
}

// Props para el componente ComboBoxFiltro
interface Props {
  opciones: Opcion[];
  valor: number | string | "todos";
  onChange: (value: number | string | "todos") => void;
  placeholder?: string;
}

export default function ComboBoxFiltro({
  opciones,
  valor,
  onChange,
  placeholder = "Todos",
}: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;

    if (selectedValue === "todos") {
      onChange("todos");
      return;
    }

    const opcion = opciones.find(
      (item) => item.value.toString() === selectedValue,
    );

    onChange(opcion ? opcion.value : selectedValue);
  };

  const valorActual = valor === "todos" ? "todos" : valor.toString();

  return (
    <div className="relative w-full">
      <select
        value={valorActual}
        onChange={handleChange}
        className="appearance-none py-2.25 pr-8 pl-1.25 border border-gray-300 text-[#30545b] rounded-lg text-[14px] bg-white w-full outline-none focus:border-[#005221] focus:shadow-[0_0_0_2px_rgba(0,130,55,0.15)]"
      >
        <option value="todos">{placeholder}</option>
        {opciones.map((opcion) => (
          <option key={opcion.value} value={opcion.value.toString()}>
            {opcion.label}
          </option>
        ))}
      </select>

      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
        <svg
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-[#30545b]"
          aria-hidden="true"
        >
          <path
            d="M5 7.5L10 12.5L15 7.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
