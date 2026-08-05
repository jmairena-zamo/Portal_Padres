// Creado por Diego Castro
// Componente de sidebar con logo de zamorano
// Contiene la navegación principal y submenús, así como el botón de logout

"use client";

import Link from "next/link";
import Image from "next/image";
import imagen from "../../img/Zamorano1.jpg";
import { usePathname, useRouter } from "next/navigation";
import {
  FaChevronDown,
  FaChevronRight,
  FaSignOutAlt,
  FaBars,
} from "react-icons/fa";
import { useState } from "react";
import { iconos, generarRuta, getSubPath } from "@/app/services/menu";
import { useMenu } from "@/app/hooks/useMenu";
import { useSession } from "@/app/hooks/useSession";

// Props para el componente Sidebar
interface Props {
  colapsado: boolean;
  onToggle: () => void;
}

export const Sidebar = ({ colapsado, onToggle }: Props) => {
  const pathname = usePathname();
  const route = useRouter();
  const [menuAbierto, setMenuAbierto] = useState<number | null>(null);
  const { menus } = useMenu();
  const [sidebarAbierto, setSidebarAbierto] = useState(false);
  const { sesion, cerrarSesion } = useSession();
  const email = sesion?.email ?? "";

  // Cierra el sidebar en móvil
  const cerrarSidebar = () => setSidebarAbierto(false);

  // Aplica la clase activa si la ruta actual coincide con el path del link
  const linkClass = (path: string) => {
    const activo = pathname === path;

    return [
      "w-full box-border flex items-center gap-2 px-2.5 py-[5px] rounded-[5px] text-xs no-underline transition-colors duration-200",
      activo
        ? "font-bold bg-[#FFF4E5] text-[rgb(40,100,48)]"
        : "font-normal text-[#FFF4E5] hover:bg-white/10",
    ]
      .filter(Boolean)
      .join(" ");
  };

  // Alterna el submenú abierto; si se presiona el mismo, lo cierra
  const gestionSubmenu = (idMenu: number) => {
    setMenuAbierto((e) => (e === idMenu ? null : idMenu));
  };

  // Llama al endpoint de logout y redirige al login al tener éxito
  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        cerrarSesion();
        route.replace("/");
        route.refresh();
      }
    } catch (error) {
      console.log("Error al cerrar sesión:", error);
    }
  };

  return (
    <>
      {/* Botón hamburguesa — visible solo en <800px */}
      <button
        type="button"
        onClick={() => setSidebarAbierto((v) => !v)}
        aria-label="Abrir menú"
        className={[
          "hidden fixed top-3.5 left-3.5 z-200",
          "bg-[#048047] border-none rounded-md px-2.5 py-2 cursor-pointer",
          "flex-col gap-1.25 shadow-[0_2px_6px_rgba(0,0,0,0.3)]",
          "max-[800px]:flex",
          // estilos de las líneas del hamburger via [&>span]
          "[&>span]:block [&>span]:w-3 [&>span]:h-0.5 [&>span]:bg-white [&>span]:rounded-sm [&>span]:transition-all [&>span]:duration-500",
          // animación X cuando está abierto
          sidebarAbierto &&
            "[&>span:nth-child(1)]:translate-y-1.75 [&>span:nth-child(1)]:rotate-45",
          sidebarAbierto && "[&>span:nth-child(2)]:opacity-0",
          sidebarAbierto &&
            "[&>span:nth-child(3)]:-translate-y-1.75 [&>span:nth-child(3)]:-rotate-45",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <span />
        <span />
        <span />
      </button>

      {/* Overlay oscuro en móvil */}
      {sidebarAbierto && (
        <button
          type="button"
          aria-label="Cerrar menú lateral"
          onClick={cerrarSidebar}
          className="fixed inset-0 bg-black/45 z-99"
        />
      )}

      {/* Sidebar */}
      <div
        className={[
          "bg-[#048047] h-screen fixed left-0 top-0",
          "shadow-[1px_0px_5px_rgba(0,0,0,0.2)]",
          "flex flex-col items-center justify-between",
          "transition-[width] duration-500 ease-in-out",
          // ancho según estado
          colapsado ? "w-15" : "w-62.5",
          // mobile
          "max-[800px]:w-75 max-[800px]:transition-transform max-[800px]:duration-300 max-[800px]:z-100",
          sidebarAbierto
            ? "max-[800px]:translate-x-0"
            : "max-[800px]:-translate-x-full",
          "max-[420px]:w-[70%]",
        ].join(" ")}
      >
        {/* Botón colapsar — oculto en mobile */}
        <div
          className={[
            "w-full flex",
            colapsado
              ? "mt-3.75 items-center justify-center"
              : "items-start justify-start",
            "max-[800px]:hidden",
          ].join(" ")}
        >
          <button
            type="button"
            onClick={onToggle}
            aria-label="Colapsar menú"
            className="flex bg-transparent border-none text-[#FFF4E5] cursor-pointer p-1.25 rounded-[5px] hover:bg-white/15 transition-colors duration-200"
          >
            <FaBars size={25} />
          </button>
        </div>

        {/* Contenido interior scrollable */}
        <div className="flex-1 overflow-y-auto w-[95%] max-[800px]:mt-3.75 flex flex-col">
          {/* Tag: logo + email */}
          <div
            className={[
              "w-full mt-2.5 mb-6.25 px-2.5 py-2 rounded-[5px] relative shrink-0",
              colapsado ? "h-auto py-2 px-0" : "h-30",
            ].join(" ")}
          >
            <div className="flex flex-col justify-center items-center rounded-[5px] h-full text-[#FFF4E5]">
              <Image
                src={imagen}
                alt="Logo Zamorano"
                className={
                  colapsado
                    ? "w-10 h-10 rounded-full"
                    : "w-50 h-25 rounded-[10px]"
                }
              />
              {!colapsado && (
                <>
                  <p className="text-[10px]">{email}</p>
                  <p className="text-[10px]">Nombre Usuario</p>
                </>
              )}
            </div>
          </div>

          {/* Navegación */}
          <nav
            className={[
              "flex flex-col text-[#FFF4E5] gap-2 border-t border-[#FFF4E5] pt-2.5 px-2.5",
              "flex-1 overflow-y-auto w-full box-border", // ← flex-1 reemplaza max-h-[57vh]
              "[&::-webkit-scrollbar]:w-1.5",
              "[&::-webkit-scrollbar-thumb]:bg-[#FFF4E5] [&::-webkit-scrollbar-thumb]:rounded-[20px]",
              colapsado ? "items-center px-0" : "items-start",
            ].join(" ")}
          >
            {menus.map((menu) => {
              const path = generarRuta(menu.opcion);
              const tieneSubmenus = menu.submenus && menu.submenus.length > 0;
              const estaAbierto = menuAbierto === menu.iD_Menu;
              const Icono = iconos[menu.icono];

              return (
                <div key={menu.iD_Menu} className="w-full">
                  {tieneSubmenus ? (
                    <>
                      {/* Menú con submenús */}
                      <button
                        type="button"
                        onClick={() => gestionSubmenu(menu.iD_Menu)}
                        title={colapsado ? menu.opcion : ""}
                        className={[
                          "w-full bg-transparent border-none cursor-pointer",
                          "flex items-center gap-2 font-normal text-[#FFF4E5]",
                          "px-2.5 py-1.25 text-xs",
                          colapsado && "justify-center px-0 w-10",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      >
                        {Icono && <Icono size={20} />}
                        {!colapsado && menu.opcion}
                        {!colapsado &&
                          (estaAbierto ? (
                            <FaChevronDown size={12} />
                          ) : (
                            <FaChevronRight size={12} />
                          ))}
                      </button>

                      {/* Submenús */}
                      {estaAbierto && !colapsado && (
                        <div className="w-full bg-[#005221] flex flex-col pl-5 border-l border-[#ddd] ml-2.5">
                          {menu.submenus
                            .sort((a, b) => a.posicion - b.posicion)
                            .map((sub) => {
                              const subPath = getSubPath(
                                menu.opcion,
                                sub.opcion,
                              );
                              return (
                                <Link
                                  key={sub.iD_SubMenu}
                                  href={subPath}
                                  onClick={cerrarSidebar}
                                  className={linkClass(subPath)}
                                >
                                  {sub.opcion}
                                </Link>
                              );
                            })}
                        </div>
                      )}
                    </>
                  ) : (
                    // Link directo
                    <Link
                      href={path}
                      onClick={cerrarSidebar}
                      className={linkClass(path)}
                      title={colapsado ? menu.opcion : ""}
                    >
                      {Icono && <Icono size={20} />}
                      {!colapsado && menu.opcion}
                    </Link>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Logout */}
        <div
          className={[
            "text-[#FFF4E5] flex items-end border-t border-[#FFF4E5] pt-3.75 pb-3.75 w-[90%]",
            colapsado ? "justify-center px-0" : "justify-center gap-5",
          ].join(" ")}
        >
          <button
            type="button"
            onClick={handleLogout}
            title={colapsado ? "Cerrar Sesión" : ""}
            className={[
              "flex items-end gap-2 p-1.25 bg-transparent border-none text-[#FFF4E5] cursor-pointer",
              "hover:bg-[#FFF4E5] hover:text-[rgb(40,100,48)] hover:w-full hover:px-2.5",
              "hover:justify-center hover:rounded-[5px] hover:font-bold",
              "transition-all duration-200",
              colapsado && "justify-center px-0",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {!colapsado && "Cerrar Sesion"}
            <FaSignOutAlt size={25} />
          </button>
        </div>
      </div>
    </>
  );
};
