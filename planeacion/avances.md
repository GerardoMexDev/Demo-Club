# Avances del Proyecto — PULSO Club (Demo gestión de club deportivo)

> Prefijo de proyecto: `pulso_`

## Protocolo de sesión (ritual de inicio y cierre)

**Al INICIAR una sesión:** Gerardo dice "continuamos con PULSO" (o similar). Claude lee este archivo, confirma en qué quedamos y no empieza a codear hasta confirmar el siguiente paso.

**Al FINALIZAR una sesión:** Claude actualiza este archivo (hecho, pendientes, decisiones nuevas) y corre el cierre de Git (commit local; push cuando exista un remoto configurado — ver sección 8).

**Última actualización:** 2026-09-09
**Estado general:** en planeación (junta de organización cerrada, pendiente confirmación para empezar a codear)

---

## 1. Descripción breve del proyecto
Prototipo funcional (demo) de gestión de un club deportivo/gimnasio multi-disciplina: portal Admin (catálogos, horarios, avisos por WhatsApp, dashboard) y portal Alumno (mobile-first, explorador de clases, mi horario, solicitar ingreso). Ver alcance completo en `12-alcance-funcionalidades.md`.

## 2. Stack técnico
- Backend: Python + FastAPI + SQLAlchemy
- Frontend: HTML/CSS/JS moderno sin build step (ES6 modules, fetch API), separado del backend
- Base de datos: SQLite (archivo local, suficiente para demo)
- Hosting: local (demo), sin definir despliegue a producción todavía
- Integraciones externas: ninguna con credenciales — solo generación de enlaces `wa.me` (sin API oficial de WhatsApp)

## 3. Estructura de archivos clave
| Archivo/Carpeta | Función |
|---|---|
| `planeacion/12-alcance-funcionalidades.md` | Alcance y funcionalidades acordadas |
| `planeacion/11-sistema-diseno.md` | Sistema de diseño "PULSO" (colores, tipografía, componentes) |
| `backend/app/` | API FastAPI (routers, modelos, seed) — a construir |
| `frontend/admin/` | Portal Admin — a construir |
| `frontend/student/` | Portal Alumno (mobile-first) — a construir |

## 4. Hecho (por fecha, más reciente primero)
### 2026-09-09 — Sesión 1 (planeación)
- Se cargó la metodología Mazdesign (regla 0: no codear sin contexto/acuerdo).
- Junta de organización: se definió stack (FastAPI + SQLite + JS vanilla sin build), y que el push a GitHub queda pendiente hasta tener un repo remoto (por ahora se trabaja con Git local).
- Se generó el sistema de diseño completo "PULSO" (identidad propia, no genérica): paleta Ember + Teal + Graphite oscuro, tipografía Space Grotesk + Inter, componentes base, tokens en CSS.
- Se documentó el alcance completo (`12-alcance-funcionalidades.md`) a partir del prompt detallado del usuario.
- Se creó la estructura de carpetas del proyecto (`backend/`, `frontend/`, `planeacion/`).
- Pendiente: confirmación explícita de Gerardo para empezar a escribir código (modelos, seed, API, UI).

## 5. Pendiente / próximos pasos
- [ ] Confirmar sistema de diseño y alcance con Gerardo antes de codear — prioridad: alta
- [ ] Modelos (Usuario, Disciplina, Profesor, Clase, Inscripción) + esquema SQLAlchemy — prioridad: alta
- [ ] Endpoints API (auth demo, CRUD disciplinas/profesores, horarios, inscripciones) — prioridad: alta
- [ ] Script de seed (4 disciplinas, profesores ficticios, agenda de tarde completa) — prioridad: alta
- [ ] Frontend Admin (dashboard, catálogos, horarios, botón WhatsApp) — prioridad: alta
- [ ] Frontend Alumno (mobile-first: explorador, mi horario, solicitar ingreso) — prioridad: alta
- [ ] Sistema de toasts — prioridad: media
- [ ] Cuando Gerardo tenga un repo remoto en GitHub: `git remote add origin` + primer push — prioridad: media

## 6. Bugs conocidos / cosas a vigilar
_(ninguno todavía — proyecto en etapa de planeación)_

## 7. Decisiones de arquitectura ya tomadas (no reabrir sin motivo)
- Backend FastAPI en vez de Flask — motivo: validación automática (Pydantic), docs interactivas gratis, tipado moderno, buen fit para una demo técnica.
- Frontend vanilla JS (ES6 modules + fetch) en vez de React — motivo: KISS, cero build step, más simple de levantar para una demo.
- SQLite en vez de MySQL — motivo: es una demo/prototipo, no hay necesidad de un servidor de base de datos aparte.
- Cancelar una clase cambia su estado, no la borra — motivo: se necesita conservar el historial y poder avisar a los inscriptos.
- El aviso de WhatsApp es un link `wa.me` generado en el cliente, no un envío automático — motivo: no hay integración con WhatsApp Business API en el alcance de la demo.
- Push a GitHub queda pendiente hasta que Gerardo provea un repo remoto — motivo: decisión explícita en la junta de organización (sesión 1).

## 8. Credenciales / accesos
- Sin credenciales todavía. Login demo sin passwords reales (botones "Ingresar como Admin/Alumno").
- Repo GitHub: no configurado todavía (trabajo en Git local únicamente).

## 9. Notas de contexto de negocio
- Es un proyecto propio (demo/portfolio), no hay un cliente real detrás todavía — el "negocio" es ficticio (club PULSO) pensado para ilustrar el caso de uso.
- Bloque horario (mañana/tarde) se calcula automáticamente según la hora de inicio de la clase (antes de las 13:00 = mañana), no se carga a mano.

## 10. Lecciones técnicas aprendidas
_(se irán sumando a medida que se construya el backend/frontend)_
