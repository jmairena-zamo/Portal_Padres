import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.NEXT_PUBLIC_KEY || "llave-por-defecto";;

export const cifrarDato = (dato: string) => {
    return CryptoJS.AES.encrypt(dato, SECRET_KEY ).toString();
};