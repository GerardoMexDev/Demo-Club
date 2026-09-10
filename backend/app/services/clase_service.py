"""
Archivo: clase_service.py
Proyecto: Club Solis (demo)
Descripcion: Logica compartida sobre clases (cupos, serializacion) usada por
             varios routers (clases, inscripciones, dashboard).
Creado: 2026-09-09
Ultima edicion: 2026-09-09
"""
from sqlalchemy.orm import Session
from .. import models, schemas


def contar_confirmados(db: Session, clase_id: int) -> int:
    """Cuenta inscripciones en estado 'confirmada' para una clase (no cuenta lista de espera)."""
    return (
        db.query(models.Inscripcion)
        .filter(models.Inscripcion.clase_id == clase_id, models.Inscripcion.estado == "confirmada")
        .count()
    )


def clase_a_schema(db: Session, clase: models.Clase) -> schemas.ClaseOut:
    """Arma el ClaseOut agregando los campos calculados de cupo (no son columnas de DB)."""
    confirmados = contar_confirmados(db, clase.id)
    data = schemas.ClaseOut.model_validate(clase)
    data.inscriptos_confirmados = confirmados
    data.cupos_disponibles = max(clase.cupo_maximo - confirmados, 0)
    return data
