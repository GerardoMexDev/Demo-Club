/**
 * Archivo: api.js
 * Proyecto: Club Solis (demo)
 * Descripcion: Wrapper de fetch para hablar con la API FastAPI. Centraliza
 *              manejo de errores para que cada pantalla no repita try/catch.
 * Creado: 2026-09-09
 */

/**
 * Hace un request a la API y devuelve el JSON parseado.
 * @param {string} path - ej. "/api/disciplinas"
 * @param {object} [opciones] - { method, body }
 * @returns {Promise<any>} cuerpo de la respuesta ya parseado
 * @throws {Error} con el mensaje "detail" que devuelve FastAPI si el status no es 2xx
 */
export async function apiRequest(path, opciones = {}) {
  const { method = "GET", body } = opciones;

  const respuesta = await fetch(path, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (respuesta.status === 204) return null;

  const contentType = respuesta.headers.get("content-type") || "";
  const datos = contentType.includes("application/json") ? await respuesta.json() : null;

  if (!respuesta.ok) {
    const mensaje = (datos && datos.detail) || `Error inesperado (${respuesta.status})`;
    throw new Error(mensaje);
  }

  return datos;
}

export const api = {
  get: (path) => apiRequest(path),
  post: (path, body) => apiRequest(path, { method: "POST", body }),
  put: (path, body) => apiRequest(path, { method: "PUT", body }),
  del: (path) => apiRequest(path, { method: "DELETE" }),
};
