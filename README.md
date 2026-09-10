# Club Solis — Demo de gestión de club deportivo

Prototipo funcional de gestión de un club deportivo/gimnasio multi-disciplina.
Portal **Admin** (catálogos, horarios, avisos por WhatsApp, dashboard) y portal
**Alumno** (mobile-first: explorar clases, mi horario, solicitar ingreso).

Ver el detalle de alcance y el sistema de diseño en [`planeacion/`](planeacion/).

## Stack

- **Backend:** Python + FastAPI + SQLAlchemy + SQLite
- **Frontend:** HTML/CSS/JS moderno sin build step (ES6 modules, fetch API)
- El backend sirve el frontend estático — un solo servidor, un solo puerto.

## Estructura de carpetas

```
Demo club/
├── backend/
│   ├── app/
│   │   ├── main.py          # arranque de la API + montaje del frontend
│   │   ├── database.py      # conexión SQLite / sesión SQLAlchemy
│   │   ├── models.py        # Usuario, Disciplina, Profesor, Clase, Inscripcion
│   │   ├── schemas.py       # esquemas Pydantic
│   │   ├── seed.py          # datos de demo (4 disciplinas, profesores, agenda)
│   │   ├── routers/         # endpoints REST por recurso
│   │   └── services/        # lógica compartida (cálculo de cupos)
│   └── requirements.txt
├── frontend/
│   ├── index.html           # login demo (Admin / Alumno)
│   ├── admin/                # dashboard, disciplinas, horarios
│   ├── student/               # explorar, mi horario, perfil (mobile-first)
│   └── assets/               # css y js compartidos (tokens de diseño, toasts, etc.)
└── planeacion/                # avances, alcance y sistema de diseño del proyecto
```

## Cómo levantar la demo en local

Requisitos: Python 3.10+.

```bash
cd backend
python -m venv .venv

# Windows
.venv\Scripts\activate
# macOS/Linux
source .venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Abrir **http://127.0.0.1:8000** en el navegador. La base de datos SQLite
(`backend/pulso.db`) se crea y se puebla automáticamente la primera vez que
arranca el servidor — la demo nunca arranca vacía.

Para resetear los datos de demo: cerrar el servidor, borrar `backend/pulso.db`
y volver a arrancar (`uvicorn ...`); también se puede sembrar manualmente con
`python -m app.seed` desde `backend/` con el entorno virtual activado.

## Login de demo

No hay contraseñas. Desde la pantalla de inicio:
- **Ingresar como Admin** → entra como "Admin Demo".
- **Ingresar como Alumno** → entra como "Valentina Ríos", que ya tiene clases
  cargadas (incluida una cancelada, para probar el aviso por WhatsApp).

## Documentación de la API

Con el servidor corriendo, FastAPI expone documentación interactiva en
**http://127.0.0.1:8000/docs**.
