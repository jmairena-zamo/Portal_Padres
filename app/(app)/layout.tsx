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
import { useMenu } from "../hooks/useMenu";
import { useRol } from "../hooks/useRol";
import { EstudianteProvider } from "../hooks/useEstudiante";
import Loading from "@/app/components/ui/Loading";

export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // const [showModal, setShowModal] = useState<boolean>(false);
  // const [colapsado, setColapsado] = useState(false);
  // const { cargando, esAdmin } = useRol();

  // Al cargar, se consulta la sesión del usuario
  // Si el rol corresponde a administrador, se muestra el modal
  // useEffect(() => {
  //   if (esAdmin) setShowModal(true);
  // }, [esAdmin]);

  // Mientras se valida la sesión, se muestra pantalla de carga
  // if (cargando) return <Loading />;

  return (
    <EstudianteProvider>
      {/* Proveedor de contexto para manejar la información del estudiante y el menú */}
      <MenuProvider>
        {/* Consumer interno para mostrar loading global de menús */}
        {/** useMenu debe usarse dentro de MenuProvider */}
        <InnerMenuConsumer>{children}</InnerMenuConsumer>
      </MenuProvider>
    </EstudianteProvider>
  );
}

function InnerMenuConsumer({ children }: { children: React.ReactNode }) {
  const { cargandoInicial } = useMenu();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [colapsado, setColapsado] = useState(false);
  const { cargandoRol, esAdmin } = useRol();

  useEffect(() => {
    if (esAdmin) setShowModal(true);
  }, [esAdmin]);

  if (cargandoInicial)
    return (
      <div className="bg-[#faf9f6] min-h-screen flex items-center justify-center">
        <Loading texto="Cargando menús..." />
      </div>
    );

  return (
    <>
      {showModal && (
        <ModalSuplantar
          OnClose={() => setShowModal(false)}
          onSeleccionar={() => {
            setShowModal(false);
          }}
        />
      )}

      {!showModal && (
        <div className="bg-[#faf9f6] min-h-screen">
          <Sidebar
            colapsado={colapsado}
            onToggle={() => setColapsado((v) => !v)}
          />

          {/* main: empuja el contenido a la derecha del sidebar */}
          <div
            className={[
              "flex flex-col mt-13.75 transition-[margin-left] duration-500 ease-in-out",
              colapsado ? "ml-15" : "ml-62.5",
              "max-[800px]:ml-0",
            ].join(" ")}
          >
            <Navbar
              colapsado={colapsado}
              onSuplantar={() => setShowModal(true)}
            />

            {/* content */}
            <div className="w-full p-2.5 box-border max-[800px]:px-3.75 max-[420px]:p-2.5">
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
