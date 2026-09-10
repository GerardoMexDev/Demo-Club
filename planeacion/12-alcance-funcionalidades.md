# Alcance y Funcionalidades — Club Solis (Demo)

> Prefijo de proyecto: `pulso_` (nombres de tabla, funciones custom).

## 1. Contexto del negocio
- Cliente/negocio: prototipo/demo propio (no hay cliente real todavía) para presentar como caso de estudio de un club deportivo/gimnasio multi-disciplina.
- Problema que resuelve: hoy estos clubes coordinan horarios, profesores y avisos de cancelación por WhatsApp/papel de forma manual y desordenada.
- Quién lo va a usar: en la demo, dos roles — Admin (gestión) y Alumno (consulta/inscripción).

## 2. Objetivo del proyecto
Presentar un prototipo funcional de alta calidad (nivel "premium") que demuestre: gestión de catálogos deportivos, horarios con bloques mañana/tarde, aviso de cancelaciones por WhatsApp, y un portal de alumno 100% mobile-first.

## 3. Lista de funcionalidades — MVP

| # | Funcionalidad | Descripción breve | Prioridad |
|---|---|---|---|
| 1 | Login demo por rol | Botones "Ingresar como Admin" / "Ingresar como Alumno", sin password real | Alta |
| 2 | CRUD Disciplinas | Alta/edición/baja de disciplinas (Fútbol, Básquetbol, Vóleibol, Karate, etc.) | Alta |
| 3 | Asignación de profesores | 1-2 profesores por disciplina | Alta |
| 4 | Gestión de horarios/clases | Abrir grupo, modificar horario, cancelar clase; bloques matutino/vespertino | Alta |
| 5 | Aviso por WhatsApp | Botón en clases canceladas que genera link wa.me con mensaje predefinido dinámico | Alta |
| 6 | Dashboard Admin | Tarjetas resumen: clases de hoy, profesores activos, cupos disponibles | Alta |
| 7 | Explorador de clases (Alumno) | Lista/calendario de disciplinas, profesores y horarios | Alta |
| 8 | Mi horario (Alumno) | Panel con las clases en las que está inscripto | Alta |
| 9 | Solicitar ingreso a clase | Alumno pide cupo en una clase nueva (queda inscripto o en espera si no hay cupo) | Alta |
| 10 | Notificaciones Toast | Feedback visual de cada acción (guardado, inscripto, cancelado, etc.) | Alta |
| 11 | Seed data | Script que puebla 4 disciplinas, profesores ficticios y agenda de tarde completa | Alta |

## 4. Funcionalidades para después (fuera del MVP)
- Autenticación real con contraseña/JWT persistente.
- Pagos/cuotas de socios.
- Notificaciones push reales (hoy solo se genera el link de WhatsApp, no se envía automático).
- Multi-sede / multi-club.

## 5. Explícitamente fuera de alcance
- Envío automático de WhatsApp (no hay integración con WhatsApp Business API; es un link `wa.me` que abre el chat con mensaje precargado).
- Roles adicionales (profesor con panel propio) — no pedido en el prompt original.
- Pasarela de pago.

## 6. Reglas de negocio a confirmar / asumidas para la demo
- Un profesor puede dictar más de una clase; una clase tiene 1-2 profesores asignados.
- Cada clase tiene un cupo máximo; una inscripción nueva que supera el cupo queda marcada como pendiente/lista de espera (para que el admin decida).
- Cancelar una clase no la borra: cambia su estado a "cancelada" para poder avisar a los inscriptos y mantener el historial.
- Bloques horarios: mañana (antes de 13:00) y tarde (13:00 en adelante) — se calcula automáticamente según la hora de inicio, no se pide manualmente.

## 7. Datos / decisión técnica
- ¿El cliente va a editar contenido él mismo? Sí (el admin gestiona todo desde el panel, sin tocar código).
- ¿Hay cálculos o datos sensibles? No (es una demo, sin datos reales de personas).
- ¿Se integra con algún servicio externo? Solo generación de enlaces `wa.me` (sin API, sin credenciales).
- Stack decidido:
  - Backend: **Python + FastAPI** + SQLite (vía SQLAlchemy).
  - Frontend: **HTML/CSS/JS moderno sin build step** (ES6 modules, fetch API) — separado estrictamente del backend (frontend estático consumiendo una API REST).
  - Justificación (doc 05): no hay contenido editorial vía WordPress, hay lógica de negocio propia (cupos, cancelaciones, bloques horarios) que amerita API propia; volumen de datos chico → SQLite alcanza de sobra para una demo.

## 8. Plazos y expectativas
- Es una demo para presentación; se prioriza tener un flujo completo funcionando cuanto antes, con buena terminación visual, sobre features adicionales.

## 9. Cómo se valida el éxito
- El admin puede cancelar una clase y generar el link de WhatsApp en menos de 10 segundos.
- El alumno, desde el celular, ve su horario y puede solicitar una clase nueva sin instrucciones previas.
- La demo arranca con datos ya cargados (seed) — nunca se ve vacía.
