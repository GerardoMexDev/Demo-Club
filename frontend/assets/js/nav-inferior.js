/**
 * Archivo: nav-inferior.js
 * Proyecto: PULSO Club (demo)
 * Descripcion: Barra de navegacion inferior del portal Alumno (mobile-first).
 * Creado: 2026-09-09
 */
const ITEMS = [
  { href: "/student/index.html", etiqueta: "Explorar", icono: "M3 12l9-9 9 9M5 10v10h14V10" },
  { href: "/student/horario.html", etiqueta: "Mi horario", icono: "M4 5h16M4 12h16M4 19h10" },
  { href: "/student/perfil.html", etiqueta: "Perfil", icono: "M12 12a4 4 0 100-8 4 4 0 000 8zM4 21a8 8 0 0116 0" },
];

/** @param {string} rutaActual - window.location.pathname de la pagina actual */
export function montarNavInferior(rutaActual) {
  const contenedor = document.getElementById("nav-inferior");
  if (!contenedor) return;

  contenedor.innerHTML = ITEMS.map((item) => `
    <a href="${item.href}" class="${rutaActual === item.href ? "activo" : ""}">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="${item.icono}"/>
      </svg>
      ${item.etiqueta}
    </a>
  `).join("");
}
