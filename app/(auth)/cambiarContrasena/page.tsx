"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import logozamorano from "../../img/Logo-Universidad-Zamorano.png";
import Image from "next/image";
import { nuevaContrasenaSchema } from "@/app/utils/validations";
import { BtnPrimario, Input, SpanError } from "@/app/components/ui";

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
  const [userData, setUserData] = useState<any>(null);
  const [errorNewContras, setErrorNewContras] = useState("");
  const [errorConfirmContras, setErrorConfirmContras] = useState("");

  useEffect(() => {
    if (!id || !token) {
      setErrorServidor("Link Invalido o Expirado");
      return;
    }

    fetch(`/api/user/obtenerUsuario?token=${token}&id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setErrorServidor("Link Invalido");
        }

        setUserData(data);
      })
      .catch(() => setErrorServidor("Error de conexión 1"));
  }, [id, token]);

  if (errorServidor) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <p style={{ color: "red" }}>{errorServidor}</p>
        <a href="/login">Volver al login</a>
      </div>
    );
  }

  const handleOnChangeNew = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewContrasena(value);

    if (!value) {
      setConfirmContrasena("");
      setesValidoConfirmContras(true);
    }

    if (name === "contrasena") {
      if (!esValidoNewContras) setesValidoNewContras(true);
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
    const { name, value } = e.target;
    setConfirmContrasena(value);
    if (name === "confirmcontrasena") {
      if (!esValidoConfirmContras) setesValidoConfirmContras(true);
    }
  };

  const validationConfirmContra = () => {
    const result =
      nuevaContrasenaSchema.shape.contrasena.safeParse(confirmContrasena);
    if (!result.success) {
      setesValidoConfirmContras(false);
      setErrorConfirmContras(result.error.issues[0].message);
    } else {
      setesValidoConfirmContras(true);
      setErrorConfirmContras("");
    }
  };

  const handlerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!newContrasena || !confirmContrasena) {
      setesValidoNewContras(false);
      setesValidoConfirmContras(false);
      return;
    }

    if (newContrasena !== confirmContrasena) {
      setError("Las contraseñas no coinciden");
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
        setError(data.error);
        return;
      }

      setMensaje(data.message);
      setTimeout(() => route.push("/login"), 3000);
    } catch (error) {
      setError("Error de conexión. inetetetete");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-white">
      <div className="mt-5 mb-5 flex items-center justify-center h-21.25">
        <Image src={logozamorano} alt="Logo Zamorano" width={300} height={75} />
      </div>
      <div className="bg-white mx-auto w-full max-w-112.5 min-h-100 p-3.75 rounded-[5px] flex flex-col gap-1.25">
        <h2 className="font-bold text-[22px] text-center">Nueva Contraseña</h2>
        <p className="text-center text-[15px]">Ingrese su nueva contraseña</p>
        <form onSubmit={handlerSubmit} className="flex flex-col">
          <div className="flex flex-col mt-5 mb-5 text-[14px] font-bold">
            <label>Nueva Contraseña:</label>
            <Input
              type="password"
              name="contrasena"
              esValido={esValidoNewContras}
              placeholder="Ingrese su nueva contraseña"
              onChange={handleOnChangeNew}
              onBlur={validationNewContra}
            />
            <SpanError
              visible={!esValidoNewContras}
              mensaje={errorNewContras}
            />
          </div>
          <div className="flex flex-col mt-5 mb-5 text-[14px] font-bold">
            <label>Confirmar Contraseña:</label>
            <Input
              type="password"
              name="confirmcontrasena"
              esValido={esValidoConfirmContras}
              placeholder="Confirmar su nueva contraseña"
              onChange={handleOnChangeConfirm}
              onBlur={validationConfirmContra}
              disabled={!newContrasena}
            />
            <SpanError
              visible={!esValidoConfirmContras}
              mensaje={errorConfirmContras}
            />
          </div>
          <BtnPrimario
            type="submit"
            disabled={
              !esValidoNewContras || !esValidoConfirmContras || cargando
            }
          >
            {cargando ? "Enviando..." : "Cambiar Contraseña"}
          </BtnPrimario>
        </form>
        {mensaje && (
          <p className="mt-4 text-center text-green-900">{mensaje}</p>
        )}
        {error && <p className="mt-4 text-center text-red-900">{error}</p>}
      </div>
    </div>
  );
}
