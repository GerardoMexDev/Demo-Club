"""
Archivo: dashboard.py
Proyecto: Club Solis (demo)
Descripcion: Datos agregados para las tarjetas de resumen del dashboard Admin.
Creado: 2026-09-09
Ultima edicion: 2026-09-09
"""
from datetime import date
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import models, schemas
from ..database import get_db
from ..services.clase_service import clase_a_schema, contar_confirmados

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


@router.get("/resumen", response_model=schemas.ResumenDashboardOut)
def resumen(db: Session = Depends(get_db)):
    hoy = date.today().weekday()  # 0=lunes .. 6=domingo, igual que Clase.dia_semana

    clases_hoy = (
        db.query(models.Clase)
        .filter(models.Clase.dia_semana == hoy, models.Clase.estado == "activa")
        .all()
    )
    cupos_disponibles_hoy = sum(
        max(c.cupo_maximo - contar_confirmados(db, c.id), 0) for c in clases_hoy
    )

    profesores_activos = (
        db.query(models.Profesor.id)
        .join(models.Clase, models.Clase.profesor_id == models.Profesor.id)
        .filter(models.Clase.estado == "activa")
        .distinct()
        .count()
    )

    return schemas.ResumenDashboardOut(
        clases_hoy=len(clases_hoy),
        profesores_activos=profesores_activos,
        cupos_disponibles_hoy=cupos_disponibles_hoy,
        total_disciplinas=db.query(models.Disciplina).count(),
    )


@router.get("/clases-hoy", response_model=list[schemas.ClaseOut])
def clases_hoy(db: Session = Depends(get_db)):
    hoy = date.today().weekday()
    clases = (
        db.query(models.Clase)
        .filter(models.Clase.dia_semana == hoy)
        .order_by(models.Clase.hora_inicio)
        .all()
    )
    return [clase_a_schema(db, c) for c in clases]
