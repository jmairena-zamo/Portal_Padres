//Creado por Diego Castro
// *Renderiza un formulario interactivo para que los usuarios envíen quejas o sugerencias.
//  * Cuenta con validación en tiempo real (onBlur) y validación global al enviar (onSubmit)
//  * utilizando esquemas de validación personalizados.

"use client";

import React, { useEffect, useMemo, useState } from "react";
import { quejaData, quejaSchema } from "@/app/utils/validations";
import Loading from "@/app/components/ui/Loading";
import { useToast } from "@/app/hooks/useToast";
import Toast from "@/app/components/ui/Toast";
import {
  BtnPrimario,
  BtnTab,
  Buscador,
  CardInfo,
  ComboBoxFiltro,
  Input,
  SpanError,
  TextArea,
  Vacio,
} from "@/app/components/ui";
import { Queja, useQueja } from "@/app/hooks/useQueja";
import ModalForm from "@/app/components/modals/ModalForm";

export default function QuejasSugerencias() {
  const { toast, mostrarExito, mostrarError, cerrarToast } = useToast();

  // Almacena los valores de los campos del formulario
  const [formData, setFormData] = useState<quejaData>({
    telefono: "",
    tipo: "queja",
    asunto: "",
    mensaje: "",
  });

  // Estados de validación individuales para manejar estilos de error visuales
  const [esValidoTelefono, setEsValidoTelefono] = useState(true);
  const [esValidoTipo, setEsValidoTipo] = useState(true);
  const [esValidoAsunto, setEsValidoAsunto] = useState(true);
  const [esValidoMensaje, setEsValidoMensaje] = useState(true);

  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const [tabActiva, setTabActiva] = useState<"crear" | "ver">("ver");

  const { quejas, cargandoQS, errorQS, reintentar } = useQueja();

  // dentro de tu page.tsx, agrega el estado para el modal (si lo vas a usar después)
  const [quejaSeleccionada, setQuejaSeleccionada] = useState<Queja | null>(
    null,
  );

  const [resultadoBusqueda, setResultadoBusqueda] = useState<Queja[]>(quejas);

  const [tipoFiltro, setTipoFiltro] = useState<number | string | "todos">(
    "todos",
  );

  const opcionesTipo = [
    { value: "QUEJA", label: "Quejas" },
    { value: "SUGERENCIA", label: "Sugerencias" },
  ];

  useEffect(() => {
    setResultadoBusqueda(quejas);
  }, [quejas]);

  const quejasFiltradas = useMemo(() => {
    let resultado = resultadoBusqueda;

    if (tipoFiltro !== "todos") {
      resultado = resultado.filter((q) => q.tipo === tipoFiltro);
    }

    return [...resultado].sort(
      (a, b) =>
        new Date(b.fechaCreacion).getTime() -
        new Date(a.fechaCreacion).getTime(),
    );
  }, [resultadoBusqueda, tipoFiltro]);

  // * Maneja los cambios en los inputs y textareas del formulario.
  //  * Actualiza el estado `formData` de manera dinámica y limpia el estado de error
  //  * del campo modificado si este se encontraba en un estado inválido.
  const handlerOnChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((values) => ({
      ...values,
      [name]: value,
    }));

    if (name === "telefono" && !esValidoTelefono) {
      setEsValidoTelefono(true);
    }

    if (name === "tipo" && !esValidoTipo) {
      setEsValidoTipo(true);
    }

    if (name === "asunto" && !esValidoAsunto) {
      setEsValidoAsunto(true);
    }

    if (name === "mensaje" && !esValidoMensaje) {
      setEsValidoMensaje(true);
    }
  };

  //----VALIDACION INDEPENDIENTE PARA CADA CAMPO----------------------------------
  const validationTelefono = () => {
    const result = quejaSchema.shape.telefono.safeParse(formData.telefono);
    setEsValidoTelefono(result.success);
  };

  const validationTipo = () => {
    const result = quejaSchema.shape.tipo.safeParse(formData.tipo);
    setEsValidoTipo(result.success);
  };

  const validationAsunto = () => {
    const result = quejaSchema.shape.asunto.safeParse(formData.asunto);
    setEsValidoAsunto(result.success);
  };

  const validationMensaje = () => {
    const result = quejaSchema.shape.mensaje.safeParse(formData.mensaje);
    setEsValidoMensaje(result.success);
  };

  //Envio del formulario
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const validate = quejaSchema.safeParse(formData);

    if (!validate.success) {
      setEsValidoTelefono(false);
      setEsValidoTipo(false);
      setEsValidoAsunto(false);
      setEsValidoMensaje(false);

      return;
    }

    setCargando(true);

    console.log(validate.data);

    try {
      //Peticion de insercion
      const res = await fetch("/api/quejas/insertarQueja", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validate.data),
      });

      const data = await res.json();

      if (!res.ok) {
        return mostrarError(data.error);
      }

      mostrarExito(data.message);

      setFormData({
        telefono: "",
        tipo: "queja",
        asunto: "",
        mensaje: "",
      });

      reintentar();
    } catch (error) {
      setError("Error de conexión. Intenta de nuevo.");
      mostrarError("Error de conexión. Intenta de nuevo.");
    } finally {
      setCargando(false);
    }
  };

  const tieneQuejas = quejasFiltradas.length > 0;

  if (cargando) return <Loading />;

  return (
    <div className="mt-4 mx-4 mb-4 flex flex-col gap-4 sm:m-4 max-[420px]:m-2">
      {toast && (
        <Toast
          mensaje={toast.mensaje}
          tipo={toast.tipo}
          onClose={cerrarToast}
        />
      )}
      <div className="flex gap-2.5 border-b border-gray-200 max-[420px]:flex-wrap">
        <BtnTab
          activa={tabActiva === "ver"}
          onClick={() => setTabActiva("ver")}
        >
          Ver Mis Quejas o Sugerencias
        </BtnTab>
        <BtnTab
          activa={tabActiva === "crear"}
          onClick={() => setTabActiva("crear")}
        >
          Crear Queja o Sugerencia
        </BtnTab>
      </div>
      {tabActiva === "ver" && (
        <div className="bg-white rounded-[5px] shadow-[0px_3px_5px_3px_rgba(0,0,0,0.3)] p-4 max-[800px]:overflow-hidden">
          <div className="flex items-center gap-11.25 flex-wrap max-[800px]:w-full max-[800px]:justify-between max-[420px]:gap-3.75">
            <h2 className="font-bold text-center text-[22px] max-[420px]:text-[17px]">
              Mis Quejas y Sugerencias
            </h2>
          </div>
          <div className="mt-5 mb-5 w-full flex gap-3.75 max-[420px]:flex-col">
            <div className="w-4/5 flex justify-center items-center max-[420px]:w-full">
              <Buscador
                datos={quejas}
                campos={["asunto", "mensaje"]}
                placeholder="Buscar Queja..."
                onResultado={(resultados) => {
                  setResultadoBusqueda(resultados);
                }}
              />
            </div>
            <div className="flex items-center gap-3.75 max-[420px]:gap-1.25">
              <h4>Tipo:</h4>
              <ComboBoxFiltro
                valor={tipoFiltro}
                placeholder="Todos los Tipos"
                opciones={opcionesTipo}
                onChange={(value) => {
                  setTipoFiltro(value);
                }}
              />
            </div>
          </div>
          {cargandoQS ? (
            <Loading />
          ) : errorQS ? (
            <Vacio
              titulo="Ocurrio un error"
              descripcion="No se pudo cargar la información."
              onReintentar={reintentar}
            />
          ) : !tieneQuejas ? (
            <Vacio
              titulo="No hay Quejas o Sugerencias"
              descripcion="No tienes quejas o sugerencias registradas"
            />
          ) : (
            quejasFiltradas.map((queja) => (
              <CardInfo
                key={queja.iD_QuejaSugerencia}
                queja={queja}
                onClick={() => setQuejaSeleccionada(queja)}
              />
            ))
          )}
        </div>
      )}
      {quejaSeleccionada && (
        <ModalForm
          titulo={
            quejaSeleccionada.tipo === "QUEJA"
              ? "Detalle de Queja"
              : "Detalle de Sugerencia"
          }
          onConfirmar={() => setQuejaSeleccionada(null)}
          onCancelar={() => setQuejaSeleccionada(null)}
          txtConfirmar="Cerrar"
          ocultarCancelar={true}
        >
          <p className="text-sm text-gray-500">
            {new Date(quejaSeleccionada.fechaCreacion).toLocaleDateString(
              "es-HN",
              {
                day: "2-digit",
                month: "long",
                year: "numeric",
              },
            )}
          </p>
          <p className="text-gray-700 whitespace-pre-line">
            <strong>Asunto: </strong>
            {quejaSeleccionada.asunto}
          </p>

          <p className="text-gray-700 whitespace-pre-line">
            <strong>Mensaje: </strong>
            {quejaSeleccionada.mensaje}
          </p>
        </ModalForm>
      )}
      {tabActiva === "crear" && (
        <div className="flex items-center justify-center">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-187.5 rounded-[5px] bg-white p-5 text-center shadow-[0px_3px_5px_3px_rgba(0,0,0,0.2)]"
          >
            <h2 className="text-[20px] font-bold text-[rgb(41,94,34)]">
              ¡Quejas y Sugerencias!
            </h2>
            <h3 className="text-[13px] text-[rgb(41,94,34)]">
              Siempre es un gusto saber su opinión sobre nuestro servicio
            </h3>
            <div className="mx-auto mt-5 flex w-full max-w-150 flex-col gap-2.5 text-left">
              <div className="flex flex-col">
                <label>Teléfono:</label>
                <Input
                  name="telefono"
                  type="text"
                  esValido={esValidoTelefono}
                  placeholder="Ingrese Telefono"
                  value={formData.telefono}
                  onChange={handlerOnChange}
                  onBlur={validationTelefono}
                />
                <SpanError
                  visible={!esValidoTelefono}
                  mensaje="El teléfono no es válido"
                />
              </div>
              <div className="flex flex-col">
                <label>Opción:</label>
                <hr />
                <div className="flex flex-col">
                  <label>
                    <input
                      type="radio"
                      name="tipo"
                      value="queja"
                      checked={formData.tipo === "queja"}
                      onChange={handlerOnChange}
                      onBlur={validationTipo}
                    />{" "}
                    Queja
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="tipo"
                      value="sugerencia"
                      checked={formData.tipo === "sugerencia"}
                      onChange={handlerOnChange}
                      onBlur={validationTipo}
                    />{" "}
                    Sugerencia
                  </label>
                </div>
                <SpanError
                  visible={!esValidoTipo}
                  mensaje="Seleccione una opción válida"
                />
              </div>
              <div className="flex flex-col">
                <label>Asunto:</label>
                <TextArea
                  name="asunto"
                  placeholder="Ingrese Asunto"
                  esValido={esValidoAsunto}
                  value={formData.asunto}
                  onChange={handlerOnChange}
                  onBlur={validationAsunto}
                />
                <SpanError
                  visible={!esValidoAsunto}
                  mensaje="Asunto no válido"
                />
              </div>
              <div className="flex flex-col">
                <label>Mensaje:</label>
                <TextArea
                  name="mensaje"
                  placeholder="Ingrese su Comentario..."
                  esValido={esValidoMensaje}
                  value={formData.mensaje}
                  onChange={handlerOnChange}
                  onBlur={validationMensaje}
                />
                <SpanError
                  visible={!esValidoMensaje}
                  mensaje="Mensaje no válido"
                />
              </div>

              <BtnPrimario
                type="submit"
                disabled={
                  !esValidoTelefono ||
                  !esValidoTipo ||
                  !esValidoAsunto ||
                  !esValidoMensaje
                }
              >
                {cargando ? "Enviando..." : "Enviar"}
              </BtnPrimario>
            </div>
            {error && (
              <p style={{ color: "red", textAlign: "center" }}>{error}</p>
            )}
          </form>
        </div>
      )}
    </div>
  );
}
