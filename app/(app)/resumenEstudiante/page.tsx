// Creado por Diego Castro
// Dashboard que muestra información general del estudiante
// Sección de resumen del estudiante

"use client";
import Image from "next/image";
import user from "../../img/logo-user.png";
import { useState, useEffect } from "react";
import {
  FaExclamationTriangle,
  // FaExclamationCircle,
  FaExclamation,
  // FaClock,
  FaUniversity,
  FaBookOpen,
  FaLaptopCode,
} from "react-icons/fa";
import { RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";
import {
  CardCausal,
  ClaseAprenderHaciendo,
  Decanatura,
  Loading,
  TecnologiasInformacion,
} from "@/app/components/ui";
import { useEstudiante } from "@/app/hooks/useEstudiante";

export default function ResumenEstudiante() {
  // Hook personalizado para obtener información del estudiante
  const { estudiante } = useEstudiante();

  // Constantes para capsulas informativas
  const [decanatura, setDecanatura] = useState<boolean>(false);
  const [claseAH, setClaseAH] = useState<boolean>(false);
  const [tecnologias, setTecnologias] = useState<boolean>(false);

  // if (cargando) return <Loading />;
  const [fotoError, setFotoError] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Mostrar loading de 1 segundo al cambiar de estudiante
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsTransitioning(true);

    setFotoError(false);

    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [estudiante?.codigoEstudiante]);

  if (isTransitioning) return <Loading />;
  return (
    <div className="flex flex-col gap-4 p-4 max-[420px]:p-2">
      {/* fila 1 */}
      <div className="flex flex-wrap gap-4 w-full max-[800px]:flex-col">
        {/* card info estudiante */}
        <div className="flex-[1_1_300px] bg-[#ffffff] text-[#173426] p-4 rounded-lg shadow-[0px_1px_5px_rgba(0,0,0,0.2)]">
          <h3 className="text-center font-semibold">INFORMACIÓN ESTUDIANTE</h3>
          <hr className="my-2" />
          <br />
          <div className="flex justify-center">
            <Image
              src={
                estudiante?.fotografiaUrl && !fotoError
                  ? `/api/estudiantes/fotoProxy?u=${encodeURIComponent(
                      estudiante.fotografiaUrl,
                    )}`
                  : user
              }
              alt={estudiante?.nombreCompleto ?? "Foto estudiante"}
              width={150}
              onError={() => setFotoError(true)}
              height={150}
              className="
                        w-37.5 h-37.5 object-cover rounded-full shadow-[0px_1px_5px_rgba(0,0,0,0.2)]
                        max-[800px]:w-40 max-[800px]:h-40 
                        max-[420px]:w-30 max-[420px]:h-30
                    "
              // className="w-37.5 h-37.5 rounded-full shadow-[0px_3px_5px_3px_rgba(0,0,0,0.3)]"
            />
          </div>
          <br />
          <h4>
            <strong>Estudiante:</strong> {estudiante?.nombreCompleto ?? "N/A"}
          </h4>
          <h4>
            <strong>Código Estudiante:</strong>{" "}
            {estudiante?.codigoEstudiante ?? "N/A"}
          </h4>
          <h4>
            <strong>Carrera:</strong> {estudiante?.carreraNombre ?? "N/A"}
          </h4>
          <h4>
            <strong>Código Carrera:</strong>{" "}
            {estudiante?.carreraCodigo ?? "N/A"}
          </h4>
        </div>

        {/* graphics */}
        <div className="flex flex-col justify-center gap-4 flex-[2_1_400px] max-[800px]:flex-[1_1_auto]">
          {/* promedio global */}
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex-[1_1_200px] min-h-45 bg-[#ffffff] p-4 rounded-lg shadow-[0px_1px_5px_rgba(0,0,0,0.2)] text-center max-[420px]:flex-[1_1_100%] flex flex-col">
              <h3 className="font-semibold text-[#173426]">PROMEDIO GLOBAL</h3>
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
                  data={[
                    {
                      id: 1,
                      name: "promedio",
                      value: estudiante?.promedioGlobal,
                    },
                  ]}
                >
                  <PolarAngleAxis
                    type="number"
                    domain={[0, 100]}
                    tick={false}
                  />
                  <RadialBar dataKey="value" cornerRadius={10} fill="#048047" />
                </RadialBarChart>
                <span className="font-bold text-[24px] text-[#048047]">
                  {estudiante?.promedioGlobal
                    ? estudiante.promedioGlobal
                    : "N/A"}{" "}
                  %
                </span>
              </div>
            </div>

            {/* último periodo */}
            <div className="flex-[1_1_200px] min-h-45 bg-[#ffffff] p-4 rounded-lg shadow-[0px_1px_5px_rgba(0,0,0,0.2)] text-center max-[420px]:flex-[1_1_100%] flex flex-col">
              <h3 className="font-semibold text-[#173426]">
                PROMEDIO ÚLTIMO PERIODO
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
                  data={[
                    {
                      id: 1,
                      name: "promedio",
                      value: estudiante?.promedioTrimestre,
                    },
                  ]}
                >
                  <PolarAngleAxis
                    type="number"
                    domain={[0, 100]}
                    tick={false}
                  />
                  <RadialBar dataKey="value" cornerRadius={10} fill="#048047" />
                </RadialBarChart>
                <span className="font-bold text-[24px] text-[#048047]">
                  {estudiante?.promedioTrimestre
                    ? estudiante.promedioTrimestre
                    : "N/A"}{" "}
                  %
                </span>
              </div>
            </div>
          </div>

          {/* porcentaje carrera */}
          <div className="flex-[0.5_1_150px] bg-[#ffffff] p-4 rounded-lg shadow-[0px_1px_5px_rgba(0,0,0,0.2)] text-center max-[420px]:flex-[1_1_100%] flex flex-col">
            <h3 className="font-semibold text-[#173426]">PORCENTAJE CARRERA</h3>
            <hr className="my-2" />
            <div className="flex-1 flex flex-col items-center justify-center gap-2 px-2">
              <div className="w-full h-3 bg-[#e5e7eb] rounded-[10px] overflow-hidden">
                <div
                  className="h-full bg-[#048047] rounded-[10px] transition-[width] duration-400 ease-in-out"
                  style={{
                    width: `${
                      typeof estudiante?.porcentajeCarrera === "string"
                        ? parseFloat(estudiante.porcentajeCarrera) || 0
                        : estudiante?.porcentajeCarrera || 0
                    }%`,
                  }}
                />
              </div>
              <span className="text-[20px] font-bold text-[#048047]">
                {typeof estudiante?.porcentajeCarrera === "string"
                  ? estudiante.porcentajeCarrera
                  : estudiante?.porcentajeCarrera || "N/A"}{" "}
                %
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* fila 2 */}
      <div className="flex flex-wrap gap-4 w-full max-[420px]:flex-col">
        {/* causales de sanción */}
        <div className="flex-[1_1_200px] bg-[#ffffff] p-4 rounded-lg shadow-[0px_1px_5px_rgba(0,0,0,0.2)]">
          <h3 className="text-center font-semibold text-[#173426]">
            CAUSALES DE SANCIÓN
          </h3>
          <hr className="my-2" />
          <div className="grid grid-cols-1 gap-3 mt-4 max-[420px]:grid-cols-1">
            <CardCausal
              icono={FaExclamationTriangle}
              color="#dc2626"
              label="FALTAS TOTALES:"
              valor={estudiante?.totalFaltasHistorial ?? "N/A"}
            />
            {/* <CardCausal
              icono={FaExclamationCircle}
              color="#ea580c"
              label="FALTAS DEL AÑO ACTUAL:"
              valor={faltasTotalesAnio}
            /> */}
            <CardCausal
              icono={FaExclamation}
              color="#ca8a04"
              label="FALTAS DEL PERIODO:"
              valor={estudiante?.totalFaltasPeriodo ?? "N/A"}
            />
            {/* <CardCausal
              icono={FaClock}
              color="#2563eb"
              label="FALTAS EN PROCESO:"
              valor={2}
            /> */}
          </div>
        </div>

        {/* stats */}
        <div className="flex-[1_1_300px] bg-[#ffffff] p-4 rounded-lg shadow-[0px_1px_5px_rgba(0,0,0,0.2)]">
          <h3 className="text-center font-semibold text-[#173426]">
            DATOS ACADÉMICOS AL ÚLTIMO PERIODO
          </h3>
          <hr className="my-2" />

          <div className="grid grid-cols-3 gap-2 mt-4 text-[#30545b]">
            <div className="text-center bg-linear-to-r from-green-50 via-white to-green-50 shadow-md rounded-lg border border-green-100 p-2">
              <p className="text-[10px]  font-medium leading-tight">
                POSICIÓN CLASE
              </p>
              <p className="text-[15px] font-bold mt-1">
                {estudiante?.claseRanking ?? 0}/{estudiante?.claseTotal ?? 0}
              </p>
            </div>
            <div className="text-center bg-linear-to-r from-green-50 via-white to-green-50 shadow-md rounded-lg border border-green-100 p-2">
              <p className="text-[10px] font-medium leading-tight">
                POSICIÓN CARRERA
              </p>
              <p className="text-[15px] font-bold mt-1">
                {estudiante?.carreraRanking ?? 0}/
                {estudiante?.carreraTotal ?? 0}
              </p>
            </div>
            <div className="text-center bg-linear-to-r from-green-50 via-white to-green-50 shadow-md rounded-lg border border-green-100 p-2">
              <p className="text-[10px] font-medium leading-tight">
                POSICIÓN PAÍS
              </p>
              <p className="text-[15px] font-bold mt-1">
                {estudiante?.paisRanking ?? 0}/{estudiante?.paisTotal ?? 0}
              </p>
            </div>
          </div>

          {/* Categorías disciplinarias */}
          <div className="flex flex-col gap-1.5 justify-center mt-5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#30545b]">
                <strong>CAT. DISCIPLINARIA HISTORIAL</strong>
              </span>
              <span className="font-bold text-[14px] px-2 py-0.5 rounded-full border border-[#43C302] text-[#30545b]">
                {estudiante?.categoriaDisciplinariaHistorial ?? "N/A"}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#30545b]">
                <strong>CAT. DISCIPLINARIA PERIODO</strong>
              </span>
              <span className="font-bold text-[14px] px-2 py-0.5 rounded-full border border-[#43C302] text-[#30545b]">
                {estudiante?.categoriaDisciplinariaPeriodo ?? "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* fila 3 */}
      <div className="bg-[#ffffff] p-4 rounded-lg shadow-[0px_1px_5px_rgba(0,0,0,0.2)]">
        <h3 className="text-center font-semibold text-[#173426]">
          CÁPSULAS INFORMATIVAS
        </h3>

        <hr className="mt-2" />

        <div className="flex flex-col border-b border-gray-200 mt-5 max-[420px]:flex-wrap">
          <div className="mb-3">
            <button
              type="button"
              className="bg-[#173426] h-10 w-full rounded-t-lg text-[#FFF4E5] text-left px-6 cursor-pointer flex items-center gap-3 max-[420px]:text-[12px]"
              onClick={() => setDecanatura(!decanatura)}
            >
              <FaUniversity />
              DECANATURA ACÁDEMICA
              {/* <FaChevronDown
                className={`text-[white] transition-transform duration-300 ${
                  decanatura ? "rotate-180" : ""
                }`}
              /> */}
            </button>
            {decanatura && (
              <div className="border border-[#173426] rounded-b-[5px]">
                <Decanatura />
              </div>
            )}
          </div>
          <div className="mb-3">
            <button
              type="button"
              className="bg-[#048047] h-10 w-full rounded-t-lg text-[#FFF4E5] text-left px-6 cursor-pointer flex items-center gap-3 max-[420px]:text-[12px]"
              onClick={() => setClaseAH(!claseAH)}
            >
              {/* <FaChevronDown
                className={`text-[white] transition-transform duration-300 ${
                  claseAH ? "rotate-180" : ""
                }`}
              /> */}
              <FaBookOpen />
              CLASES Y APRENDER HACIENDO
            </button>
            {claseAH && (
              <div className="border border-[#048047] rounded-b-[5px]">
                <ClaseAprenderHaciendo />
              </div>
            )}
          </div>

          <div>
            <button
              type="button"
              className="bg-[#74bdca] h-10 w-full rounded-t-lg text-[#FFF4E5] text-left px-6 cursor-pointer flex items-center gap-3 max-[420px]:text-[12px]"
              onClick={() => setTecnologias(!tecnologias)}
            >
              {/* <FaChevronDown
                className={`text-[white] transition-transform duration-300 ${
                  tecnologias ? "rotate-180" : ""
                }`}
              /> */}
              <FaLaptopCode />
              TECNOLOGÍAS DE INFORMACIÓN
            </button>
            {tecnologias && (
              <div className="border border-[#74bdca] rounded-b-[5px]">
                <TecnologiasInformacion />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
