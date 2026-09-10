/**
 * Archivo: nav-admin.js
 * Proyecto: Club Solis (demo)
 * Descripcion: Barra de navegacion superior del portal Admin. Se monta una
 *              sola vez por pagina para no duplicar el mismo HTML en cada .html.
 * Creado: 2026-09-09
 */
import { obtenerUsuario, cerrarSesion } from "./session.js";

const ITEMS = [
  { href: "/admin/index.html", etiqueta: "Dashboard" },
  { href: "/admin/disciplinas.html", etiqueta: "Disciplinas" },
  { href: "/admin/horarios.html", etiqueta: "Horarios" },
];

/** @param {string} rutaActual - window.location.pathname de la pagina actual */
export function montarNavAdmin(rutaActual) {
  const usuario = obtenerUsuario();
  const contenedor = document.getElementById("nav-admin");
  if (!contenedor) return;

  const enlaces = ITEMS.map(
    (item) => `<a href="${item.href}" class="${rutaActual === item.href ? "activo" : ""}">${item.etiqueta}</a>`
  ).join("");

  contenedor.innerHTML = `
    <div class="container">
      <div class="marca">Solis<span class="punto">●</span></div>
      <nav aria-label="Navegación admin">${enlaces}</nav>
      <div class="flex items-center gap-sm">
        <span class="texto-small">${usuario ? usuario.nombre : ""}</span>
        <button class="btn-icon" id="btn-cerrar-sesion" title="Cerrar sesión" aria-label="Cerrar sesión">⏻</button>
      </div>
    </div>
  `;

  document.getElementById("btn-cerrar-sesion").addEventListener("click", cerrarSesion);
}
