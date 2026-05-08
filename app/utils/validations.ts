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
})

export const nuevaContrasenaSchema = z.object({
  id_useremail: z.number(),
  correoElectronico: z.string().email().trim(),
  contrasena: z.string()
    .min(5, "La contraseña no es válida")
    .max(100, "La contraseña no es válida")
    .regex(/^[^<>{}[\]\\|]+$/, "La contraseña no es válida"),
  relacion: z.string(),
  tipoUsuario: z.string(),
  usuario: z.string(),
})

export type LoginFormData = z.infer<typeof loginSchema>;
export type RecuperarContrasenaData = z.infer<typeof recuperarContrasenaSchema>;
export type nuevaContrasenaData = z.infer<typeof nuevaContrasenaSchema>;