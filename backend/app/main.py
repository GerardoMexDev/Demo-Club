"""
Archivo: main.py
Proyecto: Club Solis (demo)
Descripcion: Punto de entrada de la API FastAPI. Crea las tablas, siembra datos
             de demo si la base esta vacia, registra los routers y sirve el
             frontend estatico (una sola app en un solo puerto).
Creado: 2026-09-09
Ultima edicion: 2026-09-09
"""
from pathlib import Path
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from .database import Base, engine, SessionLocal
from .seed import sembrar
from .routers import auth, disciplinas, profesores, clases, inscripciones, dashboard

app = FastAPI(title="Club Solis API", description="API de demo para gestion de club deportivo")

Base.metadata.create_all(bind=engine)

# Siembra automatica: la demo nunca debe arrancar vacia (doc 12, seccion 5).
_db = SessionLocal()
try:
    sembrar(_db)
finally:
    _db.close()

app.include_router(auth.router)
app.include_router(disciplinas.router)
app.include_router(profesores.router)
app.include_router(clases.router)
app.include_router(inscripciones.router)
app.include_router(dashboard.router)

# El frontend vive en ../frontend (hermano de backend/). Se monta al final
# para que las rutas /api/* definidas arriba tengan prioridad.
FRONTEND_DIR = Path(__file__).resolve().parent.parent.parent / "frontend"
app.mount("/", StaticFiles(directory=FRONTEND_DIR, html=True), name="frontend")
