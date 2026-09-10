/**
 * Archivo: login.js
 * Proyecto: Club Solis (demo)
 * Descripcion: Logica de la pantalla de login demo (botones por rol).
 * Creado: 2026-09-09
 */
import { api } from "./api.js";
import { guardarUsuario } from "./session.js";
import { mostrarToast } from "./toast.js";

const DESTINO_POR_ROL = { admin: "/admin/index.html", alumno: "/student/index.html" };

document.querySelectorAll(".opcion-rol").forEach((boton) => {
  boton.addEventListener("click", async () => {
    const rol = boton.dataset.rol;
    boton.disabled = true;
    try {
      const usuario = await api.post("/api/auth/demo-login", { rol });
      guardarUsuario(usuario);
      mostrarToast(`Bienvenido/a, ${usuario.nombre}`, "exito");
      window.location.href = DESTINO_POR_ROL[rol];
    } catch (error) {
      mostrarToast(error.message, "error");
      boton.disabled = false;
    }
  });
});
