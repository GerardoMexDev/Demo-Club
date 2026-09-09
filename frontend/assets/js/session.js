/**
 * Archivo: session.js
 * Proyecto: PULSO Club (demo)
 * Descripcion: Maneja la "sesion" de demo (sin password real) guardada en
 *              localStorage, y protege paginas segun el rol requerido.
 * Creado: 2026-09-09
 */

const CLAVE_SESION = "pulso_usuario";

/** @returns {{id:number, nombre:string, rol:string, telefono?:string, email?:string}|null} */
export function obtenerUsuario() {
  const crudo = localStorage.getItem(CLAVE_SESION);
  if (!crudo) return null;
  try {
    return JSON.parse(crudo);
  } catch {
    return null;
  }
}

export function guardarUsuario(usuario) {
  localStorage.setItem(CLAVE_SESION, JSON.stringify(usuario));
}

export function cerrarSesion() {
  localStorage.removeItem(CLAVE_SESION);
  window.location.href = "/index.html";
}

/**
 * Si no hay usuario logueado o el rol no coincide, redirige al login.
 * Llamar al principio de cada pagina protegida.
 * @param {"admin"|"alumno"} rolRequerido
 */
export function exigirRol(rolRequerido) {
  const usuario = obtenerUsuario();
  if (!usuario || usuario.rol !== rolRequerido) {
    window.location.href = "/index.html";
    return null;
  }
  return usuario;
}
