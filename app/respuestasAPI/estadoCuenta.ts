// Creado por Diego Castro
// Archivo temporal que simula la respuesta del API de estado de cuenta
// Reemplazar por el fetch() real cuando el API esté disponible

export interface EstudianteCuenta {
  sprideN_NTYP_CODE: string;
  sprideN_ENTITY_IND: string;
  sprideN_ID: string;
  gobumaP_UDC_ID: string;
  sprideN_PIDM: string;
  sprideN_FIRST_NAME: string;
  sprideN_MI: string;
  sprideN_LAST_NAME: string;
  sorlcuR_LEVL_CODE: string;
  stvlevL_DESC: string;
}

export interface MovimientoCuenta {
  tbraccD_PIDM: number;
  tbraccD_TRAN_NUMBER: number;
  tbraccD_TERM_CODE: number;
  tbraccD_DETAIL_CODE: string;
  tbbdetC_DESC: string;
  tbbdetC_DCAT_CODE: string;
  ttvdcaT_DESC: string;
  tbbdetC_TYPE_IND: string;
  tbbdetC_TYPE_IND_DESC: string;
  tbbdetC_PRIORITY: number;
  tbraccD_AMOUNT: number;
  tbraccD_BALANCE: number;
  tbraccD_ACTIVITY_DATE: string;
  tbraccD_EFFECTIVE_DATE: string;
  tbraccD_SRCE_CODE: string;
  interest: number;
  latefee: number;
  currencyorigin: string;
  tranbalance: number;
  tranamount: number;
}

export interface EstadoCuentaResponse {
  status: number;
  message: string;
  response: {
    student: EstudianteCuenta;
    summary: MovimientoCuenta[];
    details: MovimientoCuenta[];
    balance: number;
  };
}

export interface FilaCuenta {
  id: number;
  fecha: string;
  descripcion: string;
  categoria: string;
  tipo: string;
  monto: number;
  saldo: number;
  intereses: number;
}

export function mapearMovimiento(m: MovimientoCuenta): FilaCuenta {
  return {
    id: m.tbraccD_TRAN_NUMBER,
    fecha: new Date(m.tbraccD_EFFECTIVE_DATE).toLocaleDateString("es-HN"),
    descripcion: m.tbbdetC_DESC,
    categoria: m.ttvdcaT_DESC,
    tipo: m.tbbdetC_TYPE_IND_DESC,
    monto: m.tbraccD_AMOUNT,
    saldo: m.tbraccD_BALANCE,
    intereses: m.interest,
  };
}

export const EstadoCuenta: EstadoCuentaResponse = {
  status: 200,
  message: "Proceso exitoso",
  response: {
    student: {
      sprideN_NTYP_CODE: "NATU",
      sprideN_ENTITY_IND: "P",
      sprideN_ID: "28110",
      gobumaP_UDC_ID: "50922A84A3DE4D52E0630100007F9A32",
      sprideN_PIDM: "72784",
      sprideN_FIRST_NAME: "GILMA",
      sprideN_MI: "VALERIA",
      sprideN_LAST_NAME: "TORRES*GUEVARA",
      sorlcuR_LEVL_CODE: "LI",
      stvlevL_DESC: "LICENCIATURA",
    },
    summary: [
      {
        tbraccD_PIDM: 72784,
        tbraccD_TRAN_NUMBER: 5,
        tbraccD_TERM_CODE: 202620,
        tbraccD_DETAIL_CODE: "CBOL",
        tbbdetC_DESC: "BANCO DE OCCIDENTE -LIC",
        tbbdetC_DCAT_CODE: "CNT",
        ttvdcaT_DESC: "CONTRATOS",
        tbbdetC_TYPE_IND: "C",
        tbbdetC_TYPE_IND_DESC: "CARGO",
        tbbdetC_PRIORITY: 994,
        tbraccD_AMOUNT: 10.0,
        tbraccD_BALANCE: 10.0,
        tbraccD_ACTIVITY_DATE: "2026-05-07T00:00:00",
        tbraccD_EFFECTIVE_DATE: "2026-05-07T00:00:00",
        tbraccD_SRCE_CODE: "C",
        interest: 0.0,
        latefee: 0.0,
        currencyorigin: "USD",
        tranbalance: 10.0,
        tranamount: 10.0,
      },
      {
        tbraccD_PIDM: 72784,
        tbraccD_TRAN_NUMBER: 4,
        tbraccD_TERM_CODE: 202620,
        tbraccD_DETAIL_CODE: "MLIC",
        tbbdetC_DESC: "MATRICULA LICENCIATURA",
        tbbdetC_DCAT_CODE: "TUI",
        ttvdcaT_DESC: "COLEGIATURA",
        tbbdetC_TYPE_IND: "C",
        tbbdetC_TYPE_IND_DESC: "CARGO",
        tbbdetC_PRIORITY: 997,
        tbraccD_AMOUNT: 5592.0,
        tbraccD_BALANCE: 5592.0,
        tbraccD_ACTIVITY_DATE: "2026-05-02T00:00:00",
        tbraccD_EFFECTIVE_DATE: "2026-05-02T00:00:00",
        tbraccD_SRCE_CODE: "R",
        interest: 167.76,
        latefee: 0.0,
        currencyorigin: "USD",
        tranbalance: 5592.0,
        tranamount: 5592.0,
      },
      {
        tbraccD_PIDM: 72784,
        tbraccD_TRAN_NUMBER: 3,
        tbraccD_TERM_CODE: 202620,
        tbraccD_DETAIL_CODE: "SEST",
        tbbdetC_DESC: "SERVICIOS ESTUDIANTILES",
        tbbdetC_DCAT_CODE: "FEE",
        ttvdcaT_DESC: "CUOTAS DE INSCRIPCION",
        tbbdetC_TYPE_IND: "C",
        tbbdetC_TYPE_IND_DESC: "CARGO",
        tbbdetC_PRIORITY: 996,
        tbraccD_AMOUNT: 445.0,
        tbraccD_BALANCE: 445.0,
        tbraccD_ACTIVITY_DATE: "2026-05-02T00:00:00",
        tbraccD_EFFECTIVE_DATE: "2026-05-02T00:00:00",
        tbraccD_SRCE_CODE: "R",
        interest: 13.35,
        latefee: 0.0,
        currencyorigin: "USD",
        tranbalance: 445.0,
        tranamount: 445.0,
      },
      {
        tbraccD_PIDM: 72784,
        tbraccD_TRAN_NUMBER: 2,
        tbraccD_TERM_CODE: 202620,
        tbraccD_DETAIL_CODE: "AALM",
        tbbdetC_DESC: "ALOJAMIENTO Y ALIMENTACION",
        tbbdetC_DCAT_CODE: "FEE",
        ttvdcaT_DESC: "CUOTAS DE INSCRIPCION",
        tbbdetC_TYPE_IND: "C",
        tbbdetC_TYPE_IND_DESC: "CARGO",
        tbbdetC_PRIORITY: 996,
        tbraccD_AMOUNT: 1268.0,
        tbraccD_BALANCE: 1268.0,
        tbraccD_ACTIVITY_DATE: "2026-05-02T00:00:00",
        tbraccD_EFFECTIVE_DATE: "2026-05-02T00:00:00",
        tbraccD_SRCE_CODE: "R",
        interest: 38.04,
        latefee: 0.0,
        currencyorigin: "USD",
        tranbalance: 1268.0,
        tranamount: 1268.0,
      },
    ],
    details: [
      {
        tbraccD_PIDM: 72784,
        tbraccD_TRAN_NUMBER: 5,
        tbraccD_TERM_CODE: 202620,
        tbraccD_DETAIL_CODE: "CBOL",
        tbbdetC_DESC: "BANCO DE OCCIDENTE -LIC",
        tbbdetC_DCAT_CODE: "CNT",
        ttvdcaT_DESC: "CONTRATOS",
        tbbdetC_TYPE_IND: "C",
        tbbdetC_TYPE_IND_DESC: "CARGO",
        tbbdetC_PRIORITY: 994,
        tbraccD_AMOUNT: 10.0,
        tbraccD_BALANCE: 10.0,
        tbraccD_ACTIVITY_DATE: "2026-05-07T00:00:00",
        tbraccD_EFFECTIVE_DATE: "2026-05-07T00:00:00",
        tbraccD_SRCE_CODE: "C",
        interest: 0.0,
        latefee: 0.0,
        currencyorigin: "USD",
        tranbalance: 10.0,
        tranamount: 10.0,
      },
      {
        tbraccD_PIDM: 72784,
        tbraccD_TRAN_NUMBER: 4,
        tbraccD_TERM_CODE: 202620,
        tbraccD_DETAIL_CODE: "MLIC",
        tbbdetC_DESC: "MATRICULA LICENCIATURA",
        tbbdetC_DCAT_CODE: "TUI",
        ttvdcaT_DESC: "COLEGIATURA",
        tbbdetC_TYPE_IND: "C",
        tbbdetC_TYPE_IND_DESC: "CARGO",
        tbbdetC_PRIORITY: 997,
        tbraccD_AMOUNT: 5592.0,
        tbraccD_BALANCE: 5592.0,
        tbraccD_ACTIVITY_DATE: "2026-05-02T00:00:00",
        tbraccD_EFFECTIVE_DATE: "2026-05-02T00:00:00",
        tbraccD_SRCE_CODE: "R",
        interest: 167.76,
        latefee: 0.0,
        currencyorigin: "USD",
        tranbalance: 5592.0,
        tranamount: 5592.0,
      },
      {
        tbraccD_PIDM: 72784,
        tbraccD_TRAN_NUMBER: 3,
        tbraccD_TERM_CODE: 202620,
        tbraccD_DETAIL_CODE: "SEST",
        tbbdetC_DESC: "SERVICIOS ESTUDIANTILES",
        tbbdetC_DCAT_CODE: "FEE",
        ttvdcaT_DESC: "CUOTAS DE INSCRIPCION",
        tbbdetC_TYPE_IND: "C",
        tbbdetC_TYPE_IND_DESC: "CARGO",
        tbbdetC_PRIORITY: 996,
        tbraccD_AMOUNT: 445.0,
        tbraccD_BALANCE: 445.0,
        tbraccD_ACTIVITY_DATE: "2026-05-02T00:00:00",
        tbraccD_EFFECTIVE_DATE: "2026-05-02T00:00:00",
        tbraccD_SRCE_CODE: "R",
        interest: 13.35,
        latefee: 0.0,
        currencyorigin: "USD",
        tranbalance: 445.0,
        tranamount: 445.0,
      },
      {
        tbraccD_PIDM: 72784,
        tbraccD_TRAN_NUMBER: 2,
        tbraccD_TERM_CODE: 202620,
        tbraccD_DETAIL_CODE: "AALM",
        tbbdetC_DESC: "ALOJAMIENTO Y ALIMENTACION",
        tbbdetC_DCAT_CODE: "FEE",
        ttvdcaT_DESC: "CUOTAS DE INSCRIPCION",
        tbbdetC_TYPE_IND: "C",
        tbbdetC_TYPE_IND_DESC: "CARGO",
        tbbdetC_PRIORITY: 996,
        tbraccD_AMOUNT: 1268.0,
        tbraccD_BALANCE: 1268.0,
        tbraccD_ACTIVITY_DATE: "2026-05-02T00:00:00",
        tbraccD_EFFECTIVE_DATE: "2026-05-02T00:00:00",
        tbraccD_SRCE_CODE: "R",
        interest: 38.04,
        latefee: 0.0,
        currencyorigin: "USD",
        tranbalance: 1268.0,
        tranamount: 1268.0,
      },
      {
        tbraccD_PIDM: 72784,
        tbraccD_TRAN_NUMBER: 1,
        tbraccD_TERM_CODE: 202610,
        tbraccD_DETAIL_CODE: "SILP",
        tbbdetC_DESC: "SALDO INICIAL LI PAGO",
        tbbdetC_DCAT_CODE: "MIG",
        ttvdcaT_DESC: "MIGRACION DE DATOS",
        tbbdetC_TYPE_IND: "P",
        tbbdetC_TYPE_IND_DESC: "PAGO",
        tbbdetC_PRIORITY: 990,
        tbraccD_AMOUNT: 1664.37,
        tbraccD_BALANCE: -1664.37,
        tbraccD_ACTIVITY_DATE: "2026-04-29T00:00:00",
        tbraccD_EFFECTIVE_DATE: "2026-04-30T00:00:00",
        tbraccD_SRCE_CODE: "W",
        interest: 0.0,
        latefee: 0.0,
        currencyorigin: "USD",
        tranbalance: -1664.37,
        tranamount: 1664.37,
      },
    ],
    balance: 7534.15,
  },
};
