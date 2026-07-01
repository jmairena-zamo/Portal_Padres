// Creado por Diego Castro
// Archivo temporal que simula la respuesta del API de faltas
// Reemplazar por el fetch() real cuando el API esté disponible

export interface accionesEstudiantiles {
  accionEstudianteID: number;
  codigoEstudiante: string;
  ano?: number;
  periodo?: number;
  fechaAccion?: string;
  tipoCodigoAccion: string;
  descripcionTipoAccion: string;
  faltaMerito: boolean;
  numeroFaltas: number;
  descripcionAccion: string;
  descripcionDetallada: string;
  fechaReportada?: string;
  reportadaPor?: string;
  aprobada?: boolean;
  fechaAprobada?: string;
  aprobadaPor?: string;
  eliminada?: boolean;
  eliminadaPor?: string;
  fechaEliminada?: string;
  codigoMotivoRemosion?: string;
  usuario?: string;
  dateTimeStamp: string;
  autoAprobada: boolean;
}

export interface Faltas {
  categoriaDisciplinaria: string;
  totalFaltas: number;
  totalFaltasEsteAnio: number;
  accionesEstudiantiles: accionesEstudiantiles[];
}

export interface FaltasResponse {
  status: number;
  message: string;
  response: {
    categoriaDisciplinaria: string;
    totalFaltas: number;
    totalFaltasEsteAnio: number;
    accionesEstudiantiles: accionesEstudiantiles[];
  };
}

export interface FilaHistorialDisciplinario {
  id: number;
  tipo: string;
  fecha?: string;
  periodo?: string;
  descripcionCorta: string;
  descripcionDetallada: string;
  reportadaPor?: string;
  numfaltas: number;
  estado: string;
  motivoRemosion?: string;
  fechaAprobada?: string;
  fechaEliminada?: string;
}

export function mapearHistorialDisciplinario(
  m: accionesEstudiantiles,
  index: number,
): FilaHistorialDisciplinario {
  const estado = m.aprobada ? "Aprobada" : m.eliminada ? "Eliminada" : "N/A";

  return {
    id: index,
    tipo: m.tipoCodigoAccion,
    fecha: m.fechaAccion?.substring(0, 10),
    periodo: [m.ano, m.periodo].filter(Boolean).join(" - ") || undefined,
    descripcionCorta: m.descripcionTipoAccion,
    descripcionDetallada: m.descripcionDetallada,
    reportadaPor: m.reportadaPor,
    numfaltas: m.numeroFaltas,
    estado: estado,
    motivoRemosion: m.codigoMotivoRemosion,
    fechaAprobada: m.fechaAprobada?.substring(0, 10),
    fechaEliminada: m.fechaEliminada?.substring(0, 10),
  };
}

export const FaltasEstudiante: FaltasResponse = {
  status: 200,
  message: "Proceso exitoso",
  response: {
    categoriaDisciplinaria: "Excelente",
    totalFaltas: 4,
    totalFaltasEsteAnio: 0,
    accionesEstudiantiles: [
      {
        accionEstudianteID: 538859,
        codigoEstudiante: "27002",
        ano: 2026,
        periodo: 1,
        fechaAccion: "2026-02-18T00:00:00",
        tipoCodigoAccion: "LE0202",
        descripcionTipoAccion:
          "Dejar la puerta de su cuarto sin seguro (sin llave) o con la llave puesta en el llavín",
        faltaMerito: true,
        numeroFaltas: 2,
        descripcionAccion:
          "El día 18/02/2026 hora 07:11 a.m. En el dormitorio de Heraldos planta alta el cuarto #24 se encontraba con la puerta abierta, conforme al rol de limpieza el cuarto está habitado por: 26112 - SAUL ALEJANDRO ELVIR RIVERA, 27002 - CARLOS RAFAEL GIRÓN PAIZ. ",
        descripcionDetallada:
          "El día 18/02/2026 hora 07:11 a.m. En el dormitorio de Heraldos planta alta el cuarto #24 se encontraba con la puerta abierta, conforme al rol de limpieza el cuarto está habitado por: 26112 - SAUL ALEJANDRO ELVIR RIVERA, 27002 - CARLOS RAFAEL GIRÓN PAIZ. ",
        fechaReportada: "2026-02-19T12:48:22.04",
        reportadaPor: "Jose Roberto Peña Mejia",
        aprobada: false,
        aprobadaPor: "",
        eliminada: true,
        eliminadaPor: "Camila Almendárez",
        fechaEliminada: "2026-03-07T00:00:00",
        codigoMotivoRemosion: "Responsable compañero de cuarto",
        usuario: "zamorano\\calmendarez",
        dateTimeStamp: "2026-02-22T23:59:36.34",
        autoAprobada: false,
      },
      {
        accionEstudianteID: 536012,
        codigoEstudiante: "27002",
        fechaAccion: "2025-08-28T00:00:00",
        tipoCodigoAccion: "204",
        descripcionTipoAccion: "ABANDONAR EL TRABAJO ANTES DE LA HRA. REGLAM.",
        faltaMerito: true,
        numeroFaltas: 0,
        descripcionAccion: "PRUEBA IT",
        descripcionDetallada:
          "ESTO ES UNA PRUEBA EN PRODUCCION REALIZADA POR IT",
        reportadaPor: "Nelson Chacon",
        aprobada: false,
        aprobadaPor: "",
        eliminada: true,
        eliminadaPor: "Nelson Chacon",
        fechaEliminada: "2025-08-28T00:00:00",
        codigoMotivoRemosion: "Prueba",
        dateTimeStamp: "2025-08-28T15:15:40.37",
        autoAprobada: false,
      },
      {
        accionEstudianteID: 536013,
        codigoEstudiante: "27002",
        fechaAccion: "2025-08-28T00:00:00",
        tipoCodigoAccion: "204",
        descripcionTipoAccion: "ABANDONAR EL TRABAJO ANTES DE LA HRA. REGLAM.",
        faltaMerito: true,
        numeroFaltas: 0,
        descripcionAccion: "PRUEBA IT",
        descripcionDetallada:
          "ESTO ES UNA PRUEBA EN PRODUCCION REALIZADA POR IT",
        reportadaPor: "Nelson Chacon",
        aprobada: false,
        aprobadaPor: "",
        eliminada: true,
        eliminadaPor: "Nelson Chacon",
        fechaEliminada: "2025-08-28T00:00:00",
        codigoMotivoRemosion: "Prueba",
        dateTimeStamp: "2025-08-28T15:41:32.583",
        autoAprobada: false,
      },
      {
        accionEstudianteID: 532832,
        codigoEstudiante: "27002",
        ano: 2025,
        periodo: 1,
        fechaAccion: "2025-01-20T00:00:00",
        tipoCodigoAccion: "OYL005",
        descripcionTipoAccion:
          "Incumplir con las normas de buena presentación (o uso adecuado del uniforme como se indica en e Manual de Procedimientos y Regulaciones",
        faltaMerito: true,
        numeroFaltas: 1,
        descripcionAccion:
          "se reporta a estudiante que anda con uniforme manchado se le hizo conciencia sobre el uso de camisas de uniforme que estén manchadas con \r\nimpresiones o escrituras que no sean de Zamorano, no podrán ser y se le dijo que estas no pueden ser utilizadas dentro ni fuera de la Institución.\r\nel estudiante venia de biblioteca y se encontró en el quiosco de Ruben Dario.",
        descripcionDetallada:
          "se reporta a estudiante que anda con uniforme manchado se le hizo conciencia sobre el uso de camisas de uniforme que estén manchadas con \r\nimpresiones o escrituras que no sean de Zamorano, no podrán ser y se le dijo que estas no pueden ser utilizadas dentro ni fuera de la Institución.\r\nel estudiante venia de biblioteca y se encontró en el quiosco de Ruben Dario.",
        fechaReportada: "2025-01-24T19:47:00.73",
        reportadaPor: "Grebel Onevis Murillo Ortiz",
        aprobada: true,
        fechaAprobada: "2025-02-10T01:00:02.193",
        aprobadaPor: "Host",
        eliminada: false,
        usuario: "ZAMORANO\\aalopez",
        dateTimeStamp: "2025-01-29T15:34:41.04",
        autoAprobada: false,
      },
      {
        accionEstudianteID: 529317,
        codigoEstudiante: "27002",
        ano: 2024,
        periodo: 2,
        fechaAccion: "2024-06-24T00:00:00",
        tipoCodigoAccion: "ARC027",
        descripcionTipoAccion:
          "Irrespetar y/o maltratar de cualquier forma, compañeros, empleados u otras personas",
        faltaMerito: true,
        numeroFaltas: 3,
        descripcionAccion:
          "Ayer lunes 24/06/2024 pasé por la calle principal en mi vehiculo y miré mucho movimiento en la residencias de varones en Zona Este. Cuando me bajé del carro, varios estudiantes salieron corriendo y apagaban la luz de ambas alas. comence a buscar cuarto por cuarto al estudiante que me vio, me escuchó cuando le dije que se detuviera y salió corriendo. El estudiante 27002 Carlos Giron estaba fuera de su cuarto, se encontraba en el ala de abajo y cuando me vio salió corriendo aun cuando le dije directamente a él que se detuviera. Esto ocurrió a las 10:06 pm aproximadamente, hora en la que ya todos los estudiantes deben estar en sus cuartos. ",
        descripcionDetallada:
          "Ayer lunes 24/06/2024 pasé por la calle principal en mi vehiculo y miré mucho movimiento en la residencias de varones en Zona Este. Cuando me bajé del carro, varios estudiantes salieron corriendo y apagaban la luz de ambas alas. comence a buscar cuarto por cuarto al estudiante que me vio, me escuchó cuando le dije que se detuviera y salió corriendo. El estudiante 27002 Carlos Giron estaba fuera de su cuarto, se encontraba en el ala de abajo y cuando me vio salió corriendo aun cuando le dije directamente a él que se detuviera. Esto ocurrió a las 10:06 pm aproximadamente, hora en la que ya todos los estudiantes deben estar en sus cuartos. ",
        fechaReportada: "2024-06-25T09:33:37.81",
        reportadaPor: "Alenis Alejandra Lopez Osorio",
        aprobada: true,
        fechaAprobada: "2024-07-10T01:00:41.34",
        aprobadaPor: "Host",
        eliminada: false,
        usuario: "ZAMORANO\\aalopez",
        dateTimeStamp: "2024-06-25T09:50:49.14",
        autoAprobada: false,
      },
    ],
  },
};
