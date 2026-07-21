//Componente creado por Diego Castro
//Componente para filtrar por medio de un ComboBox real
"use client";

import { useRef, useState } from "react";

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

// Estado interno del componente ComboBoxFiltro
interface ComboState {
  inputValue: string;
  prevValor: number | string | "todos";
  prevOpciones: Opcion[];
}

// Función auxiliar para calcular la etiqueta a mostrar en el input del ComboBox
function calcularLabel(
  valor: number | string | "todos",
  opciones: Opcion[],
): string {
  if (valor === "todos" || valor === undefined || valor === "") return "";
  const seleccionada = opciones.find(
    (o) => o.value.toString() === valor.toString(),
  );
  return seleccionada ? seleccionada.label : "";
}

export default function ComboBoxFiltro({
  opciones,
  valor,
  onChange,
  placeholder = "Todos",
}: Props) {
  const [combo, setCombo] = useState<ComboState>(() => ({
    inputValue: calcularLabel(valor, opciones),
    prevValor: valor,
    prevOpciones: opciones,
  }));
  const [abierto, setAbierto] = useState(false);

  // Referencia para manejar el tiempo de espera al perder el foco del input
  const blurTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Actualiza el estado del ComboBox si cambian las opciones o el valor seleccionado
  if (combo.prevValor !== valor || combo.prevOpciones !== opciones) {
    setCombo({
      inputValue: calcularLabel(valor, opciones),
      prevValor: valor,
      prevOpciones: opciones,
    });
  }

  const { inputValue } = combo;

  // Mientras el usuario escribe, solo filtra la lista visualmente.
  const opcionesFiltradas = opciones.filter((o) =>
    o.label.toLowerCase().includes(inputValue.toLowerCase()),
  );

  // Función para seleccionar una opción del ComboBox
  const seleccionarOpcion = (opcion: Opcion) => {
    setCombo((prev) => ({ ...prev, inputValue: opcion.label }));
    onChange(opcion.value);
    setAbierto(false);
  };

  // Función para seleccionar la opción "Todos" del ComboBox
  const seleccionarTodos = () => {
    setCombo((prev) => ({ ...prev, inputValue: "" }));
    onChange("todos");
    setAbierto(false);
  };

  return (
    <div className="relative w-full">
      {/* Input del ComboBox */}
      <input
        type="text"
        className="py-2.25 pr-8 pl-1.25 border border-gray-300 text-[#30545b] rounded-lg text-[14px] 
                   bg-white w-full outline-none focus:border-[#005221] focus:shadow-[0_0_0_2px_rgba(0,130,55,0.15)]"
        placeholder={placeholder}
        value={inputValue}
        onFocus={() => {
          if (blurTimeout.current) clearTimeout(blurTimeout.current);
          setAbierto(true);
        }}
        onChange={(e) => {
          const nuevoValor = e.target.value;
          setCombo((prev) => ({ ...prev, inputValue: nuevoValor }));
          setAbierto(true);
        }}
        onBlur={() => {
          blurTimeout.current = setTimeout(() => {
            setAbierto(false);
            setCombo((prev) => {
              const seleccionada = opciones.find(
                (o) => o.label === prev.inputValue,
              );
              if (!seleccionada) {
                return { ...prev, inputValue: calcularLabel(valor, opciones) };
              }
              return prev;
            });
          }, 150);
        }}
      />
      {/* Lista desplegable del ComboBox */}
      {abierto && (
        <ul className="absolute z-10 bg-white border border-gray-300 rounded-lg mt-1 max-h-40 overflow-y-auto w-full">
          <li>
            {/* Botón para seleccionar la opción "Todos" */}
            <button
              type="button"
              className="px-2 py-1 cursor-pointer hover:bg-gray-100 text-gray-400"
              onMouseDown={(e) => e.preventDefault()}
              onClick={seleccionarTodos}
            >
              {placeholder}
            </button>
          </li>
          {/* Renderiza las opciones filtradas o un mensaje si no hay resultados */}
          {opcionesFiltradas.length > 0 ? (
            opcionesFiltradas.map((opcion) => (
              <li key={opcion.value}>
                {/* Botón para seleccionar una opción específica */}
                <button
                  type="button"
                  className="px-2 py-1 cursor-pointer font-bold hover:bg-gray-100 w-full text-left"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => seleccionarOpcion(opcion)}
                >
                  {opcion.label}
                </button>
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
