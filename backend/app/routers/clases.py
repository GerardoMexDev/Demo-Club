"""
Archivo: clases.py
Proyecto: PULSO Club (demo)
Descripcion: Gestion de horarios/clases - abrir grupo, modificar, cancelar,
             y consultar los inscriptos de una clase (para el aviso por WhatsApp).
Creado: 2026-09-09
Ultima edicion: 2026-09-09
"""
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import models, schemas
from ..database import get_db
from ..services.clase_service import clase_a_schema

router = APIRouter(prefix="/api/clases", tags=["clases"])


def _validar_profesor_de_disciplina(db: Session, disciplina_id: int, profesor_id: int) -> None:
    disciplina = db.get(models.Disciplina, disciplina_id)
    if not disciplina:
        raise HTTPException(status_code=404, detail="Disciplina no encontrada")
    profesor = db.get(models.Profesor, profesor_id)
    if not profesor:
        raise HTTPException(status_code=404, detail="Profesor no encontrado")
    if profesor not in disciplina.profesores:
        raise HTTPException(
            status_code=400,
            detail=f"{profesor.nombre} no esta asignado a la disciplina {disciplina.nombre}",
        )


@router.get("", response_model=list[schemas.ClaseOut])
def listar_clases(
    dia_semana: Optional[int] = None,
    disciplina_id: Optional[int] = None,
    estado: Optional[str] = None,
    bloque: Optional[str] = None,
    db: Session = Depends(get_db),
):
    query = db.query(models.Clase)
    if dia_semana is not None:
        query = query.filter(models.Clase.dia_semana == dia_semana)
    if disciplina_id is not None:
        query = query.filter(models.Clase.disciplina_id == disciplina_id)
    if estado is not None:
        query = query.filter(models.Clase.estado == estado)

    clases = query.order_by(models.Clase.dia_semana, models.Clase.hora_inicio).all()
    if bloque is not None:
        clases = [c for c in clases if c.bloque == bloque]

    return [clase_a_schema(db, c) for c in clases]


@router.get("/{clase_id}", response_model=schemas.ClaseOut)
def obtener_clase(clase_id: int, db: Session = Depends(get_db)):
    clase = db.get(models.Clase, clase_id)
    if not clase:
        raise HTTPException(status_code=404, detail="Clase no encontrada")
    return clase_a_schema(db, clase)


@router.post("", response_model=schemas.ClaseOut, status_code=201)
def abrir_clase(payload: schemas.ClaseIn, db: Session = Depends(get_db)):
    if not (0 <= payload.dia_semana <= 6):
        raise HTTPException(status_code=400, detail="dia_semana debe ser 0 (lunes) a 6 (domingo)")
    if payload.hora_fin <= payload.hora_inicio:
        raise HTTPException(status_code=400, detail="La hora de fin debe ser posterior a la hora de inicio")

    _validar_profesor_de_disciplina(db, payload.disciplina_id, payload.profesor_id)

    clase = models.Clase(
        disciplina_id=payload.disciplina_id,
        profesor_id=payload.profesor_id,
        dia_semana=payload.dia_semana,
        hora_inicio=payload.hora_inicio,
        hora_fin=payload.hora_fin,
        cupo_maximo=payload.cupo_maximo,
    )
    db.add(clase)
    db.commit()
    db.refresh(clase)
    return clase_a_schema(db, clase)


@router.put("/{clase_id}", response_model=schemas.ClaseOut)
def modificar_clase(clase_id: int, payload: schemas.ClaseIn, db: Session = Depends(get_db)):
    clase = db.get(models.Clase, clase_id)
    if not clase:
        raise HTTPException(status_code=404, detail="Clase no encontrada")
    if payload.hora_fin <= payload.hora_inicio:
        raise HTTPException(status_code=400, detail="La hora de fin debe ser posterior a la hora de inicio")

    _validar_profesor_de_disciplina(db, payload.disciplina_id, payload.profesor_id)

    clase.disciplina_id = payload.disciplina_id
    clase.profesor_id = payload.profesor_id
    clase.dia_semana = payload.dia_semana
    clase.hora_inicio = payload.hora_inicio
    clase.hora_fin = payload.hora_fin
    clase.cupo_maximo = payload.cupo_maximo
    db.commit()
    db.refresh(clase)
    return clase_a_schema(db, clase)


@router.post("/{clase_id}/cancelar", response_model=schemas.ClaseOut)
def cancelar_clase(clase_id: int, payload: schemas.CancelarClaseIn, db: Session = Depends(get_db)):
    clase = db.get(models.Clase, clase_id)
    if not clase:
        raise HTTPException(status_code=404, detail="Clase no encontrada")

    clase.estado = "cancelada"
    clase.motivo_cancelacion = payload.motivo
    db.commit()
    db.refresh(clase)
    return clase_a_schema(db, clase)


@router.post("/{clase_id}/reactivar", response_model=schemas.ClaseOut)
def reactivar_clase(clase_id: int, db: Session = Depends(get_db)):
    clase = db.get(models.Clase, clase_id)
    if not clase:
        raise HTTPException(status_code=404, detail="Clase no encontrada")

    clase.estado = "activa"
    clase.motivo_cancelacion = None
    db.commit()
    db.refresh(clase)
    return clase_a_schema(db, clase)


@router.get("/{clase_id}/inscriptos", response_model=list[schemas.InscriptoContactoOut])
def listar_inscriptos(clase_id: int, db: Session = Depends(get_db)):
    """Lista liviana de alumnos inscriptos, usada por el panel 'Avisar por WhatsApp'."""
    clase = db.get(models.Clase, clase_id)
    if not clase:
        raise HTTPException(status_code=404, detail="Clase no encontrada")

    return [
        schemas.InscriptoContactoOut(
            inscripcion_id=insc.id,
            usuario_id=insc.usuario.id,
            nombre=insc.usuario.nombre,
            telefono=insc.usuario.telefono,
            estado=insc.estado,
        )
        for insc in clase.inscripciones
    ]
