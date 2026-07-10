// Creado por Diego Castro
// Interfaces para información de estudiante
// Simulación de la respuesta de la info estudiante
// Reemplazar por el fetch() real cuando el API esté disponible

export interface infoEstudiante {
  bannerID: number;
  Nombre: string;
  CodigoEstudiante: number;
  Correo: string;
  Carrera: string;
}

export interface InfoEstudianteResponse {
  status: number;
  message: string;
  response: infoEstudiante;
}

export const inforEstudiante: InfoEstudianteResponse = {
  status: 200,
  message: "Proceso exitoso",
  response: {
    bannerID: 1,
    Nombre: "Juan Carlos Matamoros Caceres",
    CodigoEstudiante: 27089,
    Correo: "JMatamoros@zamorano.edu",
    Carrera: "Ingeniería Agronómica",
  },
};

export interface ListaEstudiantesResponse {
  status: number;
  message: string;
  response: infoEstudiante[];
}

export const listaEstudiantes: ListaEstudiantesResponse = {
  status: 200,
  message: "Proceso exitoso",
  response: [
    {
      bannerID: 1,
      Nombre: "Diego Sebastian Castro Lagos",
      CodigoEstudiante: 27001,
      Correo: "DCastro@zamorano.edu",
      Carrera: "Ingeniería en Desarrollo",
    },
    {
      bannerID: 2,
      Nombre: "María Valentina Mendoza Ortiz",
      CodigoEstudiante: 27002,
      Correo: "MMendoza@zamorano.edu",
      Carrera: "Administración de Agronegocios",
    },
    {
      bannerID: 3,
      Nombre: "Carlos Eduardo Alvarado Reyes",
      CodigoEstudiante: 27003,
      Correo: "CAlvarado@zamorano.edu",
      Carrera: "Ingeniería Agronómica",
    },
    {
      bannerID: 4,
      Nombre: "Ana Lucía Gómez Pastrana",
      CodigoEstudiante: 27004,
      Correo: "AGomez@zamorano.edu",
      Carrera: "Ciencia y Producción Agropecuaria",
    },
    {
      bannerID: 5,
      Nombre: "Luis Fernando Rodríguez Zelaya",
      CodigoEstudiante: 27005,
      Correo: "LRodriguez@zamorano.edu",
      Carrera: "Ingeniería en Agroindustria",
    },
    {
      bannerID: 6,
      Nombre: "Sofía Alejandra Benítez Flores",
      CodigoEstudiante: 27006,
      Correo: "SBenitez@zamorano.edu",
      Carrera: "Ingeniería Agronómica",
    },
    {
      bannerID: 7,
      Nombre: "Javier Andrés Martínez Colindres",
      CodigoEstudiante: 27007,
      Correo: "JMartinez@zamorano.edu",
      Carrera: "Administración de Agronegocios",
    },
    {
      bannerID: 8,
      Nombre: "Valeria Nicolle Castillo Núñez",
      CodigoEstudiante: 27008,
      Correo: "VCastillo@zamorano.edu",
      Carrera: "Ingeniería en Desarrollo",
    },
    {
      bannerID: 9,
      Nombre: "Gabriel Enrique Pineda Aguilar",
      CodigoEstudiante: 27009,
      Correo: "GPineda@zamorano.edu",
      Carrera: "Ciencia y Producción Agropecuaria",
    },
    {
      bannerID: 10,
      Nombre: "Camila Isabella Vásquez Mejía",
      CodigoEstudiante: 27010,
      Correo: "CVasquez@zamorano.edu",
      Carrera: "Ingeniería Agronómica",
    },
  ],
};
