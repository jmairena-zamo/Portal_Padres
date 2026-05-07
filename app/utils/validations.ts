import { z } from 'zod';

export const loginSchema = z.object({
  correo: z
    .string()
    .email("El correo no es válido")
    .trim()
    .toUpperCase()
    .refine((val) => !/[<>{}[\]\\]/.test(val), {
      message: "El correo contiene caracteres no permitidos",
    }),
  contrasena: z
    .string()
    .min(5, "La contraseña no es válida")
    .max(100, "La contraseña no es válida")
    .regex(/^[^<>{}[\]\\|]+$/, "La contraseña no es válida"),
});

export type LoginFormData = z.infer<typeof loginSchema>;