"""
Archivo: schemas.py
Proyecto: PULSO Club (demo)
Descripcion: Esquemas Pydantic para validar entrada/salida de la API.
Creado: 2026-09-09
Ultima edicion: 2026-09-09
"""
from datetime import time
from typing import Optional, Literal
from pydantic import BaseModel, ConfigDict


# ---------- Usuario ----------

class UsuarioOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    nombre: str
    email: Optional[str] = None
    telefono: Optional[str] = None
    rol: str


class DemoLoginIn(BaseModel):
    rol: Literal["admin", "alumno"]


# ---------- Profesor ----------

class ProfesorIn(BaseModel):
    nombre: str
    especialidad: Optional[str] = None


class ProfesorOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    nombre: str
    especialidad: Optional[str] = None


# ---------- Disciplina ----------

class DisciplinaIn(BaseModel):
    nombre: str
    descripcion: Optional[str] = None
    color_tag: Optional[str] = None


class AsignarProfesorIn(BaseModel):
    profesor_id: int


class DisciplinaOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    nombre: str
    descripcion: Optional[str] = None
    color_tag: str
    profesores: list[ProfesorOut] = []


# ---------- Clase ----------

class ClaseIn(BaseModel):
    disciplina_id: int
    profesor_id: int
    dia_semana: int  # 0=lunes .. 6=domingo
    hora_inicio: time
    hora_fin: time
    cupo_maximo: int = 15


class CancelarClaseIn(BaseModel):
    motivo: Optional[str] = None


class ClaseOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    disciplina_id: int
    profesor_id: int
    dia_semana: int
    hora_inicio: time
    hora_fin: time
    cupo_maximo: int
    estado: str
    motivo_cancelacion: Optional[str] = None
    bloque: str
    disciplina: DisciplinaOut
    profesor: ProfesorOut
    inscriptos_confirmados: int = 0
    cupos_disponibles: int = 0


# ---------- Inscripcion ----------

class InscripcionIn(BaseModel):
    usuario_id: int
    clase_id: int


class InscripcionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    usuario_id: int
    clase_id: int
    estado: str
    clase: ClaseOut


class InscriptoContactoOut(BaseModel):
    """Fila liviana para el panel de aviso por WhatsApp: solo lo necesario para armar el mensaje."""
    inscripcion_id: int
    usuario_id: int
    nombre: str
    telefono: Optional[str] = None
    estado: str


# ---------- Dashboard ----------

class ResumenDashboardOut(BaseModel):
    clases_hoy: int
    profesores_activos: int
    cupos_disponibles_hoy: int
    total_disciplinas: int
