# Product Requirements Document (PRD)

## Resumen

Portal web en Next.js para padres de familia, que centraliza información académica, administrativa y financiera de sus hijos. Incluye un panel administrativo para gestión de roles y permisos.

## Usuarios objetivo

- Padres de familia: consultar calificaciones, historial académico, faltas, historial disciplinario e información financiera.
- Administradores: gestionar roles, permisos y accesos.

## Requerimientos funcionales

- Autenticación segura (login con usuario/contraseña).
- Visualización de:
  - Calificaciones actuales y \*\*[historial académico].
  - \*\*[Clases del periodo actual].
  - Información general del estudiante.
  - \*\*[Faltas registradas].
  - \*\*[Historial disciplinario].
  - \*\*[Estado de cuenta] (pagos pendientes, historial de pagos).
- Panel administrativo:
  - Definir roles (padre, docente, administrador).
  - Asignar permisos de acceso a páginas específicas.
  - Configuración dinámica del \*\*[sidebar] según permisos.
- Sidebar dinámico:
  - Mostrar solo las páginas habilitadas para el rol del usuario.
  - Ocultar secciones restringidas (ejemplo: historial disciplinario).

## Requerimientos no funcionales

- Compatibilidad con navegadores modernos.
- Accesibilidad conforme a WCAG 2.1 AA.
- Tiempo de carga menor a 2 segundos en páginas principales.
- Seguridad: cifrado de contraseñas, protección contra inyecciones SQL y XSS.
- Escalabilidad: soporte para múltiples instituciones educativas.

## Flujos de usuario

1. Padre inicia sesión.
2. Padre accede al dashboard y visualiza calificaciones e historial académico.
3. Padre consulta estado de cuenta y realiza seguimiento de pagos.
4. Administrador define roles y permisos desde el panel.
5. El sistema actualiza el sidebar dinámicamente según el rol.

## Criterios de aceptación

- Un padre puede iniciar sesión y ver solo la información de sus hijos.
- El administrador puede asignar permisos y el sidebar refleja los cambios.
- El sistema registra y muestra faltas y reportes disciplinarios.
- El estado de cuenta refleja pagos realizados y pendientes.
