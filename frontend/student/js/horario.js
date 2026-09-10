/**
 * Archivo: horario.js
 * Proyecto: Club Solis (demo)
 * Descripcion: "Mi horario" del alumno - sus inscripciones agrupadas por dia,
 *              con aviso si la clase fue cancelada por el admin.
 * Creado: 2026-09-09
 */
import { api } from "/assets/js/api.js";
import { exigirRol } from "/assets/js/session.js";
import { mostrarToast } from "/assets/js/toast.js";
import { montarNavInferior } from "/assets/js/nav-inferior.js";
import { DIAS_SEMANA, formatearHora, NOMBRES_BLOQUE } from "/assets/js/constantes.js";

const usuario = exigirRol("alumno");
montarNavInferior(window.location.pathname);

async function cargar() {
  const contenedor = document.getElementById("lista-horario");
  try {
    const inscripciones = await api.get(`/api/inscripciones?usuario_id=${usuario.id}`);
    render(inscripciones);
  } catch (error) {
    mostrarToast(error.message, "error");
    contenedor.innerHTML = "";
  }
}

function render(inscripciones) {
  const contenedor = document.getElementById("lista-horario");
  if (inscripciones.length === 0) {
    contenedor.innerHTML = `<div class="card estado-vacio">Todavía no estás anotado en ninguna clase.<br><a href="/student/index.html">Explorar clases →</a></div>`;
    return;
  }

  const porDia = {};
  inscripciones.forEach((i) => (porDia[i.clase.dia_semana] ||= []).push(i));

  contenedor.innerHTML = Object.keys(porDia)
    .sort((a, b) => a - b)
    .map((dia) => `
      <section>
        <p class="dia-titulo">${DIAS_SEMANA[dia]}</p>
        <div class="flex-col gap-md">${porDia[dia].map(tarjetaHtml).join("")}</div>
      </section>
    `)
    .join("");
}

function tarjetaHtml(insc) {
  const c = insc.clase;
  const badgeEstado = c.estado === "cancelada"
    ? `<span class="badge badge-cancelada">Cancelada</span>`
    : insc.estado === "confirmada"
      ? `<span class="badge badge-confirmada">Confirmada</span>`
      : `<span class="badge badge-pendiente">Lista de espera</span>`;

  const avisoCancelada = c.estado === "cancelada"
    ? `<div class="aviso-cancelada">Esta clase fue cancelada${c.motivo_cancelacion ? `: ${c.motivo_cancelacion}` : "."}</div>`
    : "";

  return `
    <div class="card clase-card">
      <div class="clase-card-top">
        <span class="chip" style="background:${c.disciplina.color_tag}22; color:${c.disciplina.color_tag}">
          <span class="chip-punto" style="background:${c.disciplina.color_tag}"></span>${c.disciplina.nombre}
        </span>
        ${badgeEstado}
      </div>
      <div>
        <strong>${formatearHora(c.hora_inicio)} - ${formatearHora(c.hora_fin)}</strong>
        <div class="texto-small">${c.profesor.nombre} · Bloque ${NOMBRES_BLOQUE[c.bloque]}</div>
      </div>
      ${avisoCancelada}
      <button class="btn btn-secundario btn-sm btn-bloque" data-accion="cancelar" data-id="${insc.id}">Cancelar mi inscripción</button>
    </div>
  `;
}

document.getElementById("lista-horario").addEventListener("click", async (evento) => {
  const boton = evento.target.closest("button[data-accion='cancelar']");
  if (!boton) return;
  if (!confirm("¿Cancelar tu inscripción a esta clase?")) return;

  try {
    await api.del(`/api/inscripciones/${boton.dataset.id}`);
    mostrarToast("Inscripción cancelada", "exito");
    await cargar();
  } catch (error) {
    mostrarToast(error.message, "error");
  }
});

cargar();
