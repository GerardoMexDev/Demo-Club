/**
 * Archivo: explorar.js
 * Proyecto: PULSO Club (demo)
 * Descripcion: Explorador de clases del alumno - ver disciplinas/horarios y
 *              solicitar ingreso (confirmado o lista de espera segun cupo).
 * Creado: 2026-09-09
 */
import { api } from "/assets/js/api.js";
import { exigirRol } from "/assets/js/session.js";
import { mostrarToast } from "/assets/js/toast.js";
import { montarNavInferior } from "/assets/js/nav-inferior.js";
import { DIAS_SEMANA, formatearHora, NOMBRES_BLOQUE } from "/assets/js/constantes.js";

const usuario = exigirRol("alumno");
montarNavInferior(window.location.pathname);

let disciplinaSeleccionada = "";
let misInscripciones = [];

async function cargarFiltros() {
  const disciplinas = await api.get("/api/disciplinas");
  const contenedor = document.getElementById("filtro-disciplina-chips");
  contenedor.innerHTML =
    `<button data-disciplina="" class="activo">Todas</button>` +
    disciplinas.map((d) => `<button data-disciplina="${d.id}">${d.nombre}</button>`).join("");

  contenedor.addEventListener("click", (evento) => {
    const boton = evento.target.closest("button[data-disciplina]");
    if (!boton) return;
    disciplinaSeleccionada = boton.dataset.disciplina;
    contenedor.querySelectorAll("button").forEach((b) => b.classList.toggle("activo", b === boton));
    cargarClases();
  });
}

function inscripcionDe(claseId) {
  return misInscripciones.find((i) => i.clase_id === claseId);
}

async function cargarClases() {
  const contenedor = document.getElementById("lista-explorar");
  const params = new URLSearchParams({ estado: "activa" });
  if (disciplinaSeleccionada) params.set("disciplina_id", disciplinaSeleccionada);

  try {
    const [clases, inscripciones] = await Promise.all([
      api.get(`/api/clases?${params.toString()}`),
      api.get(`/api/inscripciones?usuario_id=${usuario.id}`),
    ]);
    misInscripciones = inscripciones;
    renderClases(clases);
  } catch (error) {
    mostrarToast(error.message, "error");
    contenedor.innerHTML = "";
  }
}

function renderClases(clases) {
  const contenedor = document.getElementById("lista-explorar");
  if (clases.length === 0) {
    contenedor.innerHTML = `<div class="card estado-vacio">No hay clases activas para este filtro.</div>`;
    return;
  }

  const porDia = {};
  clases.forEach((c) => (porDia[c.dia_semana] ||= []).push(c));

  contenedor.innerHTML = Object.keys(porDia)
    .sort((a, b) => a - b)
    .map((dia) => `
      <section>
        <p class="dia-titulo">${DIAS_SEMANA[dia]}</p>
        <div class="flex-col gap-md">${porDia[dia].map(tarjetaClaseHtml).join("")}</div>
      </section>
    `)
    .join("");
}

function tarjetaClaseHtml(c) {
  const inscripcion = inscripcionDe(c.id);
  let accion;
  if (inscripcion) {
    accion = inscripcion.estado === "confirmada"
      ? `<span class="badge badge-confirmada">Inscripto</span>`
      : `<span class="badge badge-pendiente">En lista de espera</span>`;
  } else if (c.cupos_disponibles > 0) {
    accion = `<button class="btn btn-primario btn-sm btn-bloque" data-accion="solicitar" data-id="${c.id}">Solicitar ingreso</button>`;
  } else {
    accion = `<button class="btn btn-secundario btn-sm btn-bloque" data-accion="solicitar" data-id="${c.id}">Unirme a lista de espera</button>`;
  }

  return `
    <div class="card clase-card">
      <div class="clase-card-top">
        <span class="chip" style="background:${c.disciplina.color_tag}22; color:${c.disciplina.color_tag}">
          <span class="chip-punto" style="background:${c.disciplina.color_tag}"></span>${c.disciplina.nombre}
        </span>
        <span class="texto-small">${c.cupos_disponibles} cupos libres</span>
      </div>
      <div>
        <strong>${formatearHora(c.hora_inicio)} - ${formatearHora(c.hora_fin)}</strong>
        <div class="texto-small">${c.profesor.nombre} · Bloque ${NOMBRES_BLOQUE[c.bloque]}</div>
      </div>
      ${accion}
    </div>
  `;
}

document.getElementById("lista-explorar").addEventListener("click", async (evento) => {
  const boton = evento.target.closest("button[data-accion='solicitar']");
  if (!boton) return;
  boton.disabled = true;

  try {
    const inscripcion = await api.post("/api/inscripciones", { usuario_id: usuario.id, clase_id: Number(boton.dataset.id) });
    mostrarToast(
      inscripcion.estado === "confirmada" ? "¡Listo! Quedaste inscripto en la clase." : "Quedaste en lista de espera, te avisamos si se libera un cupo.",
      "exito"
    );
    await cargarClases();
  } catch (error) {
    mostrarToast(error.message, "error");
    boton.disabled = false;
  }
});

(async function iniciar() {
  await cargarFiltros();
  await cargarClases();
})();
