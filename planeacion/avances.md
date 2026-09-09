# Avances del Proyecto — PULSO Club (Demo gestión de club deportivo)

> Prefijo de proyecto: `pulso_`

## Protocolo de sesión (ritual de inicio y cierre)

**Al INICIAR una sesión:** Gerardo dice "continuamos con PULSO" (o similar). Claude lee este archivo, confirma en qué quedamos y no empieza a codear hasta confirmar el siguiente paso.

**Al FINALIZAR una sesión:** Claude actualiza este archivo (hecho, pendientes, decisiones nuevas) y corre el cierre de Git (commit local; push cuando exista un remoto configurado — ver sección 8).

**Última actualización:** 2026-09-09
**Estado general:** en desarrollo — MVP funcional completo, probado de punta a punta

---

## 1. Descripción breve del proyecto
Prototipo funcional (demo) de gestión de un club deportivo/gimnasio multi-disciplina: portal Admin (catálogos, horarios, avisos por WhatsApp, dashboard) y portal Alumno (mobile-first, explorador de clases, mi horario, solicitar ingreso). Ver alcance completo en `12-alcance-funcionalidades.md`.

## 2. Stack técnico
- Backend: Python + FastAPI + SQLAlchemy
- Frontend: HTML/CSS/JS moderno sin build step (ES6 modules, fetch API), separado del backend
- Base de datos: SQLite (`backend/pulso.db`, se genera sola al arrancar)
- Hosting: local (demo), sin definir despliegue a producción todavía
- Integraciones externas: ninguna con credenciales — solo generación de enlaces `wa.me` (sin API oficial de WhatsApp)

## 3. Estructura de archivos clave
| Archivo/Carpeta | Función |
|---|---|
| `planeacion/12-alcance-funcionalidades.md` | Alcance y funcionalidades acordadas |
| `planeacion/11-sistema-diseno.md` | Sistema de diseño "PULSO" (colores, tipografía, componentes) |
| `README.md` | Instrucciones para levantar la demo en local |
| `backend/app/models.py` | Modelos SQLAlchemy (Usuario, Disciplina, Profesor, Clase, Inscripcion) |
| `backend/app/routers/` | Endpoints REST: auth, disciplinas, profesores, clases, inscripciones, dashboard |
| `backend/app/services/clase_service.py` | Cálculo de cupos disponibles/confirmados (compartido por varios routers) |
| `backend/app/seed.py` | Datos de demo: 4 disciplinas, 8 profesores, 13 clases, 6 usuarios |
| `frontend/index.html` | Login demo (Admin/Alumno) |
| `frontend/admin/` | Dashboard, Disciplinas (CRUD + asignación profesores), Horarios (abrir/editar/cancelar + panel WhatsApp) |
| `frontend/student/` | Explorar (mobile-first), Mi horario, Perfil |
| `frontend/assets/` | CSS (tokens, base, componentes) y JS compartidos (api, toast, session, modal, navs) |

## 4. Hecho (por fecha, más reciente primero)

### 2026-09-09 — Sesión 1 (planeación + build completo del MVP)
- Se cargó la metodología Mazdesign (regla 0: no codear sin contexto/acuerdo).
- Junta de organización: se definió stack (FastAPI + SQLite + JS vanilla sin build), y que el push a GitHub queda pendiente hasta tener un repo remoto (por ahora se trabaja con Git local).
- Se generó el sistema de diseño completo "PULSO" (identidad propia, no genérica): paleta Ember + Teal + Graphite oscuro, tipografía Space Grotesk + Inter, componentes base, tokens en CSS.
- Se documentó el alcance completo (`12-alcance-funcionalidades.md`).
- Gerardo confirmó el alcance y el sistema de diseño — luz verde para codear.
- **Backend construido y probado**: modelos, schemas, 6 routers (auth, disciplinas, profesores, clases, inscripciones, dashboard), servicio de cálculo de cupos, seed data, y montaje del frontend estático dentro de la misma app FastAPI (un solo puerto).
- **Frontend construido**: login demo, portal Admin (dashboard, disciplinas con asignación de hasta 2 profesores, horarios con abrir/editar/cancelar/reactivar clase y panel "Avisar por WhatsApp" con link `wa.me` por alumno), portal Alumno mobile-first (explorar con filtro por disciplina, mi horario con aviso de clase cancelada, perfil).
- **QA hecho**: se corrió la app real con `uvicorn`, se probaron los endpoints con `curl`, y se verificó todo el flujo en navegador (login → admin → alumno) con capturas de pantalla, incluyendo viewport mobile (390×844) sin scroll horizontal ni errores de consola.
- **Casos límite verificados** (con `TestClient`, script descartado después de usarlo): no se puede inscribir a una clase cancelada, no se puede duplicar una inscripción, la inscripción que excede el cupo queda "pendiente" (lista de espera), y no se puede asignar un 3er profesor a una disciplina.
- Se creó `README.md` con instrucciones exactas para levantar el servidor en local.
- Primer commit local hecho (`git init`, rama `main`); push a GitHub sigue pendiente de que Gerardo provea un repo remoto.

## 5. Pendiente / próximos pasos
- [ ] Cuando Gerardo tenga un repo remoto en GitHub: `git remote add origin` + primer push — prioridad: alta
- [ ] Revisión visual/funcional por Gerardo antes de considerar el MVP "terminado" para presentar — prioridad: alta
- [ ] Definir si hace falta un modal de confirmación con la identidad de marca en vez de `confirm()` nativo del navegador (eliminar disciplina, cancelar inscripción) — prioridad: baja (cosmético)
- [ ] Evaluar si se agrega un rol "profesor" con panel propio (fuera del alcance original) — prioridad: baja
- [ ] Revisar accesibilidad (doc 16) y Lighthouse (doc 06/18) antes de una entrega formal a cliente — prioridad: media, no crítico para una demo interna

## 6. Bugs conocidos / cosas a vigilar
- Los Google Fonts (Space Grotesk, Inter) requieren conexión a internet real; en un entorno sin acceso a `fonts.gstatic.com` el navegador cae al fallback `system-ui` (no rompe nada, solo cambia la tipografía). Verificar que la máquina donde se presente la demo tenga internet, o considerar self-host de las fuentes si se va a mostrar offline.
- El botón "Editar" de una disciplina/clase y "Eliminar"/"Cancelar mi inscripción" usan `confirm()` nativo del navegador en vez de un modal con la identidad visual — funcional pero no 100% "premium". Ver pendiente arriba.

## 7. Decisiones de arquitectura ya tomadas (no reabrir sin motivo)
- Backend FastAPI en vez de Flask — motivo: validación automática (Pydantic), docs interactivas gratis, tipado moderno, buen fit para una demo técnica.
- Frontend vanilla JS (ES6 modules + fetch) en vez de React — motivo: KISS, cero build step, más simple de levantar para una demo.
- SQLite en vez de MySQL — motivo: es una demo/prototipo, no hay necesidad de un servidor de base de datos aparte.
- El backend sirve el frontend estático (`StaticFiles` montado en `/`) — motivo: un solo servidor y un solo puerto simplifica las instrucciones de arranque de la demo.
- Las clases son horarios recurrentes semanales (`dia_semana` + hora), no fechas puntuales de calendario — motivo: KISS, así funcionan la mayoría de los gimnasios reales y evita modelar un calendario completo para una demo.
- Cancelar una clase cambia su estado, no la borra — motivo: se necesita conservar el historial y poder avisar a los inscriptos.
- El aviso de WhatsApp es un link `wa.me` por alumno generado en el cliente (con su teléfono y un mensaje pre-armado), no un envío automático — motivo: no hay integración con WhatsApp Business API en el alcance de la demo.
- Push a GitHub queda pendiente hasta que Gerardo provea un repo remoto — motivo: decisión explícita en la junta de organización (sesión 1).

## 8. Credenciales / accesos
- Sin credenciales reales. Login demo sin passwords (botones "Ingresar como Admin/Alumno"), guardado en `localStorage` del navegador — no es un mecanismo de autenticación real, solo para la demo.
- Repo GitHub: no configurado todavía (trabajo en Git local únicamente, rama `main`).

## 9. Notas de contexto de negocio
- Es un proyecto propio (demo/portfolio), no hay un cliente real detrás todavía — el "negocio" es ficticio (club PULSO) pensado para ilustrar el caso de uso.
- Bloque horario (mañana/tarde) se calcula automáticamente según la hora de inicio de la clase (antes de las 13:00 = mañana), no se carga a mano.
- El login "Ingresar como Alumno" siempre entra como el mismo alumno de seed ("Valentina Ríos", usuario id 2), que ya tiene clases confirmadas y una clase cancelada cargada — así la demo de "mi horario" y "aviso por WhatsApp" se puede mostrar sin pasos previos.

## 10. Lecciones técnicas aprendidas
- En Windows/Git Bash, pasar JSON con acentos directo en un `curl -d '...'` puede llegar mal codificado a la API por cómo la shell interpreta las comillas — no es un bug del backend. Para probar con caracteres especiales desde bash, escribir el body a un archivo (`printf` con los bytes UTF-8) y usar `--data-binary @archivo`.
- Al capturar un screenshot de una página con animación de entrada (fade-in), esperar a que la animación termine (`waitForTimeout` acorde a `--dur-enfasis`) antes de la captura — si no, la imagen sale opacada/apagada y parece un bug de contraste cuando en realidad es solo el frame inicial de la transición.
- `FastAPI TestClient` requiere el paquete `httpx` instalado aparte (no viene con `fastapi` ni `uvicorn`); no se agregó a `requirements.txt` porque fue solo para verificar casos límite puntuales, no es una dependencia de la app en producción.
