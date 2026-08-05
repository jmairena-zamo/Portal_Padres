// Creado por Diego Castro
// Archivo temporal que simula la respuesta del API de clases del periodo actual
// Reemplazar por el fetch() real cuando el API esté disponible

export interface ClasesPeriodoActual {
  CodigoAsignaturaB: string;
  CodigoActividadAcademica: string;
  Nota: string;
  Asignatura: string;
  Anio: string;
  Periodo: string;
  NRC: string;
}

export interface ClasesPeriodoResponse {
  status: number;
  message: string;
  response: ClasesPeriodoActual[];
}

export interface FilaClase {
  codigo: string;
  asignatura: string;
  seccion: string;
  periodo: string;
  Nota: string;
}

export function mapearClasesPeriodo(curso: ClasesPeriodoActual): FilaClase {
  const peri = `PERIODO ${curso.Anio} - ${curso.Periodo}`;
  return {
    codigo: curso.NRC,
    asignatura: curso.Asignatura.substring(9, curso.Asignatura.length),
    seccion: curso.CodigoAsignaturaB,
    periodo: peri,
    Nota: curso.Nota,
  };
}

export const ClasesPeriodo: ClasesPeriodoResponse = {
  status: 200,
  message: "Historial de clases cursando para el periodo",
  response: [
    {
      CodigoAsignaturaB: "AGN2011",
      CodigoActividadAcademica: "1057.202620",
      Nota: "79.9",
      Asignatura: "AGN2011 - LI1 - ECONOMIA GENERAL (C)",
      Anio: "2026",
      Periodo: "2",
      NRC: "1057",
    },
    {
      CodigoAsignaturaB: "AGI2012",
      CodigoActividadAcademica: "1059.202620",
      Nota: "92.25",
      Asignatura: "AGI2012 - LI1 - CIENCIA DE ALIMENTOS Y NUTRICION HUMANA (C)",
      Anio: "2026",
      Periodo: "2",
      NRC: "1059",
    },
    {
      CodigoAsignaturaB: "CPA2032",
      CodigoActividadAcademica: "1061.202620",
      Nota: "100",
      Asignatura: "CPA2032 - LI1 - PRODUCCION ANIMAL (C)",
      Anio: "2026",
      Periodo: "2",
      NRC: "1061",
    },
    {
      CodigoAsignaturaB: "IAD2031",
      CodigoActividadAcademica: "1065.202620",
      Nota: "89",
      Asignatura: "IAD2031 - LI1 - CAMBIO CLIMATICO (ECA)",
      Anio: "2026",
      Periodo: "2",
      NRC: "1065",
    },
    {
      CodigoAsignaturaB: "CG2212",
      CodigoActividadAcademica: "1078.202620",
      Nota: "95",
      Asignatura: "CG2212 - LI1 - FISICA (C4)",
      Anio: "2026",
      Periodo: "2",
      NRC: "1078",
    },
  ],
};
