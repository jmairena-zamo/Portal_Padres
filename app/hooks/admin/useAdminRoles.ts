// Creado por Diego Castro
// Estados para la administración de roles

import { useCallback, useState } from "react";
import { Rol } from "@/app/interfaces/menus";
import { rolData, rolSchema } from "@/app/utils/validations";

type MostrarToast = (msg: string) => void;

export function useAdminRoles(
  mostrarExito: MostrarToast,
  mostrarError: MostrarToast,
) {
  const [roles, setRoles] = useState<Rol[]>([]);

  //----MODAL Y FORMULARIO DE ROL--------------------------------------------
  const [modalRol, setModalRol] = useState(false);
  const [modoRol, setModoRol] = useState<"crear" | "editar">("crear");
  const [rolSeleccionado, setRolSeleccionado] = useState<Rol | null>(null);
  const [formDataRol, setFormDataRol] = useState<rolData>({ rol: "" });
  const [esValidoRol, setEsValidoRol] = useState(true);
  const [errorRoles, setErrorRoles] = useState<boolean>(false);

  //----MODAL DE CONFIRMACIÓN-------------------------------------------------
  const [confirmModalRol, setConfirmModalRol] = useState<{
    visible: boolean;
    rol: Rol | null;
  }>({ visible: false, rol: null });

  //----Carga----------------------------------------------------------------
  const cargarRoles = async () => {
    setErrorRoles(false);
    try {
      const res = await fetch("/api/menu/adminMenuRol");
      if (!res.ok) {
        throw new Error(`Error ${res.status}`);
      }
      const data = await res.json();
      setRoles(data.roles);
      return data.roles as Rol[];
    } catch {
      mostrarError("Error de conexión. Intenta de nuevo.");
      setErrorRoles(true);
      return [];
    }
  };

  //----Validación y handlers--------------------------------------------------
  const handlerOnChangeRol = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormDataRol((values) => ({ ...values, [name]: value }));
    if (name === "rol" && !esValidoRol) setEsValidoRol(true);
  };

  const validationRol = () => {
    const result = rolSchema.shape.rol.safeParse(formDataRol.rol);
    setEsValidoRol(result.success);
  };

  const cancelarModalRol = () => {
    setFormDataRol({ rol: "" });
    setEsValidoRol(true);
    setModalRol(false);
  };

  //----CRUD-------------------------------------------------------------------
  const crearRol = async () => {
    if (!formDataRol.rol.trim()) return;

    const res = await fetch("/api/roles/crearRoles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rol: formDataRol.rol }),
    });

    if (res.ok) {
      mostrarExito(`Rol ${formDataRol.rol} creado correctamente`);
    } else {
      mostrarError("Error al crear el Rol");
    }

    setFormDataRol({ rol: "" });
    setModalRol(false);
    await cargarRoles();
  };

  // Precarga el formulario con los datos del rol y abre el modal en modo editar.
  const abrirEditarRol = (rol: Rol) => {
    setRolSeleccionado(rol);
    setFormDataRol({ rol: rol.rol });
    setModalRol(true);
    setModoRol("editar");
  };

  const editarRol = useCallback(async () => {
    if (!rolSeleccionado || !formDataRol.rol.trim()) return;

    const res = await fetch("/api/roles/actualizarRoles", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        iD_Rol: rolSeleccionado.iD_Rol,
        rol: formDataRol.rol,
      }),
    });

    if (res.ok) {
      mostrarExito(`Rol actualizado correctamente`);
    } else {
      mostrarError("Error al actualizar el rol");
    }

    setFormDataRol({ rol: "" });
    setRolSeleccionado(null);
    setModalRol(false);
    await cargarRoles();
  }, []);

  const pedirConfirmacionEliminar = (rol: Rol) => {
    setConfirmModalRol({ visible: true, rol });
  };

  const eliminarRol = async (rol: Rol) => {
    const res = await fetch("/api/roles/eliminarRoles", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ iD_Rol: rol.iD_Rol }),
    });
    if (res.ok) {
      mostrarExito(`Rol "${rol.rol}" eliminado`);
    } else {
      mostrarError("Error al eliminar el rol");
    }
    await cargarRoles();
  };

  const confirmarEliminar = async () => {
    if (!confirmModalRol.rol) return;
    const rolAEliminar = confirmModalRol.rol;
    // Cerrar el modal inmediatamente para evitar que reaparezca durante recargas
    setConfirmModalRol({ visible: false, rol: null });
    await eliminarRol(rolAEliminar);
  };

  return {
    roles,
    setRoles,
    cargarRoles,
    modalRol,
    setModalRol,
    modoRol,
    setModoRol,
    rolSeleccionado,
    formDataRol,
    esValidoRol,
    confirmModalRol,
    setConfirmModalRol,
    handlerOnChangeRol,
    validationRol,
    cancelarModalRol,
    crearRol,
    abrirEditarRol,
    editarRol,
    pedirConfirmacionEliminar,
    confirmarEliminar,
    errorRoles,
  };
}
