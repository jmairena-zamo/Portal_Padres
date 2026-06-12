//Componente de buscador creado por Diego Castro
//Este es un componente generico para buscar

"use client";

import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";

interface BuscadorProps<T> {
  datos: T[];
  campos: (keyof T)[];
  placeholder?: string;
  // Se ejecuta cada que cambia el resultado del filtro
  // Recibe el arreglo filtrado, o completo si query esta vacio
  onResultado: (resultados: T[]) => void;
}

// Este componente recibe los datos en donde se buscara y que campo especifico(columna) es el que se buscara
// El resultado se envia al padre mediante onResultado()
export default function Buscador<T>({
  datos,
  campos,
  placeholder = "Buscar...",
  onResultado,
}: BuscadorProps<T>) {
  const [query, setQuery] = useState("");

  // Se ejecuta cada vez que query o datos cambian
  useEffect(() => {
    // Si query esta vacio devuelve todos los datos
    if (!query.trim()) {
      onResultado(datos);
      return;
    }

    const q = query.toUpperCase();

    // Obtiene los datos que tengan coincidencia con query(q)
    const filtrados = datos.filter((item) =>
      campos.some((campo) => {
        const valor = item[campo];
        return String(valor ?? "")
          .toUpperCase()
          .includes(q);
      }),
    );

    onResultado(filtrados);
  }, [query, datos]);

  return (
    <div className="relative flex items-center w-full">
      {/* Icono lupa */}
      <span className="absolute left-2.5 text-[14px] pointer-events-none opacity-50">
        <FaSearch />
      </span>

      <input
        type="text"
        className="w-full px-8 py-1.75 border border-black rounded-md text-[14px] outline-none transition-colors duration-200 focus:border-[#005221] focus:shadow-[0_0_0_2px_rgba(0,130,55,0.15)]"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {/* Botón para limpiar, solo se muestra cuando query no es vacio */}
      {query && (
        <button
          className="absolute right-2 bg-transparent border-none cursor-pointer text-[13px] text-black leading-none p-0 hover:text-[#333]"
          onClick={() => setQuery("")}
        >
          X
        </button>
      )}
    </div>
  );
}
