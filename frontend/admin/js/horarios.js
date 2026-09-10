/**
 * Archivo: horarios.js
 * Proyecto: Club Solis (demo)
 * Descripcion: Abrir grupos, modificar horarios, cancelar/reactivar clases,
 *              y el panel de "Avisar por WhatsApp" para clases canceladas.
 * Creado: 2026-09-09
 */
import { api } from "/assets/js/api.js";
import { exigirRol } from "/assets/js/session.js";
import { mostrarToast } from "/assets/js/toast.js";
import { montarNavAdmin } from "/assets/js/nav-admin.js";
import { abrirModal, cerrarModal, configurarCierreModal } from "/assets/js/modal.js";
import { DIAS_SEMANA, formatearHora, NOMBRES_BLOQUE, armarMensajeCancelacion, armarLinkWhatsApp } from "/assets/js/constantes.js";

exigirRol("admin");
montarNavAdmin(window.location.pathname);

const modalClase = document.getElementById("modal-clase");
const modalCancelar = document.getElementById("modal-cancelar-clase");
const modalWhatsapp = document.getElementById("modal-whatsapp");
[modalClase, modalCancelar, modalWhatsapp].forEach(configurarCierreModal);

const formClase = document.getElementById("form-clase");
const selectDisciplinaClase = document.getElementById("disciplina-clase");
const selectProfesorClase = document.getElementById("profesor-clase");
const avisoSinProfesores = document.getElementById("aviso-sin-profesores");

let disciplinas = [];
let filtro = { bloque: "todos", disciplina_id: "" };

// ---------- Carga inicial ----------

async function cargarDisciplinas() {
  disciplinas = await api.get("/api/disciplinas");

  const opciones = disciplinas.map((d) => `<option value="${d.id}">${d.nombre}</option>`).join("");
  selectDisciplinaClase.innerHTML = opciones;
  document.getElementById("filtro-disciplina").innerHTML = `<option value="">Todas las disciplinas</option>${opciones}`;

  actualizarProfesoresDisponibles();
}

function actualizarProfesoresDisponibles() {
  const disciplina = disciplinas.find((d) => d.id === Number(selectDisciplinaClase.value));
  const profesores = disciplina ? disciplina.profesores : [];

  selectProfesorClase.innerHTML = profesores.map((p) => `<option value="${p.id}">${p.nombre}</option>`).join("");
  const sinProfesores = profesores.length === 0;
  selectProfesorClase.disabled = sinProfesores;
  avisoSinProfesores.textContent = sinProfesores ? "Esta disciplina todavía no tiene profesores asignados." : "";
}

selectDisciplinaClase.addEventListener("change", actualizarProfesoresDisponibles);

async function cargarClases() {
  const params = new URLSearchParams();
  if (filtro.bloque !== "todos") params.set("bloque", filtro.bloque);
  if (filtro.disciplina_id) params.set("disciplina_id", filtro.disciplina_id);

  const contenedor = document.getElementById("agenda-semanal");
  try {
    const clases = await api.get(`/api/clases?${params.toString()}`);
    renderAgenda(clases);
  } catch (error) {
    mostrarToast(error.message, "error");
    contenedor.innerHTML = "";
  }
}

function renderAgenda(clases) {
  const contenedor = document.getElementById("agenda-semanal");
  if (clases.length === 0) {
    contenedor.innerHTML = `<div class="card estado-vacio">No hay clases que coincidan con el filtro.</div>`;
    return;
  }

  const porDia = {};
  clases.forEach((c) => {
    (porDia[c.dia_semana] ||= []).push(c);
  });

  contenedor.innerHTML = Object.keys(porDia)
    .sort((a, b) => a - b)
    .map((dia) => `
      <div class="dia-grupo">
        <h3>${DIAS_SEMANA[dia]}</h3>
        <div class="card flex-col gap-md">
          ${porDia[dia].map(filaClaseHtml).join("")}
        </div>
      </div>
    `)
    .join("");
}

function filaClaseHtml(c) {
  const acciones = c.estado === "activa"
    ? `
      <button class="btn btn-secundario btn-sm" data-accion="editar" data-id="${c.id}">Editar</button>
      <button class="btn btn-peligro btn-sm" data-accion="cancelar" data-id="${c.id}">Cancelar</button>
    `
    : `
      <button class="btn btn-secundario btn-sm" data-accion="reactivar" data-id="${c.id}">Reactivar</button>
      <button class="btn btn-whatsapp btn-sm" data-accion="whatsapp" data-id="${c.id}">Avisar por WhatsApp</button>
    `;

  return `
    <div class="fila-clase">
      <div class="flex items-center gap-md flex-wrap">
        <span class="chip" style="background:${c.disciplina.color_tag}22; color:${c.disciplina.color_tag}">
          <span class="chip-punto" style="background:${c.disciplina.color_tag}"></span>${c.disciplina.nombre}
        </span>
        <div>
          <strong>${formatearHora(c.hora_inicio)} - ${formatearHora(c.hora_fin)}</strong>
          <div class="texto-small">${c.profesor.nombre} · ${NOMBRES_BLOQUE[c.bloque]} · ${c.inscriptos_confirmados}/${c.cupo_maximo} cupos</div>
        </div>
        <span class="badge badge-${c.estado}">${c.estado === "activa" ? "Activa" : "Cancelada"}</span>
      </div>
      <div class="flex gap-sm">${acciones}</div>
    </div>
  `;
}

// ---------- Filtros ----------

document.getElementById("filtro-bloque").addEventListener("click", (evento) => {
  const boton = evento.target.closest("button[data-bloque]");
  if (!boton) return;
  filtro.bloque = boton.dataset.bloque;
  document.querySelectorAll("#filtro-bloque button").forEach((b) => b.classList.toggle("activo", b === boton));
  cargarClases();
});

document.getElementById("filtro-disciplina").addEventListener("change", (evento) => {
  filtro.disciplina_id = evento.target.value;
  cargarClases();
});

// ---------- Modal abrir/editar clase ----------

document.getElementById("btn-abrir-grupo").addEventListener("click", () => {
  formClase.reset();
  formClase.elements.id.value = "";
  document.getElementById("titulo-modal-clase").textContent = "Abrir grupo";
  actualizarProfesoresDisponibles();
  abrirModal(modalClase);
});

document.getElementById("btn-cancelar-modal-clase").addEventListener("click", () => cerrarModal(modalClase));

formClase.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  const datos = new FormData(formClase);
  const id = datos.get("id");
  const payload = {
    disciplina_id: Number(datos.get("disciplina_id")),
    profesor_id: Number(datos.get("profesor_id")),
    dia_semana: Number(datos.get("dia_semana")),
    hora_inicio: datos.get("hora_inicio"),
    hora_fin: datos.get("hora_fin"),
    cupo_maximo: Number(datos.get("cupo_maximo")),
  };

  try {
    if (id) {
      await api.put(`/api/clases/${id}`, payload);
      mostrarToast("Horario actualizado", "exito");
    } else {
      await api.post("/api/clases", payload);
      mostrarToast("Grupo abierto correctamente", "exito");
    }
    cerrarModal(modalClase);
    await cargarClases();
  } catch (error) {
    mostrarToast(error.message, "error");
  }
});

// ---------- Modal cancelar clase ----------

const formCancelar = document.getElementById("form-cancelar-clase");

document.getElementById("btn-volver-modal-cancelar").addEventListener("click", () => cerrarModal(modalCancelar));

formCancelar.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  const id = formCancelar.elements.id.value;
  const motivo = formCancelar.elements.motivo.value.trim() || null;

  try {
    await api.post(`/api/clases/${id}/cancelar`, { motivo });
    mostrarToast("Clase cancelada", "exito");
    cerrarModal(modalCancelar);
    await cargarClases();
  } catch (error) {
    mostrarToast(error.message, "error");
  }
});

// ---------- Panel avisar por WhatsApp ----------

async function abrirPanelWhatsapp(claseId) {
  try {
    const [clase, inscriptos] = await Promise.all([
      api.get(`/api/clases/${claseId}`),
      api.get(`/api/clases/${claseId}/inscriptos`),
    ]);

    document.getElementById("descripcion-whatsapp").textContent =
      `${clase.disciplina.nombre} · ${DIAS_SEMANA[clase.dia_semana]} ${formatearHora(clase.hora_inicio)}hs — enviale el aviso a cada alumno inscripto:`;

    const lista = document.getElementById("lista-inscriptos-whatsapp");
    if (inscriptos.length === 0) {
      lista.innerHTML = `<p class="texto-small">Nadie estaba inscripto en esta clase.</p>`;
    } else {
      lista.innerHTML = inscriptos.map((insc) => {
        const mensaje = armarMensajeCancelacion(insc.nombre, clase);
        const link = armarLinkWhatsApp(insc.telefono, mensaje);
        return `
          <div class="inscripto-fila">
            <span>${insc.nombre}</span>
            <a class="btn btn-whatsapp btn-sm" href="${link}" target="_blank" rel="noopener">Avisar por WhatsApp</a>
          </div>
        `;
      }).join("");
    }

    abrirModal(modalWhatsapp);
  } catch (error) {
    mostrarToast(error.message, "error");
  }
}

document.getElementById("btn-cerrar-modal-whatsapp").addEventListener("click", () => cerrarModal(modalWhatsapp));

// ---------- Acciones de cada fila (delegacion) ----------

document.getElementById("agenda-semanal").addEventListener("click", async (evento) => {
  const boton = evento.target.closest("button[data-accion]");
  if (!boton) return;
  const { accion, id } = boton.dataset;

  if (accion === "editar") {
    const clase = await api.get(`/api/clases/${id}`);
    formClase.reset();
    formClase.elements.id.value = clase.id;
    selectDisciplinaClase.value = clase.disciplina_id;
    actualizarProfesoresDisponibles();
    selectProfesorClase.value = clase.profesor_id;
    formClase.elements.dia_semana.value = clase.dia_semana;
    formClase.elements.hora_inicio.value = formatearHora(clase.hora_inicio);
    formClase.elements.hora_fin.value = formatearHora(clase.hora_fin);
    formClase.elements.cupo_maximo.value = clase.cupo_maximo;
    document.getElementById("titulo-modal-clase").textContent = "Modificar horario";
    abrirModal(modalClase);
  }

  if (accion === "cancelar") {
    formCancelar.reset();
    formCancelar.elements.id.value = id;
    abrirModal(modalCancelar);
  }

  if (accion === "reactivar") {
    try {
      await api.post(`/api/clases/${id}/reactivar`, {});
      mostrarToast("Clase reactivada", "exito");
      await cargarClases();
    } catch (error) {
      mostrarToast(error.message, "error");
    }
  }

  if (accion === "whatsapp") {
    abrirPanelWhatsapp(id);
  }
});

// ---------- Inicio ----------

(async function iniciar() {
  await cargarDisciplinas();
  await cargarClases();
})();
