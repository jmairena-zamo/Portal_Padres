import { z } from 'zod';

export const loginSchema = z.object({
  correo: z
    .string()
    .email("El correo no es válido"),
  contrasena: z
    .string()
    .min(1, "La contraseña no es válida")
    .max(100, "La contraseña no es válida"),
});

export type LoginFormData = z.infer<typeof loginSchema>;