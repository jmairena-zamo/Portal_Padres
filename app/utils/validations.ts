import { z } from "zod";

export const loginSchema = z.object({
  correo: z
    .email("El correo no es válido")
    .trim()
    .refine((val) => !/[<>{}[\]\\]/.test(val), {
      message: "El correo contiene caracteres no permitidos",
    }),
  contrasena: z
    .string()
    .min(8, "La contraseña debe tener un mínimo de 8 caracteres")
    .max(12, "La contraseña debe tener un maximo de 12 caracteres")
    .regex(/^[a-zA-Z0-9]+$/, "La contraseña solo puede tener letras y numeros"),
});

export const recuperarContrasenaSchema = z.object({
  correo: z.email().trim(),
});

export const nuevaContrasenaSchema = z.object({
  id_useremail: z.number(),
  correoElectronico: z.email().trim(),
  contrasena: z
    .string()
    .min(8, "La contraseña debe tener un mínimo de 8 caracteres")
    .max(12, "La contraseña debe tener un maximo de 12 caracteres")
    .regex(/^[a-zA-Z0-9]+$/, "La contraseña solo puede tener letras y numeros"),
  relacion: z.string().regex(/^[^<>{}[\]\\|]+$/),
  iD_Rol: z.number(),
  usuario: z.string().regex(/^[^<>{}[\]\\|]+$/),
  token: z.string(),
});

export const quejaSchema = z.object({
  telefono: z
    .string()
    .min(8)
    .max(15)
    .trim()
    .regex(/^[^<>{}[\]\\|]+$/),
  tipo: z.enum(["queja", "sugerencia"]),
  asunto: z
    .string()
    .max(128)
    .min(3)
    .trim()
    .regex(/^[^<>{}[\]\\|]+$/),
  mensaje: z
    .string()
    .min(3)
    .max(512)
    .trim()
    .regex(/^[^<>{}[\]\\|]+$/),
});

export const menuSchema = z.object({
  opcion: z
    .string()
    .min(1)
    .max(40)
    .regex(/^[^<>{}[\]\\|]+$/),
  posicion: z.coerce.number().min(0),
  icono: z.string().regex(/^[^<>{}[\]\\|]+$/),
});

export const subMenuSchema = z.object({
  opcion: z.string().min(1),
  posicion: z.number().min(1),
});

export const rolSchema = z.object({
  rol: z
    .string()
    .max(25)
    .regex(/^[^<>{}[\]\\|]+$/),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RecuperarContrasenaData = z.infer<typeof recuperarContrasenaSchema>;
export type nuevaContrasenaData = z.infer<typeof nuevaContrasenaSchema>;
export type quejaData = z.infer<typeof quejaSchema>;
export type menuData = Omit<z.infer<typeof menuSchema>, "posicion"> & {
  posicion: number | "";
};
export type subMenuData = Omit<z.infer<typeof subMenuSchema>, "posicion"> & {
  posicion: number | "";
};
export type rolData = z.infer<typeof rolSchema>;
