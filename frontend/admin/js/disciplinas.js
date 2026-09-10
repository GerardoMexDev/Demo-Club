/**
 * Archivo: disciplinas.js
 * Proyecto: Club Solis (demo)
 * Descripcion: CRUD de disciplinas y asignacion de hasta 2 profesores por disciplina.
 * Creado: 2026-09-09
 */
import { api } from "/assets/js/api.js";
import { exigirRol } from "/assets/js/session.js";
import { mostrarToast } from "/assets/js/toast.js";
import { montarNavAdmin } from "/assets/js/nav-admin.js";
import { abrirModal, cerrarModal, configurarCierreModal } from "/assets/js/modal.js";

exigirRol("admin");
montarNavAdmin(window.location.pathname);

const modalDisciplina = document.getElementById("modal-disciplina");
const formDisciplina = document.getElementById("form-disciplina");
configurarCierreModal(modalDisciplina);

let disciplinas = [];
let profesores = [];

async function cargarTodo() {
  try {
    [disciplinas, profesores] = await Promise.all([api.get("/api/disciplinas"), api.get("/api/profesores")]);
    renderDisciplinas();
    renderProfesores();
  } catch (error) {
    mostrarToast(error.message, "error");
  }
}

function renderProfesores() {
  const contenedor = document.getElementById("lista-profesores");
  if (profesores.length === 0) {
    contenedor.innerHTML = `<p class="texto-small">Todavía no hay profesores cargados.</p>`;
    return;
  }
  contenedor.innerHTML = profesores
    .map((p) => `<span class="profesor-chip">${p.nombre}${p.especialidad ? ` · <span class="texto-small">${p.especialidad}</span>` : ""}</span>`)
    .join("");
}

function renderDisciplinas() {
  const contenedor = document.getElementById("lista-disciplinas");
  if (disciplinas.length === 0) {
    contenedor.innerHTML = `<div class="card estado-vacio">Todavía no hay disciplinas. Creá la primera con el botón de arriba.</div>`;
    return;
  }

  contenedor.innerHTML = disciplinas.map((d) => {
    const idsAsignados = new Set(d.profesores.map((p) => p.id));
    const disponibles = profesores.filter((p) => !idsAsignados.has(p.id));

    const filasProfesores = d.profesores
      .map((p) => `
        <div class="profesor-fila">
          <span>${p.nombre}</span>
          <button class="btn-icon" data-accion="quitar-profesor" data-disciplina="${d.id}" data-profesor="${p.id}" title="Quitar" aria-label="Quitar profesor">✕</button>
        </div>
      `)
      .join("") || `<p class="texto-small">Sin profesores asignados todavía.</p>`;

    const formAsignar = d.profesores.length < 2 && disponibles.length > 0 ? `
      <form class="asignar-profesor" data-accion="asignar-profesor" data-disciplina="${d.id}">
        <select class="input" name="profesor_id" required>
          <option value="">Asignar profesor…</option>
          ${disponibles.map((p) => `<option value="${p.id}">${p.nombre}</option>`).join("")}
        </select>
        <button class="btn btn-secundario btn-sm" type="submit">Asignar</button>
      </form>
    ` : "";

    return `
      <div class="card disciplina-card">
        <div class="flex items-center justify-between">
          <span class="chip" style="background:${d.color_tag}22; color:${d.color_tag}">
            <span class="chip-punto" style="background:${d.color_tag}"></span>${d.nombre}
          </span>
          <div class="flex gap-sm">
            <button class="btn-icon" data-accion="editar" data-id="${d.id}" title="Editar" aria-label="Editar disciplina">✎</button>
            <button class="btn-icon" data-accion="eliminar" data-id="${d.id}" title="Eliminar" aria-label="Eliminar disciplina">🗑</button>
          </div>
        </div>
        ${d.descripcion ? `<p class="texto-small">${d.descripcion}</p>` : ""}
        <div class="lista-profesores-disciplina">${filasProfesores}</div>
        ${formAsignar}
      </div>
    `;
  }).join("");
}

// ---------- Modal crear/editar disciplina ----------

document.getElementById("btn-nueva-disciplina").addEventListener("click", () => {
  formDisciplina.reset();
  formDisciplina.elements.id.value = "";
  document.getElementById("titulo-modal-disciplina").textContent = "Nueva disciplina";
  abrirModal(modalDisciplina);
});

document.getElementById("btn-cancelar-modal-disciplina").addEventListener("click", () => cerrarModal(modalDisciplina));

formDisciplina.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  const datos = new FormData(formDisciplina);
  const id = datos.get("id");
  const payload = { nombre: datos.get("nombre").trim(), descripcion: datos.get("descripcion").trim() || null };

  try {
    if (id) {
      await api.put(`/api/disciplinas/${id}`, payload);
      mostrarToast("Disciplina actualizada", "exito");
    } else {
      await api.post("/api/disciplinas", payload);
      mostrarToast("Disciplina creada", "exito");
    }
    cerrarModal(modalDisciplina);
    await cargarTodo();
  } catch (error) {
    mostrarToast(error.message, "error");
  }
});

// ---------- Acciones sobre cada card (delegacion de eventos) ----------

document.getElementById("lista-disciplinas").addEventListener("click", async (evento) => {
  const boton = evento.target.closest("button[data-accion]");
  if (!boton) return;
  const { accion, id, disciplina, profesor } = boton.dataset;

  if (accion === "editar") {
    const d = disciplinas.find((x) => x.id === Number(id));
    formDisciplina.reset();
    formDisciplina.elements.id.value = d.id;
    formDisciplina.elements.nombre.value = d.nombre;
    formDisciplina.elements.descripcion.value = d.descripcion || "";
    document.getElementById("titulo-modal-disciplina").textContent = "Editar disciplina";
    abrirModal(modalDisciplina);
  }

  if (accion === "eliminar") {
    if (!confirm("¿Eliminar esta disciplina? Esta acción no se puede deshacer.")) return;
    try {
      await api.del(`/api/disciplinas/${id}`);
      mostrarToast("Disciplina eliminada", "exito");
      await cargarTodo();
    } catch (error) {
      mostrarToast(error.message, "error");
    }
  }

  if (accion === "quitar-profesor") {
    try {
      await api.del(`/api/disciplinas/${disciplina}/profesores/${profesor}`);
      mostrarToast("Profesor desasignado", "exito");
      await cargarTodo();
    } catch (error) {
      mostrarToast(error.message, "error");
    }
  }
});

document.getElementById("lista-disciplinas").addEventListener("submit", async (evento) => {
  const form = evento.target.closest("form[data-accion='asignar-profesor']");
  if (!form) return;
  evento.preventDefault();
  const disciplinaId = form.dataset.disciplina;
  const profesorId = new FormData(form).get("profesor_id");
  if (!profesorId) return;

  try {
    await api.post(`/api/disciplinas/${disciplinaId}/profesores`, { profesor_id: Number(profesorId) });
    mostrarToast("Profesor asignado", "exito");
    await cargarTodo();
  } catch (error) {
    mostrarToast(error.message, "error");
  }
});

// ---------- Alta rapida de profesor ----------

document.getElementById("form-nuevo-profesor").addEventListener("submit", async (evento) => {
  evento.preventDefault();
  const form = evento.target;
  const datos = new FormData(form);
  const nombre = datos.get("nombre").trim();
  if (!nombre) return;

  try {
    await api.post("/api/profesores", { nombre, especialidad: datos.get("especialidad").trim() || null });
    mostrarToast("Profesor agregado", "exito");
    form.reset();
    await cargarTodo();
  } catch (error) {
    mostrarToast(error.message, "error");
  }
});

cargarTodo();
