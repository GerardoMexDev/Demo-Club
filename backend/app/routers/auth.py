"""
Archivo: auth.py
Proyecto: Club Solis (demo)
Descripcion: Login de demo por rol (sin password real). Devuelve un usuario
             fijo por rol para poder presentar el prototipo sin fricciones.
Creado: 2026-09-09
Ultima edicion: 2026-09-09
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/demo-login", response_model=schemas.UsuarioOut)
def demo_login(payload: schemas.DemoLoginIn, db: Session = Depends(get_db)):
    """
    Login de demo: no valida password. Devuelve el primer usuario existente
    con el rol pedido (el seed siempre crea al menos un admin y un alumno).
    """
    usuario = (
        db.query(models.Usuario)
        .filter(models.Usuario.rol == payload.rol)
        .order_by(models.Usuario.id)
        .first()
    )
    if not usuario:
        raise HTTPException(status_code=404, detail=f"No hay ningun usuario con rol '{payload.rol}' cargado")
    return usuario
