//Creado por Diego Castro
//Pagina donde se ingresa la direccion correo electronio
// y se envia un correo electronio con token

"use client";

import { useState } from "react";
import logozamorano from "../../img/Logo-Universidad-Zamorano.png";
import Image from "next/image";
import { loginSchema, LoginFormData } from "../../utils/validations";
import { BtnPrimario, Input, SpanError } from "@/app/components/ui/";

export default function RecuperarContrasena() {
  const [esValidoCorreo, setEsValidoCorreo] = useState(true);
  const [correo, setCorreo] = useState<string>();
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCorreo(value);
    if (name === "correo") {
      if (!esValidoCorreo) setEsValidoCorreo(true);
    }
  };

  const validationCorreo = () => {
    const result = loginSchema.shape.correo.safeParse(correo);
    setEsValidoCorreo(result.success);
  };

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
    <div className="fixed inset-0 bg-white">
      {/* logo */}
      <div className="mt-5 mb-5 flex items-center justify-center h-21.25">
        <Image src={logozamorano} alt="Logo Zamorano" width={300} height={75} />
      </div>

      {/* card */}
      <div className="bg-white mx-auto w-full max-w-112.5 min-h-100 p-3.75 rounded-[5px] flex flex-col gap-1.25">
        <h2 className="font-bold text-[22px] text-center">
          Recuperar Contraseña
        </h2>

        <p className="text-center text-[15px]">
          Ingrese su dirección de correo electrónico y le enviaremos un link
          para restablecer su contraseña.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col">
          {/* campo correo */}
          <div className="flex flex-col mt-5 mb-5 text-[14px] font-bold">
            <label>Correo Electrónico:</label>
            <Input
              id="correo"
              type="text"
              name="correo"
              esValido={esValidoCorreo}
              placeholder="Ingrese Correo Electrónico"
              onChange={handleOnChange}
              onBlur={validationCorreo}
            />
            <SpanError
              visible={!esValidoCorreo}
              mensaje="El Correo no es válido"
            />
          </div>

          <BtnPrimario type="submit" disabled={!esValidoCorreo || cargando}>
            {cargando
              ? "Enviando..."
              : "Enviar Correo Para Restablecer Contraseña"}
          </BtnPrimario>
        </form>

        {/* mensaje de respuesta */}
        {mensaje && (
          <p className="mt-4 text-green-600 text-center">{mensaje}</p>
        )}

        <a href="/" className="block mt-4 text-center">
          Volver al login
        </a>
      </div>
    </div>
  );
}
