/**
 * Archivo: perfil.js
 * Proyecto: Club Solis (demo)
 * Descripcion: Pantalla de perfil del alumno (datos + cerrar sesion).
 * Creado: 2026-09-09
 */
import { exigirRol, cerrarSesion } from "/assets/js/session.js";
import { montarNavInferior } from "/assets/js/nav-inferior.js";

const usuario = exigirRol("alumno");
montarNavInferior(window.location.pathname);

document.getElementById("nombre-perfil").textContent = usuario.nombre;
document.getElementById("telefono-perfil").textContent = usuario.telefono || "—";
document.getElementById("avatar-perfil").textContent = usuario.nombre.charAt(0).toUpperCase();

document.getElementById("btn-cerrar-sesion").addEventListener("click", cerrarSesion);
