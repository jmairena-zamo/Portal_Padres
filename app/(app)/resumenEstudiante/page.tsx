"use client";
import Image from "next/image";
import user from "../../img/logo-user.png";
import { useEffect, useState } from "react";
import {
  FaExclamationTriangle,
  FaExclamationCircle,
  FaExclamation,
  FaClock,
  FaChevronDown,
} from "react-icons/fa";
import { RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";
import {
  BtnTab,
  CardCausal,
  ClaseAprenderHaciendo,
  Decanatura,
  TecnologiasInformacion,
} from "@/app/components/ui";

export default function ResumenEstudiante() {
  const [estudiante, setEstudiante] = useState({
    Nombre: "xxxxxx",
    Apellido: "xxxxx",
    Codigo: "12345e",
    Carrera: "xcxcxc",
  });

  const [porcentaje, setPorcentaje] = useState(20.88);
  const promedio = 88.88;
  const horasClinica = 10;
  const [foto, setFoto] = useState<string | null>(null);
  const [mostrarCapsulas, setMostrarCapsulas] = useState(false);
  const [tabActiva, setTabActiva] = useState<
    "decanatura" | "clases" | "tecnologias"
  >("decanatura");

  const data = [{ id: 1, name: "promedio", value: promedio }];

  useEffect(() => {
    const cargarFoto = async () => {
      try {
        const res = await fetch("/api/estudiantes/obtenerFoto");
        const data = await res.json();
        setFoto(data.foto ?? null);
      } catch (error) {
        console.log("error con la foto");
        setFoto(null);
      }
    };
    cargarFoto();
  });

  return (
    <div className="flex flex-col gap-4 p-4 max-[420px]:p-2">
      {/* fila 1 */}
      <div className="flex flex-wrap gap-4 w-full max-[800px]:flex-col">
        {/* card info estudiante */}
        <div className="flex-[1_1_300px] bg-white p-4 rounded-[5px] shadow-[0px_3px_5px_rgba(0,0,0,0.2)]">
          <h3 className="text-center font-semibold text-[#374151]">
            INFORMACIÓN ESTUDIANTE
          </h3>
          <hr />
          <br />
          <div className="flex justify-center">
            <Image
              src={foto ? `data:image/jpeg;base64,${foto}` : user}
              alt="Logo usuario"
              width={150}
              height={150}
              className="
                        w-37.5 h-37.5 object-cover rounded-full shadow-[0px_3px_5px_3px_rgba(0,0,0,0.3)]
                        max-[800px]:w-40 max-[800px]:h-40 
                        max-[420px]:w-30 max-[420px]:h-30
                    "
              // className="w-37.5 h-37.5 rounded-full shadow-[0px_3px_5px_3px_rgba(0,0,0,0.3)]"
            />
          </div>
          <br />
          <h4>
            Estudiante: {estudiante.Nombre} {estudiante.Apellido}
          </h4>
          <h4>Codigo Estudiante: {estudiante.Codigo}</h4>
          <h4>Carrera: {estudiante.Carrera}</h4>
        </div>

        {/* graphics */}
        <div className="flex flex-wrap justify-center gap-4 flex-[2_1_400px] max-[800px]:flex-[1_1_auto]">
          {/* promedio global */}
          <div className="flex-[1_1_200px] bg-white p-4 rounded-[5px] shadow-[0px_3px_5px_rgba(0,0,0,0.2)] text-center max-[420px]:flex-[1_1_100%] flex flex-col">
            <h3 className="text-[14px] font-semibold text-[#374151]">
              PROMEDIO GLOBAL
            </h3>
            <hr className="my-2" />
            <div className="flex-1 flex items-center justify-center gap-3">
              <RadialBarChart
                width={100}
                height={90}
                cx="50%"
                cy="50%"
                innerRadius="70%"
                outerRadius="100%"
                barSize={9}
                data={data}
              >
                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                <RadialBar dataKey="value" cornerRadius={10} fill="#008237" />
              </RadialBarChart>
              <span className="font-bold text-[24px] text-[#008237]">
                {promedio}%
              </span>
            </div>
          </div>

          {/* horas clínica */}
          <div className="flex-[1_1_200px] bg-white p-4 rounded-[5px] shadow-[0px_3px_5px_rgba(0,0,0,0.2)] text-center max-[420px]:flex-[1_1_100%] flex flex-col">
            <h3 className="text-[14px] font-semibold text-[#374151]">
              HORAS EN CLÍNICA
            </h3>
            <hr className="my-2" />
            <div className="flex-1 flex items-center justify-center">
              <p className="font-bold text-[38px] text-[#2563eb]">
                {horasClinica}
              </p>
            </div>
          </div>

          {/* último periodo */}
          <div className="flex-[1_1_200px] bg-white p-4 rounded-[5px] shadow-[0px_3px_5px_rgba(0,0,0,0.2)] text-center max-[420px]:flex-[1_1_100%] flex flex-col">
            <h3 className="text-[14px] font-semibold text-[#374151]">
              ÚLTIMO PERIODO
            </h3>
            <hr className="my-2" />
            <div className="flex-1 flex items-center justify-center gap-3">
              <RadialBarChart
                width={100}
                height={90}
                cx="50%"
                cy="50%"
                innerRadius="70%"
                outerRadius="100%"
                barSize={9}
                data={data}
              >
                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                <RadialBar dataKey="value" cornerRadius={10} fill="#FFD200" />
              </RadialBarChart>
              <span className="font-bold text-[24px] text-[#ca8a04]">
                {promedio}%
              </span>
            </div>
          </div>

          {/* porcentaje carrera */}
          <div className="flex-[1_1_200px] bg-white p-4 rounded-[5px] shadow-[0px_3px_5px_rgba(0,0,0,0.2)] text-center max-[420px]:flex-[1_1_100%] flex flex-col">
            <h3 className="text-[14px] font-semibold text-[#374151]">
              PORCENTAJE CARRERA
            </h3>
            <hr className="my-2" />
            <div className="flex-1 flex flex-col items-center justify-center gap-2 px-2">
              <div className="w-full h-3 bg-[#e5e7eb] rounded-[10px] overflow-hidden">
                <div
                  className="h-full bg-[#008237] rounded-[10px] transition-[width] duration-400 ease-in-out"
                  style={{ width: `${porcentaje}%` }}
                />
              </div>
              <span className="text-[20px] font-bold text-[#008237]">
                {porcentaje}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* fila 2 */}
      <div className="flex flex-wrap gap-4 w-full max-[420px]:flex-col">
        {/* causales de sanción */}
        <div className="flex-[1_1_300px] bg-white p-4 rounded-[5px] shadow-[0px_3px_5px_rgba(0,0,0,0.2)]">
          <h3 className="text-center font-semibold text-[#374151]">
            CAUSALES DE SANCIÓN
          </h3>
          <hr />
          <div className="grid grid-cols-2 gap-3 mt-4 max-[420px]:grid-cols-1">
            <CardCausal
              icono={FaExclamationTriangle}
              color="#dc2626"
              label="FALTAS TOTALES:"
              valor={12}
            />
            <CardCausal
              icono={FaExclamationCircle}
              color="#ea580c"
              label="FALTAS DEL AÑO ACTUAL:"
              valor={12}
            />
            <CardCausal
              icono={FaExclamation}
              color="#ca8a04"
              label="FALTAS DEL PERIODO:"
              valor={12}
            />
            <CardCausal
              icono={FaClock}
              color="#2563eb"
              label="FALTAS EN PROCESO:"
              valor={12}
            />
          </div>
        </div>

        {/* stats */}
        <div className="flex-[1_1_200px] bg-white p-4 rounded-[5px] shadow-[0px_3px_5px_rgba(0,0,0,0.2)]">
          <h3 className="text-center font-semibold text-[#374151]">
            DATOS ACADÉMICOS AL ÚLTIMO PERIODO
          </h3>
          <hr />

          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="text-center bg-[#f9fafb] rounded-[5px] p-2">
              <p className="text-[10px] text-[#6b7280] font-medium leading-tight">
                POSICIÓN CLASE
              </p>
              <p className="text-[15px] font-bold text-[#374151] mt-1">
                238/275
              </p>
            </div>
            <div className="text-center bg-[#f9fafb] rounded-[5px] p-2">
              <p className="text-[10px] text-[#6b7280] font-medium leading-tight">
                POSICIÓN CARRERA
              </p>
              <p className="text-[15px] font-bold text-[#374151] mt-1">35/40</p>
            </div>
            <div className="text-center bg-[#f9fafb] rounded-[5px] p-2">
              <p className="text-[10px] text-[#6b7280] font-medium leading-tight">
                POSICIÓN PAÍS
              </p>
              <p className="text-[15px] font-bold text-[#374151] mt-1">34/36</p>
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-3">
            <div className="flex items-center justify-between text-[13px] px-1">
              <span>CAT. DISCIPLINARIA PERIODO</span>
              <span className="font-bold text-[11px] px-2 py-0.5 rounded-full">
                EXCELENTE
              </span>
            </div>
            <div className="flex items-center justify-between text-[13px] px-1">
              <span>CAT. DISCIPLINARIA HISTÓRICA</span>
              <span className="font-bold text-[11px] px-2 py-0.5 rounded-full">
                REGULAR
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* fila 3 */}
      <div className="bg-white p-4 rounded-[5px] shadow-[0px_3px_5px_rgba(0,0,0,0.2)]">
        <button
          onClick={() => setMostrarCapsulas((prev) => !prev)}
          className="w-full flex items-center justify-between cursor-pointer"
        >
          <h3 className="text-left font-semibold text-[#374151]">
            CÁPSULAS INFORMATIVAS
          </h3>
          <FaChevronDown
            className={`text-[#6b7280] transition-transform duration-300 ${
              mostrarCapsulas ? "rotate-180" : ""
            }`}
          />
        </button>
        <hr className="mt-2" />

        {mostrarCapsulas && (
          <>
            <div className="flex gap-2.5 border-b border-gray-200 mt-5 max-[420px]:flex-wrap">
              <BtnTab
                activa={tabActiva === "decanatura"}
                onClick={() => setTabActiva("decanatura")}
              >
                DECANATURA ACÁDEMICA
              </BtnTab>
              <BtnTab
                activa={tabActiva === "clases"}
                onClick={() => setTabActiva("clases")}
              >
                CLASES Y APRENDER HACIENDO
              </BtnTab>
              <BtnTab
                activa={tabActiva === "tecnologias"}
                onClick={() => setTabActiva("tecnologias")}
              >
                TECNOLOGÍAS DE INFORMACIÓN
              </BtnTab>
            </div>

            <div className="mt-4">
              {tabActiva === "decanatura" && <Decanatura />}
              {tabActiva === "clases" && <ClaseAprenderHaciendo />}
              {tabActiva === "tecnologias" && <TecnologiasInformacion />}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
