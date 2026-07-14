//Creado por Diego Castro
//Pagina donde se ingresa la direccion correo electronio
// y se envia un correo electronio con token

"use client";

import { useState } from "react";
import logozamorano from "../../img/Logo-Universidad-Zamorano.png";
import Image from "next/image";
import { loginSchema, LoginFormData } from "../../utils/validations";
import {
  BtnPrimario,
  Input,
  SpanError,
  BtnOutline,
} from "@/app/components/ui/";
import router from "next/router";
import Link from "next/link";

export default function RecuperarContrasena() {
  const [esValidoCorreo, setEsValidoCorreo] = useState(true);
  const [correo, setCorreo] = useState<string>();
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  // Funcion para manejar los cambios
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCorreo(value);
    if (name === "correo") {
      if (!esValidoCorreo) setEsValidoCorreo(true);
    }
  };

  // Validar el correo
  const validationCorreo = () => {
    const result = loginSchema.shape.correo.safeParse(correo);
    setEsValidoCorreo(result.success);
  };

  // Enviar correo
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCargando(true);
    setMensaje("");

    try {
      const res = await fetch("/api/auth/enviarCorreo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo }),
      });

      const data = await res.json();
      setMensaje(data.message);
    } catch (error) {
      setMensaje("Error de conexión. Intenta de nuevo.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-50 overflow-y-auto">
      {/* logo */}
      <div className="mt-5 mb-5 flex items-center justify-center h-20">
        <Image src={logozamorano} alt="Logo Zamorano" width={300} height={75} />
      </div>

      {/* card */}
      <div className="bg-white mx-auto w-full max-w-md min-h-96 p-4 rounded-md shadow-md border border-gray-100 flex flex-col gap-3 mb-10">
        <h2 className="font-bold text-[22px] text-center">
          Recuperar Contraseña
        </h2>

        <p className="text-center text-[15px] text-gray-600">
          Ingrese su dirección de correo electrónico y le enviaremos un link
          para restablecer su contraseña.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col" noValidate>
          {/* campo correo */}
          <div className="flex flex-col mt-5 mb-5 text-[14px] font-bold">
            <label htmlFor="correo">Correo Electrónico:</label>
            <Input
              id="correo"
              type="email"
              name="correo"
              esValido={esValidoCorreo}
              placeholder="Ingrese Correo Electrónico"
              onChange={handleOnChange}
              onBlur={validationCorreo}
              disabled={cargando || !!mensaje}
              autoComplete="email"
            />
            <SpanError
              visible={!esValidoCorreo}
              mensaje="El Correo no es válido"
            />
          </div>

          <BtnPrimario
            type="submit"
            disabled={!esValidoCorreo || cargando || !!mensaje}
          >
            {cargando ? "Enviando..." : "Enviar Enlace de Recuperación"}
          </BtnPrimario>
        </form>

        <BtnOutline type="button">
          <Link href="/" className="block text-center">
            Volver al login
          </Link>
        </BtnOutline>
        {mensaje && (
          <p className="mt-4 text-green-600 text-center">{mensaje}</p>
        )}
      </div>
    </div>
  );
}
