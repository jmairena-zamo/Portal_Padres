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
    .min(5, "La contraseña no es válida")
    .max(100, "La contraseña no es válida")
    .regex(/^[^<>{}[\]\\|]+$/, "La contraseña no es válida"),
});

export const recuperarContrasenaSchema = z.object({
  correo: z.string().email().trim()
});

export const nuevaContrasenaSchema = z.object({
  id_useremail: z.number(),
  correoElectronico: z.string().email().trim().regex(/^[^<>{}[\]\\|]+$/),
  contrasena: z.string()
    .min(5, "La contraseña no es válida")
    .max(100, "La contraseña no es válida")
    .regex(/^[^<>{}[\]\\|]+$/, "La contraseña no es válida"),
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

export type LoginFormData = z.infer<typeof loginSchema>;
export type RecuperarContrasenaData = z.infer<typeof recuperarContrasenaSchema>;
export type nuevaContrasenaData = z.infer<typeof nuevaContrasenaSchema>;
export type quejaData = z.infer<typeof quejaSchema>;