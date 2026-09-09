/**
 * Archivo: toast.js
 * Proyecto: PULSO Club (demo)
 * Descripcion: Sistema de notificaciones tipo toast (feedback de cada accion
 *              del usuario), con la identidad visual del sistema de diseno.
 * Creado: 2026-09-09
 */

const ICONOS = {
  exito: "✓",
  error: "✕",
  advertencia: "!",
  info: "i",
};

function obtenerContenedor() {
  let contenedor = document.querySelector(".toast-contenedor");
  if (!contenedor) {
    contenedor = document.createElement("div");
    contenedor.className = "toast-contenedor";
    contenedor.setAttribute("role", "status");
    contenedor.setAttribute("aria-live", "polite");
    document.body.appendChild(contenedor);
  }
  return contenedor;
}

/**
 * Muestra un toast que se autodescarta.
 * @param {string} mensaje - texto a mostrar
 * @param {"exito"|"error"|"advertencia"|"info"} [tipo]
 */
export function mostrarToast(mensaje, tipo = "info") {
  const contenedor = obtenerContenedor();
  const toast = document.createElement("div");
  toast.className = `toast toast-${tipo}`;
  toast.innerHTML = `<strong aria-hidden="true">${ICONOS[tipo] || ICONOS.info}</strong><span>${mensaje}</span>`;
  contenedor.appendChild(toast);

  const quitar = () => {
    toast.classList.add("saliendo");
    toast.addEventListener("animationend", () => toast.remove(), { once: true });
  };
  setTimeout(quitar, 3500);
  toast.addEventListener("click", quitar);
}
