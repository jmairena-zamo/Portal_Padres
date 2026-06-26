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
