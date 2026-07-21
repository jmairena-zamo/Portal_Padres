// Componente de buscador creado por Diego Castro
// Este es un componente generico para buscar

"use client";

import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";

interface BuscadorProps<T> {
  datos?: T[];
  campos?: (keyof T)[];
  placeholder?: string;
  // Se ejecuta cada que cambia el resultado del filtro
  // Recibe el arreglo filtrado, o completo si query esta vacio
  // Solo se aplica si se mandan datos
  onResultado?: (resultados: T[]) => void;

  // Se ejecuta despues de los 500ms
  // dispara el fetch para buscar
  onQueryChange?: (query: string) => void;
}

// Este componente recibe los datos en donde se buscara y que campo especifico(columna) es el que se buscara
// El resultado se envia al padre mediante onResultado()
export default function Buscador<T>({
  datos,
  campos,
  placeholder = "Buscar...",
  onResultado,
  onQueryChange,
}: BuscadorProps<T>) {
  const [query, setQuery] = useState("");
  const [queryDelay, setQueryDelay] = useState("");

  // Se ejecuta cada que query cambia
  // Espera 500ms para actualizar queryDelay
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setQueryDelay(query);
    }, 500);

    // Si query cambia antes de los 500ms, se cancela el timeout anterior
    return () => clearTimeout(timeoutId);
  }, [query]);

  // Modo servidor del buscador
  // No busca local, y le manda el texto al padre
  useEffect(() => {
    onQueryChange?.(queryDelay.trim());
  }, [queryDelay]);

  // Se ejecuta cada vez que queryDelay, datos u onResultado cambian
  useEffect(() => {
    if (!datos || !campos || !onResultado) return;

    // Si query esta vacio devuelve todos los datos
    if (!queryDelay.trim()) {
      onResultado(datos);
      return;
    }

    const q = queryDelay.toUpperCase();

    // Obtiene los datos que tengan coincidencia con query(q)
    const filtrados = datos.filter((item) =>
      campos.some((campo) => {
        const valor = item[campo];
        return String(valor ?? "")
          .toUpperCase()
          .includes(q);
      }),
    );

    // Opcional: Una pequeña verificación para no avisar al padre si el resultado es idéntico en longitud y contenido
    onResultado(filtrados);
  }, [queryDelay, datos]);

  return (
    <div className="relative flex items-center w-full">
      {/* Icono lupa */}
      <span className="absolute left-2.5 text-[14px] pointer-events-none text-gray-400">
        <FaSearch />
      </span>

      <input
        type="text"
        className="w-full px-8 py-2 border border-gray-300 rounded-lg text-[14px] 
                 outline-none transition-all duration-200 
                 focus:border-gray-300 focus:shadow-[0_0_0_2px_rgba(0,82,33,0.15)] 
                 placeholder-gray-400"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {/* Botón limpiar */}
      {query && (
        <button
          type="button"
          className="absolute right-2 bg-transparent border-none cursor-pointer 
                   text-[13px] text-gray-500 leading-none p-0 
                   hover:text-[#005221] transition-colors duration-200"
          onClick={() => setQuery("")}
        >
          ✕
        </button>
      )}
    </div>
  );
}
