//Componente creado por Diego Castro
//Componente para filtrar por medio de un ComboBox real

import { useEffect, useRef, useState } from "react";

interface Opcion {
  value: number | string;
  label: string;
}

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
  const [inputValue, setInputValue] = useState("");
  const [abierto, setAbierto] = useState(false);
  const blurTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sincroniza el texto mostrado con el "valor" real (id) que viene del padre.
  useEffect(() => {
    if (valor === "todos" || valor === undefined || valor === "") {
      setInputValue("");
      return;
    }
    const seleccionada = opciones.find(
      (o) => o.value.toString() === valor.toString(),
    );
    setInputValue(seleccionada ? seleccionada.label : "");
  }, [valor, opciones]);

  // Mientras el usuario escribe, solo filtramos la lista visualmente.
  // NO se llama a onChange aquí.
  const opcionesFiltradas = opciones.filter((o) =>
    o.label.toLowerCase().includes(inputValue.toLowerCase()),
  );

  const seleccionarOpcion = (opcion: Opcion) => {
    setInputValue(opcion.label);
    onChange(opcion.value);
    setAbierto(false);
  };

  const seleccionarTodos = () => {
    setInputValue("");
    onChange("todos");
    setAbierto(false);
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        className="py-2.25 pr-8 pl-1.25 border border-gray-300 text-[#30545b] rounded-md text-[14px] 
                   bg-white w-full outline-none focus:border-[#005221] focus:shadow-[0_0_0_2px_rgba(0,130,55,0.15)]"
        placeholder={placeholder}
        value={inputValue}
        onFocus={() => {
          if (blurTimeout.current) clearTimeout(blurTimeout.current);
          setAbierto(true);
        }}
        onChange={(e) => {
          setInputValue(e.target.value);
          setAbierto(true);
        }}
        onBlur={() => {
          // Delay para permitir que el click en un <li> se registre
          // antes de cerrar el dropdown.
          blurTimeout.current = setTimeout(() => {
            setAbierto(false);
            const seleccionada = opciones.find((o) => o.label === inputValue);
            if (!seleccionada) {
              const actual = opciones.find(
                (o) => o.value.toString() === valor.toString(),
              );
              setInputValue(actual ? actual.label : "");
            }
          }, 150);
        }}
      />
      {abierto && (
        <ul className="absolute z-10 bg-white border border-gray-300 rounded-md mt-1 max-h-40 overflow-y-auto w-full">
          <li
            className="px-2 py-1 cursor-pointer hover:bg-gray-100"
            onMouseDown={(e) => e.preventDefault()}
            onClick={seleccionarTodos}
          >
            {placeholder}
          </li>
          {opcionesFiltradas.length > 0 ? (
            opcionesFiltradas.map((opcion) => (
              <li
                key={opcion.value}
                className="px-2 py-1 cursor-pointer hover:bg-gray-100"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => seleccionarOpcion(opcion)}
              >
                {opcion.label}
              </li>
            ))
          ) : (
            <li className="px-2 py-1 text-gray-400">Sin resultados</li>
          )}
        </ul>
      )}
    </div>
  );
}
