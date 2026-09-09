/**
 * Archivo: constantes.js
 * Proyecto: PULSO Club (demo)
 * Descripcion: Constantes y helpers de formato compartidos entre paginas
 *              (dias de la semana, horas, mensaje de WhatsApp).
 * Creado: 2026-09-09
 */

export const DIAS_SEMANA = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

export const NOMBRES_BLOQUE = { manana: "Mañana", tarde: "Tarde" };

/** "17:00:00" -> "17:00" */
export function formatearHora(horaISO) {
  return horaISO.slice(0, 5);
}

/** Arma el texto del mensaje de WhatsApp para avisar de una clase cancelada. */
export function armarMensajeCancelacion(nombreAlumno, clase) {
  const dia = DIAS_SEMANA[clase.dia_semana];
  const hora = formatearHora(clase.hora_inicio);
  const motivo = clase.motivo_cancelacion ? ` Motivo: ${clase.motivo_cancelacion}.` : "";
  return (
    `Hola ${nombreAlumno}! Te escribimos de PULSO Club para avisarte que la clase de ` +
    `${clase.disciplina.nombre} del ${dia} ${hora}hs fue cancelada.${motivo} ` +
    `Disculpá las molestias, cualquier duda escribinos por acá.`
  );
}

/** Genera el link wa.me con el mensaje ya codificado. Sin telefono, abre el selector de contacto. */
export function armarLinkWhatsApp(telefono, mensaje) {
  const numero = telefono ? telefono.replace(/\D/g, "") : "";
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
}
