//Creado por Diego Castro
//Componente de navbar con logo de zamorano
//Tiene una opcion de escoger al hiji si tiene más de 1

"use client";

import zamorano from "../../img/Logo-Universidad-Zamorano.png";
import user from "../../img/logo-user.png";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { BtnPrimario } from "../ui";
import { useRol } from "@/app/hooks/useRol";
import { useEstudiante } from "@/app/hooks/useEstudiante";

interface Props {
  colapsado: boolean;
  onSuplantar?: () => void;
}

export const Navbar = ({ colapsado, onSuplantar }: Props) => {
  const { hijos, hijoActivo, setHijoActivo } = useEstudiante();

  const [dropdownAbierto, setDropdownAbierto] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { foto } = useEstudiante();
  const { rol, cargando } = useRol();
  const esAdmin = rol === 2;
  const tieneVariosHijos = !esAdmin && hijos.length > 1;

  // Cierra el dropdown al hacer clic fuera
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setDropdownAbierto(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [hijoActivo]);

  const seleccionarHijo = (hijo: (typeof hijos)[0]) => {
    setHijoActivo(hijo);
    setDropdownAbierto(false);
  };

  return (
    <header
      className={[
        "shadow-[0_3px_5px_rgba(0,0,0,0.4)] fixed top-0 right-0 h-13.75 z-98",
        "bg-white flex justify-center items-center transition-[left] duration-300 ease-in-out",
        // desktop: left depende del estado colapsado
        colapsado ? "left-15" : "left-62.5",
        // mobile: siempre full width con padding para el hamburger
        "max-[800px]:left-0! max-[800px]:w-full max-[800px]:h-15 max-[800px]:pl-15 max-[800px]:box-border",
      ].join(" ")}
    >
      <div className="text-black flex items-center justify-between w-full px-2.5 max-[800px]:pr-3.75 max-[800px]:pl-0">
        {/* Logo */}
        <Image
          className="object-cover"
          src={zamorano}
          alt="Logo Zamorano"
          width={200}
        />

        {/* Derecha: selector de hijo + avatar */}
        <nav className="flex justify-between items-center gap-5 mr-10 max-[800px]:mr-2.5">
          <div className="relative flex gap-3.75" ref={ref}>
            {esAdmin && (
              <div className="flex justify-center items-center mr-9">
                <BtnPrimario onClick={onSuplantar}>Suplantar</BtnPrimario>
              </div>
            )}

            {/* Botón nombre + chevron — oculto en <420px */}
            {hijoActivo && (
              <button
                onClick={() => setDropdownAbierto((prev) => !prev)}
                className={[
                  "bg-transparent border-none font-bold flex items-center gap-1.5 max-[420px]:hidden",
                  tieneVariosHijos && "cursor-pointer",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {tieneVariosHijos && (
                  <FaChevronDown
                    size={12}
                    className={[
                      "mr-1.5 transition-transform duration-200",
                      dropdownAbierto ? "rotate-180" : "rotate-0",
                    ].join(" ")}
                  />
                )}
                <span>{hijoActivo.Nombre}</span>
              </button>
            )}

            {/* Avatar */}
            <Image
              src={foto ? `data:image/jpeg;base64,${foto}` : user}
              alt="Logo usuario"
              width={40}
              height={40}
              className={[
                "w-10 h-10 object-cover rounded-full max-[800px]:w-10 max-[800px]:h-10 max-[420px]:w-10 max-[420px]:h-10",
                tieneVariosHijos &&
                  "cursor-pointer transition-opacity duration-150 hover:opacity-80",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() =>
                !esAdmin &&
                tieneVariosHijos &&
                setDropdownAbierto((prev) => !prev)
              }
            />

            {/* Dropdown */}
            {!esAdmin && tieneVariosHijos && dropdownAbierto && (
              <ul
                className="
                                absolute top-[calc(100%+8px)] right-0 z-100
                                bg-white border border-[#e2e8f0] rounded-[5px]
                                shadow-[0_4px_16px_rgba(0,0,0,0.12)]
                                list-none m-0 py-1 min-w-45
                            "
              >
                {hijos.map((hijo) => (
                  <li
                    key={hijo.bannerID}
                    onClick={() => seleccionarHijo(hijo)}
                    className={[
                      "px-4 py-2.5 cursor-pointer text-[0.9rem] text-[#374151]",
                      "transition-colors duration-150 hover:bg-[#f3f4f6]",
                      hijoActivo?.bannerID === hijo.bannerID &&
                        "font-semibold text-[#005221]",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    {hijo.Nombre}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};
