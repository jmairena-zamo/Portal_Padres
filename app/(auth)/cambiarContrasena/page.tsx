"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import logozamorano from "../../img/Logo-Universidad-Zamorano.png";
import Image from "next/image";
import { nuevaContrasenaSchema } from "@/app/utils/validations";
import { BtnPrimario, BtnOutline, Input, SpanError } from "@/app/components/ui";

interface UsuarioRecuperacion {
  id: string;
  correo: string;
  relacion: string;
  iD_Rol: string;
  usuario: string;
}

export default function CambiarContrasena() {
  const searchParams = useSearchParams();
  const route = useRouter();

  const id = searchParams.get("id");
  const token = searchParams.get("token");

  const [newContrasena, setNewContrasena] = useState("");
  const [esValidoNewContras, setesValidoNewContras] = useState(true);
  const [confirmContrasena, setConfirmContrasena] = useState("");
  const [esValidoConfirmContras, setesValidoConfirmContras] = useState(true);
  const [error, setError] = useState("");
  const [errorServidor, setErrorServidor] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);
  const [validandoLink, setValidandoLink] = useState(true);
  const [userData, setUserData] = useState<UsuarioRecuperacion | null>(null);
  const [errorNewContras, setErrorNewContras] = useState("");
  const [errorConfirmContras, setErrorConfirmContras] = useState("");
  const [mostrarNewContras, setMostrarNewContras] = useState(false);
  const [mostrarConfirmContras, setMostrarConfirmContras] = useState(false);

  useEffect(() => {
    if (!id || !token) {
      setErrorServidor("Link inválido o expirado");
      setValidandoLink(false);
      return;
    }

    fetch(`/api/user/obtenerUsuario?token=${token}&id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setErrorServidor("Link inválido o expirado");
          return;
        }
        setUserData(data);
      })
      .catch(() => setErrorServidor("Error de conexión. Intente nuevamente."))
      .finally(() => setValidandoLink(false));
  }, [id, token]);

  const handleOnChangeNew = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setNewContrasena(value);

    if (!esValidoNewContras) setesValidoNewContras(true);

    // si ya había validado la confirmación, re-validar el match en vivo
    if (confirmContrasena && !esValidoConfirmContras === false) {
      compararContrasenas(value, confirmContrasena);
    }
  };

  const validationNewContra = () => {
    const result =
      nuevaContrasenaSchema.shape.contrasena.safeParse(newContrasena);

    if (!result.success) {
      setesValidoNewContras(false);
      setErrorNewContras(result.error.issues[0].message);
    } else {
      setesValidoNewContras(true);
      setErrorNewContras("");
    }
  };

  const handleOnChangeConfirm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setConfirmContrasena(value);
    if (!esValidoConfirmContras) setesValidoConfirmContras(true);
  };

  const compararContrasenas = (nueva: string, confirmacion: string) => {
    if (confirmacion && nueva !== confirmacion) {
      setesValidoConfirmContras(false);
      setErrorConfirmContras("Las contraseñas no coinciden");
      return false;
    }
    setesValidoConfirmContras(true);
    setErrorConfirmContras("");
    return true;
  };

  const validationConfirmContra = () => {
    const result =
      nuevaContrasenaSchema.shape.contrasena.safeParse(confirmContrasena);

    if (!result.success) {
      setesValidoConfirmContras(false);
      setErrorConfirmContras(result.error.issues[0].message);
      return;
    }

    compararContrasenas(newContrasena, confirmContrasena);
  };

  const handlerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!newContrasena || !confirmContrasena) {
      setesValidoNewContras(false);
      setesValidoConfirmContras(false);
      return;
    }

    if (!compararContrasenas(newContrasena, confirmContrasena)) {
      return;
    }

    if (!userData) {
      setError("Usuario no válido");
      return;
    }

    setCargando(true);

    try {
      const res = await fetch("/api/auth/nuevaContrasena", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_useremail: userData.id,
          correoElectronico: userData.correo,
          relacion: userData.relacion,
          iD_Rol: userData.iD_Rol,
          contrasena: newContrasena,
          usuario: userData.usuario,
          token: token,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "No se pudo cambiar la contraseña.");
        return;
      }

      setMensaje(data.message);
      setTimeout(() => route.push("/login"), 3000);
    } catch (err) {
      setError("Error de conexión. Intente nuevamente.");
    } finally {
      setCargando(false);
    }
  };

  // Pantalla mientras se valida el link (token/id)
  if (validandoLink) {
    return (
      <div className="fixed inset-0 bg-gray-50 flex items-center justify-center">
        <p className="text-[15px] text-gray-600">Validando enlace...</p>
      </div>
    );
  }

  // Pantalla de error (link inválido/expirado o sin conexión)
  if (errorServidor) {
    return (
      <div className="fixed inset-0 bg-gray-50 overflow-y-auto">
        <div className="mt-5 mb-5 flex items-center justify-center h-20">
          <Image
            src={logozamorano}
            alt="Logo Zamorano"
            width={300}
            height={75}
          />
        </div>
        <div className="bg-white mx-auto w-full max-w-md p-4 rounded-md shadow-md border border-gray-100 flex flex-col gap-3 mb-10">
          <h2 className="font-bold text-[22px] text-center">
            No se pudo continuar
          </h2>
          <p className="text-center text-[15px] text-red-600">
            {errorServidor}
          </p>
          <BtnOutline type="button" onClick={() => route.push("/login")}>
            Volver al login
          </BtnOutline>
        </div>
      </div>
    );
  }

  const formularioBloqueado = cargando || !!mensaje;

  return (
    <div className="fixed inset-0 bg-gray-50 overflow-y-auto">
      <div className="mt-5 mb-5 flex items-center justify-center h-20">
        <Image src={logozamorano} alt="Logo Zamorano" width={300} height={75} />
      </div>
      <div className="bg-white mx-auto w-full max-w-md min-h-96 p-4 rounded-md shadow-md border border-gray-100 flex flex-col gap-3 mb-10">
        <h2 className="font-bold text-[22px] text-center">Nueva Contraseña</h2>
        <p className="text-center text-[15px] text-gray-600">
          Ingrese su nueva contraseña
        </p>
        <form onSubmit={handlerSubmit} className="flex flex-col" noValidate>
          <div className="flex flex-col mt-5 text-[14px] font-bold">
            <label htmlFor="contrasena">Nueva Contraseña:</label>
            <Input
              id="contrasena"
              type={mostrarNewContras ? "text" : "password"}
              name="contrasena"
              esValido={esValidoNewContras}
              placeholder="Ingrese su nueva contraseña"
              onChange={handleOnChangeNew}
              onBlur={validationNewContra}
              disabled={formularioBloqueado}
              autoComplete="new-password"
            />
            <SpanError
              visible={!esValidoNewContras}
              mensaje={errorNewContras}
            />
          </div>
          <div className="flex flex-col mt-5 mb-10 text-[14px] font-bold">
            <label htmlFor="confirmcontrasena">Confirmar Contraseña:</label>
            <Input
              id="confirmcontrasena"
              type={mostrarConfirmContras ? "text" : "password"}
              name="confirmcontrasena"
              esValido={esValidoConfirmContras}
              placeholder="Confirmar su nueva contraseña"
              onChange={handleOnChangeConfirm}
              onBlur={validationConfirmContra}
              disabled={!newContrasena || formularioBloqueado}
              autoComplete="new-password"
            />
            <SpanError
              visible={!esValidoConfirmContras}
              mensaje={errorConfirmContras}
            />
          </div>
          <BtnPrimario
            type="submit"
            disabled={
              !esValidoNewContras ||
              !esValidoConfirmContras ||
              formularioBloqueado
            }
          >
            {cargando ? "Enviando..." : "Cambiar Contraseña"}
          </BtnPrimario>
        </form>
        {mensaje && (
          <p
            role="status"
            aria-live="polite"
            className="mt-4 text-center text-[14px] text-[#2e7d32]"
          >
            {mensaje}
          </p>
        )}
        {error && (
          <p role="alert" className="mt-4 text-center text-[14px] text-red-600">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
