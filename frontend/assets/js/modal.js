/**
 * Archivo: modal.js
 * Proyecto: Club Solis (demo)
 * Descripcion: Helpers minimos para abrir/cerrar modales (.modal-overlay),
 *              con cierre por click afuera y tecla Escape.
 * Creado: 2026-09-09
 */

export function abrirModal(elemento) {
  elemento.classList.add("activo");
}

export function cerrarModal(elemento) {
  elemento.classList.remove("activo");
}

/** Configura el cierre por click en el overlay y tecla Escape para un modal dado. */
export function configurarCierreModal(elemento) {
  elemento.addEventListener("click", (evento) => {
    if (evento.target === elemento) cerrarModal(elemento);
  });
  document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape" && elemento.classList.contains("activo")) cerrarModal(elemento);
  });
}
