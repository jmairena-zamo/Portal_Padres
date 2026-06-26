"use client";

import zamorano from "../../img/Logo-Universidad-Zamorano.png";
import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { loginSchema, LoginFormData } from "../../utils/validations";
import { BtnPrimario, Input, SpanError } from "@/app/components/ui";
import { useSession } from "@/app/hooks/useSession";

export default function Login() {
  const [esValidoCorreo, setEsValidoCorreo] = useState(true);
  const [esValidoPass, setEsValidoPass] = useState(true);
  const [errorServidor, setErrorServidor] = useState("");
  const [cargando, setCargando] = useState(false);
  const [errorContra, setErrorContra] = useState("");
  const { recargarSesion } = useSession();

  const router = useRouter();

  const [form, setForm] = useState<LoginFormData>({
    correo: "",
    contrasena: "",
  });

  // Limpia el error del campo que el usuario está editando
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((values) => ({ ...values, [name]: value }));
    if (name === "correo" && !esValidoCorreo) setEsValidoCorreo(true);
    if (name === "contrasena" && !esValidoPass) setEsValidoPass(true);
  };

  const validationCorreo = () => {
    const result = loginSchema.shape.correo.safeParse(form.correo);
    setEsValidoCorreo(result.success);
  };

  const validationPass = () => {
    const result = loginSchema.shape.contrasena.safeParse(form.contrasena);
    if (!result.success) {
      setEsValidoPass(false);
      setErrorContra(result.error.issues[0].message);
    } else {
      setEsValidoPass(true);
      setErrorContra("");
    }
  };

  // Valida todo el form antes de llamar a la API
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorServidor("");

    const validate = loginSchema.safeParse(form);
    if (!validate.success) {
      setEsValidoCorreo(false);
      setEsValidoPass(false);
      return;
    }

    setCargando(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validate.data),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorServidor(data.error);
        return;
      }

      await recargarSesion();
      router.push("/resumenestudiante");
    } catch (error) {
      setErrorServidor("Error de conexión. Intenta de nuevo.");
      console.log("Error: ", error);
    } finally {
      setCargando(false);
    }
  };

  return (
    <>
      {/* overlay ::before via inline style */}
      <style>{`
        .login-bg::before {
          content: "";
          position: absolute;
          inset: 0;
          background-color: rgba(229, 227, 227, 0.6);
          border-radius: 5px;
        }
      `}</style>

      {/* fondo */}
      <div
        className="
        login-bg relative w-full min-h-screen flex items-center justify-center gap-5
        bg-[url('/img/Zamorano2.jpg')] bg-center bg-cover
        max-[400px]:items-start max-[400px]:pt-10 max-[400px]:h-auto
      "
      >
        {/* card */}
        <form
          onSubmit={handleSubmit}
          className="
            relative z-10 text-center flex flex-col items-center gap-7.5
            bg-white w-125 h-106.25 rounded-[5px]
            shadow-[0px_3px_5px_3px_rgba(0,0,0,0.2)]
            max-[800px]:gap-5
            max-[400px]:max-w-[calc(100%-24px)] max-[400px]:rounded-lg max-[400px]:gap-4 max-[400px]:mb-10 max-[400px]:h-auto
          "
        >
          {/* logo */}
          <div
            className="
            w-full h-[60%] rounded-[5px] shadow-[0px_3px_5px_3px_rgba(0,0,0,0.2)]
            flex items-center justify-center
          "
          >
            <Image
              src={zamorano}
              alt="Logo Zamorano"
              width={200}
              height={200}
              loading="eager"
              className="w-60 h-12.5 max-[800px]:w-45 max-[800px]:h-auto max-[400px]:w-37.5"
            />
          </div>

          {/* inputs */}
          <div
            className="
            mb-10 w-87.5 flex flex-col text-left gap-2.5
            max-[800px]:gap-2
            max-[400px]:max-w-[calc(100%-40px)]
          "
          >
            {/* correo */}
            <div className="flex flex-col">
              <label>Correo Electrónico:</label>
              <Input
                id="correo"
                type="text"
                name="correo"
                esValido={esValidoCorreo}
                placeholder="Ingrese Correo"
                value={form.correo}
                onChange={handleOnChange}
                onBlur={validationCorreo}
              />
              <SpanError
                visible={!esValidoCorreo}
                mensaje="El Correo no es válido"
              />
            </div>

            {/* contraseña */}
            <div className="flex flex-col">
              <label>Contraseña:</label>
              <Input
                type="password"
                name="contrasena"
                esValido={esValidoPass}
                placeholder="Ingrese Contraseña"
                value={form.contrasena}
                onChange={handleOnChange}
                onBlur={validationPass}
              />
              <SpanError visible={!esValidoPass} mensaje={errorContra} />
            </div>

            {/* submit */}
            <BtnPrimario
              type="submit"
              disabled={!esValidoPass || !esValidoCorreo || cargando}
            >
              Ingresar
            </BtnPrimario>

            <a
              href="/recuperarContrasena"
              className="text-center text-[13px] text-blue-600 hover:cursor-pointer"
            >
              ¿Has olvidado tu contraseña?
            </a>

            {/* error servidor */}
            <SpanError visible={!!errorServidor} mensaje={errorServidor} />
          </div>
        </form>
      </div>
    </>
  );
}
