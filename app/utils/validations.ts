import { z } from 'zod';

export const loginSchema = z.object({
  correo: z
    .string()
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
  correo: z.string().email().trim()
});

export const nuevaContrasenaSchema = z.object({
  id_useremail: z.number(),
  correoElectronico: z.string().email().trim().regex(/^[^<>{}[\]\\|]+$/),
  contrasena: z.string()
    .min(8, "La contraseña debe tener un mínimo de 8 caracteres")
    .max(12, "La contraseña debe tener un maximo de 12 caracteres")
    .regex(/^[a-zA-Z0-9]+$/, "La contraseña solo puede tener letras y numeros"),
  relacion: z.string().regex(/^[^<>{}[\]\\|]+$/),
  tipoUsuario: z.string().regex(/^[^<>{}[\]\\|]+$/),
  usuario: z.string().regex(/^[^<>{}[\]\\|]+$/),
});

export const quejaSchema = z.object({
  telefono: z.string()
    .min(8)
    .max(15)
    .trim()
    .regex(/^[^<>{}[\]\\|]+$/),
  tipo: z.enum(["queja", "sugerencia"]),
  asunto: z.string()
    .max(128)
    .min(3)
    .trim()
    .regex(/^[^<>{}[\]\\|]+$/),
  mensaje: z.string()
    .min(3)
    .max(512)  
    .trim()  
    .regex(/^[^<>{}[\]\\|]+$/)
})

export const menuSchema = z.object({
  opcion: z.string()
  .min(5)
  .max(40)
  .regex(/^[^<>{}[\]\\|]+$/),
  posicion: z.coerce.number().min(0),
  icono: z.string()
  .regex(/^[^<>{}[\]\\|]+$/),
})

export const subMenuSchema = z.object({
    opcion: z.string().min(1),
    posicion: z.number().min(1)
});

export const rolSchema = z.object({
  rol: z.string()
    .max(25)
    .regex(/^[^<>{}[\]\\|]+$/)
})

export type LoginFormData = z.infer<typeof loginSchema>;
export type RecuperarContrasenaData = z.infer<typeof recuperarContrasenaSchema>;
export type nuevaContrasenaData = z.infer<typeof nuevaContrasenaSchema>;
export type quejaData = z.infer<typeof quejaSchema>;
export type menuData = z.infer<typeof menuSchema>;
export type subMenuData = z.infer<typeof subMenuSchema>;
export type rolData = z.infer<typeof rolSchema>;