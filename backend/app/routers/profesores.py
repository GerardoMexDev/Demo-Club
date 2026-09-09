"""
Archivo: profesores.py
Proyecto: PULSO Club (demo)
Descripcion: Alta y listado de profesores (pool desde el que se asignan a disciplinas).
Creado: 2026-09-09
Ultima edicion: 2026-09-09
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/api/profesores", tags=["profesores"])


@router.get("", response_model=list[schemas.ProfesorOut])
def listar_profesores(db: Session = Depends(get_db)):
    return db.query(models.Profesor).order_by(models.Profesor.nombre).all()


@router.post("", response_model=schemas.ProfesorOut, status_code=201)
def crear_profesor(payload: schemas.ProfesorIn, db: Session = Depends(get_db)):
    profesor = models.Profesor(nombre=payload.nombre, especialidad=payload.especialidad)
    db.add(profesor)
    db.commit()
    db.refresh(profesor)
    return profesor
