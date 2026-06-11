"use client";

import "@/app/globals.css";
import { Navbar } from "../components/layout/Navbar";
import { Sidebar } from "../components/layout/Sidebar";
import { useEffect, useState } from "react";
import ModalSuplantar from "../components/modals/ModalSuplantar";
import { MenuProvider } from "../hooks/useMenu";
import Loading from "../components/ui/Loading";

export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [colapsado, setColapsado] = useState(false);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        if (data?.iD_Rol === 2) setShowModal(true); //si el id del usuario es el id de administradr muestra el modal de alumnos
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  return (
    <MenuProvider>
      {showModal && <ModalSuplantar OnClose={() => setShowModal(false)} />}

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
            <Navbar colapsado={colapsado} />

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
