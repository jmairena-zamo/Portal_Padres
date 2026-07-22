//Creado por Diego Castro
//Componente de navbar con logo de zamorano
//Tiene una opcion de escoger al hijo si tiene más de 1

"use client";

import zamorano from "../../img/Logo-Universidad-Zamorano.png";
import user from "../../img/logo-user.png";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { BtnPrimario } from "@/app/components/ui/Boton";
import { useRol } from "@/app/hooks/useRol";
import { useEstudiante } from "@/app/hooks/useEstudiante";

// Props para el componente Navbar
interface Props {
  colapsado: boolean;
  onSuplantar?: () => void;
}

export const Navbar = ({ colapsado, onSuplantar }: Props) => {
  const { hijos, hijoActivo, seleccionarEstudiante, foto } = useEstudiante();

  const [dropdownAbierto, setDropdownAbierto] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { rol, esAdmin } = useRol();
  const tieneVariosHijos = !esAdmin && hijos.length > 1;

  // Cerrar el dropdown si se hace click fuera de él
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setDropdownAbierto(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [hijoActivo]);

  // Función para seleccionar un hijo y cerrar el dropdown
  const seleccionarHijoAc = async (hijo: (typeof hijos)[0]) => {
    await seleccionarEstudiante(hijo);
    setDropdownAbierto(false);
  };

  return (
    <header
      className={[
        "shadow-[0_3px_5px_rgba(0,0,0,0.4)] fixed top-0 right-0 h-13.75 z-98",
        "bg-[#ffffff] flex justify-center items-center transition-transform duration-500 ease-in-out",
        // desktop: left depende del estado colapsado
        colapsado ? "left-15" : "left-62.5",
        // mobile: siempre full width con padding para el hamburger
        "max-[800px]:left-0! max-[800px]:w-full max-[800px]:h-15 max-[800px]:pl-15 max-[800px]:box-border",
        // mobile chico: header un poco más bajo y menos padding izquierdo
        "max-[420px]:h-13 max-[420px]:pl-12.5",
      ].join(" ")}
    >
      <div className="text-black flex items-center justify-between w-full px-2.5 max-[800px]:pr-3.75 max-[800px]:pl-0 max-[420px]:pr-2">
        {/* Logo */}
        <Image
          className="object-cover max-[1000px]:w-40 max-[1000px]:h-auto max-[420px]:w-30"
          src={zamorano}
          alt="Logo Zamorano"
          width={200}
        />

        {/* Derecha: selector de hijo + avatar */}
        <nav className="flex justify-between items-center gap-5 mr-10 max-[800px]:mr-2.5 max-[420px]:gap-2 max-[420px]:mr-0">
          <div
            className="relative flex gap-3.75 max-[1000px]:gap-2 max-[420px]:gap-2"
            ref={ref}
          >
            {esAdmin && (
              <div className="flex justify-center items-center ml-2.5 mr-2.5 max-[420px]:mr-2">
                <BtnPrimario
                  onClick={onSuplantar}
                  // className="max-[420px]:text-[12px] max-[420px]:px-2 max-[420px]:py-1"
                >
                  Suplantar
                </BtnPrimario>
              </div>
            )}

            {/* Botón nombre + chevron — oculto en <420px */}
            {hijoActivo && (
              <button
                type="button"
                onClick={() => setDropdownAbierto((prev) => !prev)}
                className={[
                  "bg-transparent border-none font-bold text-[#173426] flex items-center gap-1.5 max-[420px]:hidden",
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
                <span className="max-[1000px]:text-[12px]">
                  {hijoActivo.Nombre}
                </span>
              </button>
            )}

            {/* Avatar */}
            <Image
              src={foto ? `data:image/jpeg;base64,${foto}` : user}
              alt="Logo usuario"
              width={40}
              height={40}
              className={[
                "w-10 h-10 object-cover rounded-full max-[800px]:w-10 max-[800px]:h-10 max-[420px]:w-8 max-[420px]:h-8",
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
                                max-[420px]:min-w-37.5 max-[420px]:-right-2
                            "
              >
                {hijos.map((hijo) => (
                  <li key={hijo.bannerID}>
                    <button
                      type="button"
                      onClick={() => seleccionarHijoAc(hijo)}
                      aria-pressed={hijoActivo?.bannerID === hijo.bannerID}
                      className={[
                        "w-full px-4 py-2.5 text-left text-[0.9rem] text-[#374151]",
                        "transition-colors duration-150 hover:bg-[#f3f4f6]",
                        "max-[1000px]:px-2 max-[1000px]:text-[15px] max-[420px]:text-[13px]",
                        hijoActivo?.bannerID === hijo.bannerID
                          ? "font-semibold text-[#005221]"
                          : "",
                      ].join(" ")}
                    >
                      {hijo.Nombre}
                    </button>
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
