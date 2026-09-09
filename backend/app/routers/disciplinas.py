"""
Archivo: disciplinas.py
Proyecto: PULSO Club (demo)
Descripcion: CRUD de disciplinas (deportes) y asignacion de 1-2 profesores por disciplina.
Creado: 2026-09-09
Ultima edicion: 2026-09-09
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/api/disciplinas", tags=["disciplinas"])

# Paleta de chips por disciplina (doc 11, seccion "paleta de disciplinas").
# Se asigna rotando segun cuantas disciplinas ya existen, para que cada
# deporte nuevo tenga un color distinto sin que el admin tenga que elegirlo.
PALETA_CHIPS = ["#4ADE80", "#FF9E6B", "#60A5FA", "#F87171", "#C084FC", "#FACC15"]


def _color_disponible(db: Session) -> str:
    total = db.query(models.Disciplina).count()
    return PALETA_CHIPS[total % len(PALETA_CHIPS)]


@router.get("", response_model=list[schemas.DisciplinaOut])
def listar_disciplinas(db: Session = Depends(get_db)):
    return db.query(models.Disciplina).order_by(models.Disciplina.nombre).all()


@router.post("", response_model=schemas.DisciplinaOut, status_code=201)
def crear_disciplina(payload: schemas.DisciplinaIn, db: Session = Depends(get_db)):
    existente = db.query(models.Disciplina).filter(models.Disciplina.nombre == payload.nombre).first()
    if existente:
        raise HTTPException(status_code=400, detail="Ya existe una disciplina con ese nombre")

    disciplina = models.Disciplina(
        nombre=payload.nombre,
        descripcion=payload.descripcion,
        color_tag=payload.color_tag or _color_disponible(db),
    )
    db.add(disciplina)
    db.commit()
    db.refresh(disciplina)
    return disciplina


@router.put("/{disciplina_id}", response_model=schemas.DisciplinaOut)
def actualizar_disciplina(disciplina_id: int, payload: schemas.DisciplinaIn, db: Session = Depends(get_db)):
    disciplina = db.get(models.Disciplina, disciplina_id)
    if not disciplina:
        raise HTTPException(status_code=404, detail="Disciplina no encontrada")

    disciplina.nombre = payload.nombre
    disciplina.descripcion = payload.descripcion
    if payload.color_tag:
        disciplina.color_tag = payload.color_tag
    db.commit()
    db.refresh(disciplina)
    return disciplina


@router.delete("/{disciplina_id}", status_code=204)
def eliminar_disciplina(disciplina_id: int, db: Session = Depends(get_db)):
    disciplina = db.get(models.Disciplina, disciplina_id)
    if not disciplina:
        raise HTTPException(status_code=404, detail="Disciplina no encontrada")
    if disciplina.clases:
        raise HTTPException(
            status_code=400,
            detail="No se puede eliminar: la disciplina tiene clases cargadas. Cancela o elimina esas clases primero.",
        )
    db.delete(disciplina)
    db.commit()


@router.post("/{disciplina_id}/profesores", response_model=schemas.DisciplinaOut, status_code=201)
def asignar_profesor(disciplina_id: int, payload: schemas.AsignarProfesorIn, db: Session = Depends(get_db)):
    disciplina = db.get(models.Disciplina, disciplina_id)
    if not disciplina:
        raise HTTPException(status_code=404, detail="Disciplina no encontrada")

    profesor = db.get(models.Profesor, payload.profesor_id)
    if not profesor:
        raise HTTPException(status_code=404, detail="Profesor no encontrado")

    if profesor in disciplina.profesores:
        raise HTTPException(status_code=400, detail="Ese profesor ya esta asignado a esta disciplina")

    if len(disciplina.profesores) >= 2:
        raise HTTPException(status_code=400, detail="Una disciplina admite maximo 2 profesores asignados")

    disciplina.profesores.append(profesor)
    db.commit()
    db.refresh(disciplina)
    return disciplina


@router.delete("/{disciplina_id}/profesores/{profesor_id}", response_model=schemas.DisciplinaOut)
def quitar_profesor(disciplina_id: int, profesor_id: int, db: Session = Depends(get_db)):
    disciplina = db.get(models.Disciplina, disciplina_id)
    if not disciplina:
        raise HTTPException(status_code=404, detail="Disciplina no encontrada")

    profesor = db.get(models.Profesor, profesor_id)
    if not profesor or profesor not in disciplina.profesores:
        raise HTTPException(status_code=404, detail="Ese profesor no esta asignado a esta disciplina")

    disciplina.profesores.remove(profesor)
    db.commit()
    db.refresh(disciplina)
    return disciplina
