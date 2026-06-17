"use client";
import Image from "next/image";
import user from "../../img/logo-user.png";
import { useEffect, useState } from "react";
import {
  FaExclamationTriangle,
  FaExclamationCircle,
  FaExclamation,
  FaClock,
} from "react-icons/fa";
import { RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";

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
          <h3 className="text-center">INFORMACIÓN ESTUDIANTE</h3>
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
          {/* porcentaje carrera */}
          <div className="flex-[1_1_200px] bg-white p-4 rounded-[5px] shadow-[0px_3px_5px_rgba(0,0,0,0.2)] text-center max-[420px]:flex-[1_1_100%]">
            <h3>PORCENTAJE CARRERA</h3>
            <hr />
            <div className="w-full h-3.75 bg-[#e5e7eb] rounded-[10px] overflow-hidden mt-8.75">
              <div
                className="h-full bg-[#008237] rounded-[10px] transition-[width] duration-400 ease-in-out"
                style={{ width: `${porcentaje}%` }}
              />
            </div>
            <span className="text-[12px] text-[#555] mt-1 block text-center">
              {porcentaje}%
            </span>
          </div>

          {/* promedio global */}
          <div className="flex-[1_1_200px] bg-white p-4 rounded-[5px] shadow-[0px_3px_5px_rgba(0,0,0,0.2)] text-center max-[420px]:flex-[1_1_100%]">
            <h3>PROMEDIO GLOBAL</h3>
            <hr />
            <div className="flex items-center gap-3.75 max-[420px]:justify-center">
              <RadialBarChart
                width={120}
                height={100}
                cx="50%"
                cy="50%"
                innerRadius="70%"
                outerRadius="100%"
                barSize={10}
                data={data}
              >
                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                <RadialBar dataKey="value" cornerRadius={10} fill="#008237" />
              </RadialBarChart>
              <span className="font-bold text-[25px]">{promedio}%</span>
            </div>
          </div>

          {/* horas clínica */}
          <div className="flex-[1_1_200px] bg-white p-4 rounded-[5px] shadow-[0px_3px_5px_rgba(0,0,0,0.2)] text-center max-[420px]:flex-[1_1_100%]">
            <h3>HORAS EN CLINICA</h3>
            <hr />
            <p className="font-bold text-[40px] mt-3.75 max-[420px]:text-[30px]">
              {horasClinica}
            </p>
          </div>

          {/* último periodo */}
          <div className="flex-[1_1_200px] bg-white p-4 rounded-[5px] shadow-[0px_3px_5px_rgba(0,0,0,0.2)] text-center max-[420px]:flex-[1_1_100%]">
            <h3>ÚLTIMO PERIODO</h3>
            <hr />
            <div className="flex items-center gap-3.75 max-[420px]:justify-center">
              <RadialBarChart
                width={120}
                height={100}
                cx="50%"
                cy="50%"
                innerRadius="70%"
                outerRadius="100%"
                barSize={10}
                data={data}
              >
                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                <RadialBar dataKey="value" cornerRadius={10} fill="#008237" />
              </RadialBarChart>
              <span className="font-bold text-[25px]">{promedio}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* fila 2 */}
      <div className="flex flex-wrap gap-4 w-full max-[420px]:flex-col">
        {/* causales de sanción */}
        <div className="flex-[1_1_300px] bg-white p-4 rounded-[5px] shadow-[0px_3px_5px_rgba(0,0,0,0.2)]">
          <h3 className="text-center">CAUSALES DE SANCIÓN</h3>
          <hr />
          <div className="mt-3 flex gap-17.5 text-[13px] max-[800px]:gap-7.5 max-[420px]:flex-col max-[420px]:gap-2.5">
            <div className="flex flex-col gap-3.75">
              <p className="flex items-center gap-2.5">
                <FaExclamationTriangle /> FALTAS TOTALES:
              </p>
              <p className="flex items-center gap-2.5">
                <FaExclamationCircle /> FALTAS DEL AÑO ACTUAL:
              </p>
            </div>
            <div className="flex flex-col gap-3.75">
              <p className="flex items-center gap-2.5">
                <FaExclamation /> FALTAS DEL PERIODO:
              </p>
              <p className="flex items-center gap-2.5">
                <FaClock /> FALTAS EN PROCESO:
              </p>
            </div>
          </div>
        </div>

        {/* stats */}
        <div className="flex-[1_1_250px] bg-white p-4 rounded-[5px] shadow-[0px_3px_5px_rgba(0,0,0,0.2)]">
          <h3 className="text-center">
            AÑO {new Date().getFullYear()}, PERIODO 1
          </h3>
          <hr />
          <div className="mt-3 flex gap-7.5 justify-center text-[13px] max-[420px]:flex-col max-[420px]:gap-3.75">
            <div className="bg-white shadow-[0px_3px_5px_3px_rgba(0,0,0,0.2)] p-2.5 rounded-[5px] text-center">
              <p className="text-[13px]">ACTIVIDADES ACADEMICAS</p>
              <p className="text-[13px]">5</p>
            </div>
            <div className="bg-white shadow-[0px_3px_5px_3px_rgba(0,0,0,0.2)] p-2.5 rounded-[5px] text-center">
              <p className="text-[13px]">TOTAL NOTAS MIGRADAS</p>
              <p className="text-[13px]">0/5</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
