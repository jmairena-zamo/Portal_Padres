// Creado por Diego Castro
// Layout del portal
// Se encarga de mostrar la barra lateral, la barra superior y el contenido,
// además de manejar el modal de suplantación para administradores.

"use client";

import "@/app/globals.css";
import { Navbar } from "../components/layout/Navbar";
import { Sidebar } from "../components/layout/Sidebar";
import { useEffect, useState } from "react";
import ModalSuplantar from "../components/modals/ModalSuplantar";
import { MenuProvider } from "../hooks/useMenu";
import { Loading } from "../components/ui";
import { useRol } from "../hooks/useRol";

export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [showModal, setShowModal] = useState<boolean>(false);
  // const [loading, setLoading] = useState(true);
  const [colapsado, setColapsado] = useState(false);
  const [hijoActivo, setHijoActivo] = useState<{
    id: number;
    nombre: string;
  } | null>(null);
  const [hijos, setHijos] = useState<{ id: number; nombre: string }[]>([]);
  const { rol, loading } = useRol();
  const esAdmin = rol === 2;

  // Al cargar, se consulta la sesión del usuario
  // Si el rol corresponde a administrador (idRol = 2), se muestra el modal
  useEffect(() => {
    esAdmin && setShowModal(true);
    if (!esAdmin) {
      const hijosTemp = [
        { id: 1, nombre: "Carlos Martínez" },
        { id: 2, nombre: "Sofía Martínez" },
        { id: 3, nombre: "Luis Martínez" },
      ];

      setHijos(hijosTemp);
      setHijoActivo(hijosTemp[0]);
    }
  }, [esAdmin]);

  // Mientras se valida la sesión, se muestra pantalla de carga
  if (loading) return <Loading />;

  return (
    <MenuProvider>
      {showModal && (
        <ModalSuplantar
          OnClose={() => setShowModal(false)}
          onSeleccionar={(est) => {
            setHijoActivo(est);
            setShowModal(false);
          }}
        />
      )}

      {!showModal && (
        <div className="bg-[#F6F6F6] min-h-screen">
          <Sidebar
            colapsado={colapsado}
            onToggle={() => setColapsado((v) => !v)}
          />

          {/* main: empuja el contenido a la derecha del sidebar */}
          <div
            className={[
              "flex flex-col mt-13.75 transition-[margin-left] duration-300 ease-in-out",
              colapsado ? "ml-15" : "ml-62.5",
              "max-[800px]:ml-0",
            ].join(" ")}
          >
            <Navbar
              colapsado={colapsado}
              onSuplantar={() => setShowModal(true)}
              onSeleccionar={setHijoActivo}
              hijoActivo={hijoActivo}
              hijos={hijos}
            />

            {/* content */}
            <div className="w-full p-2.5 box-border max-[800px]:px-3.75 max-[420px]:p-2.5">
              {children}
            </div>
          </div>
        </div>
      )}
    </MenuProvider>
  );
}
