import CryptoJS from "crypto-js";

export const cifrarDato = (dato: string) => {
  return CryptoJS.SHA256(dato.trim()).toString();
};

export const descifrarDato = (dato: string) => {
  return dato;
};