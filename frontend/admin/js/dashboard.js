/**
 * Archivo: dashboard.js
 * Proyecto: Club Solis (demo)
 * Descripcion: Carga el resumen y las clases de hoy para el dashboard Admin.
 * Creado: 2026-09-09
 */
import { api } from "/assets/js/api.js";
import { exigirRol } from "/assets/js/session.js";
import { mostrarToast } from "/assets/js/toast.js";
import { montarNavAdmin } from "/assets/js/nav-admin.js";
import { formatearHora, NOMBRES_BLOQUE } from "/assets/js/constantes.js";

exigirRol("admin");
montarNavAdmin(window.location.pathname);

function renderCardsResumen(resumen) {
  const contenedor = document.getElementById("cards-resumen");
  const items = [
    { valor: resumen.clases_hoy, etiqueta: "Clases de hoy" },
    { valor: resumen.profesores_activos, etiqueta: "Profesores activos" },
    { valor: resumen.cupos_disponibles_hoy, etiqueta: "Cupos disponibles hoy" },
    { valor: resumen.total_disciplinas, etiqueta: "Disciplinas" },
  ];
  contenedor.innerHTML = items
    .map((i) => `<div class="card card-resumen"><span class="valor">${i.valor}</span><span class="etiqueta">${i.etiqueta}</span></div>`)
    .join("");
}

function renderClasesHoy(clases) {
  const contenedor = document.getElementById("lista-clases-hoy");
  if (clases.length === 0) {
    contenedor.innerHTML = `<div class="card estado-vacio">No hay clases programadas para hoy.</div>`;
    return;
  }

  contenedor.innerHTML = clases
    .map((c) => `
      <div class="card flex items-center justify-between flex-wrap gap-md">
        <div class="flex items-center gap-md">
          <span class="chip" style="background:${c.disciplina.color_tag}22; color:${c.disciplina.color_tag}">
            <span class="chip-punto" style="background:${c.disciplina.color_tag}"></span>${c.disciplina.nombre}
          </span>
          <div>
            <strong>${formatearHora(c.hora_inicio)} - ${formatearHora(c.hora_fin)}</strong>
            <div class="texto-small">${c.profesor.nombre} · Bloque ${NOMBRES_BLOQUE[c.bloque]}</div>
          </div>
        </div>
        <div class="flex items-center gap-md">
          <span class="badge badge-${c.estado}">${c.estado === "activa" ? "Activa" : "Cancelada"}</span>
          <span class="texto-small">${c.inscriptos_confirmados}/${c.cupo_maximo} cupos</span>
        </div>
      </div>
    `)
    .join("");
}

async function cargar() {
  try {
    const [resumen, clasesHoy] = await Promise.all([
      api.get("/api/dashboard/resumen"),
      api.get("/api/dashboard/clases-hoy"),
    ]);
    renderCardsResumen(resumen);
    renderClasesHoy(clasesHoy);
  } catch (error) {
    mostrarToast(error.message, "error");
  }
}

cargar();
