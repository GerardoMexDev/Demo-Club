"""
Archivo: inscripciones.py
Proyecto: PULSO Club (demo)
Descripcion: 'Mi horario' del alumno y solicitud de ingreso a una clase.
             Si no hay cupo, la inscripcion queda en estado 'pendiente' (lista de espera).
Creado: 2026-09-09
Ultima edicion: 2026-09-09
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import models, schemas
from ..database import get_db
from ..services.clase_service import clase_a_schema, contar_confirmados

router = APIRouter(prefix="/api/inscripciones", tags=["inscripciones"])


def _inscripcion_a_schema(db: Session, insc: models.Inscripcion) -> schemas.InscripcionOut:
    data = schemas.InscripcionOut.model_validate(insc)
    data.clase = clase_a_schema(db, insc.clase)
    return data


@router.get("", response_model=list[schemas.InscripcionOut])
def listar_inscripciones(usuario_id: int, db: Session = Depends(get_db)):
    inscripciones = (
        db.query(models.Inscripcion)
        .filter(models.Inscripcion.usuario_id == usuario_id)
        .join(models.Clase)
        .order_by(models.Clase.dia_semana, models.Clase.hora_inicio)
        .all()
    )
    return [_inscripcion_a_schema(db, i) for i in inscripciones]


@router.post("", response_model=schemas.InscripcionOut, status_code=201)
def solicitar_ingreso(payload: schemas.InscripcionIn, db: Session = Depends(get_db)):
    usuario = db.get(models.Usuario, payload.usuario_id)
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    clase = db.get(models.Clase, payload.clase_id)
    if not clase:
        raise HTTPException(status_code=404, detail="Clase no encontrada")
    if clase.estado != "activa":
        raise HTTPException(status_code=400, detail="Esta clase esta cancelada, no se puede solicitar ingreso")

    ya_inscripto = (
        db.query(models.Inscripcion)
        .filter(
            models.Inscripcion.usuario_id == payload.usuario_id,
            models.Inscripcion.clase_id == payload.clase_id,
        )
        .first()
    )
    if ya_inscripto:
        raise HTTPException(status_code=400, detail="Ya estas inscripto (o en lista de espera) en esta clase")

    confirmados = contar_confirmados(db, clase.id)
    estado = "confirmada" if confirmados < clase.cupo_maximo else "pendiente"

    inscripcion = models.Inscripcion(usuario_id=payload.usuario_id, clase_id=payload.clase_id, estado=estado)
    db.add(inscripcion)
    db.commit()
    db.refresh(inscripcion)
    return _inscripcion_a_schema(db, inscripcion)


@router.delete("/{inscripcion_id}", status_code=204)
def cancelar_inscripcion(inscripcion_id: int, db: Session = Depends(get_db)):
    inscripcion = db.get(models.Inscripcion, inscripcion_id)
    if not inscripcion:
        raise HTTPException(status_code=404, detail="Inscripcion no encontrada")
    db.delete(inscripcion)
    db.commit()
