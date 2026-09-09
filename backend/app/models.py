"""
Archivo: models.py
Proyecto: PULSO Club (demo)
Descripcion: Modelos SQLAlchemy - Usuario, Disciplina, Profesor, Clase, Inscripcion.
Creado: 2026-09-09
Ultima edicion: 2026-09-09
"""
from sqlalchemy import (
    Column, Integer, String, Boolean, ForeignKey, Table, Time, Text
)
from sqlalchemy.orm import relationship
from .database import Base

# Tabla puente disciplina <-> profesor (un profesor puede dictar varias
# disciplinas, y cada disciplina admite hasta 2 profesores asignados;
# el limite de 2 se valida en el router, no en la base de datos).
disciplina_profesor = Table(
    "pulso_disciplina_profesor",
    Base.metadata,
    Column("disciplina_id", Integer, ForeignKey("pulso_disciplinas.id"), primary_key=True),
    Column("profesor_id", Integer, ForeignKey("pulso_profesores.id"), primary_key=True),
)


class Usuario(Base):
    """Alumno o administrador. La demo no usa password real (login por rol)."""
    __tablename__ = "pulso_usuarios"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(120), nullable=False)
    email = Column(String(160), nullable=True)
    telefono = Column(String(20), nullable=True)  # formato wa.me: solo digitos, con codigo de pais
    rol = Column(String(20), nullable=False, default="alumno")  # "admin" | "alumno"

    inscripciones = relationship("Inscripcion", back_populates="usuario", cascade="all, delete-orphan")


class Disciplina(Base):
    __tablename__ = "pulso_disciplinas"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(80), nullable=False, unique=True)
    descripcion = Column(String(240), nullable=True)
    color_tag = Column(String(20), nullable=False, default="#4ADE80")  # chip visual, ver sistema de diseno

    profesores = relationship("Profesor", secondary=disciplina_profesor, back_populates="disciplinas")
    clases = relationship("Clase", back_populates="disciplina", cascade="all, delete-orphan")


class Profesor(Base):
    __tablename__ = "pulso_profesores"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(120), nullable=False)
    especialidad = Column(String(120), nullable=True)

    disciplinas = relationship("Disciplina", secondary=disciplina_profesor, back_populates="profesores")
    clases = relationship("Clase", back_populates="profesor")


class Clase(Base):
    """
    Horario recurrente semanal (no una fecha puntual): se repite cada semana
    en el mismo dia/hora hasta que se cancele. Simplifica el modelo para
    una demo sin perder realismo (asi funcionan la mayoria de los gimnasios).
    """
    __tablename__ = "pulso_clases"

    id = Column(Integer, primary_key=True, index=True)
    disciplina_id = Column(Integer, ForeignKey("pulso_disciplinas.id"), nullable=False)
    profesor_id = Column(Integer, ForeignKey("pulso_profesores.id"), nullable=False)
    dia_semana = Column(Integer, nullable=False)  # 0=lunes ... 6=domingo (igual que date.weekday())
    hora_inicio = Column(Time, nullable=False)
    hora_fin = Column(Time, nullable=False)
    cupo_maximo = Column(Integer, nullable=False, default=15)
    estado = Column(String(20), nullable=False, default="activa")  # "activa" | "cancelada"
    motivo_cancelacion = Column(Text, nullable=True)

    disciplina = relationship("Disciplina", back_populates="clases")
    profesor = relationship("Profesor", back_populates="clases")
    inscripciones = relationship("Inscripcion", back_populates="clase", cascade="all, delete-orphan")

    @property
    def bloque(self) -> str:
        """Bloque horario derivado de la hora de inicio: antes de las 13:00 es manana."""
        return "manana" if self.hora_inicio.hour < 13 else "tarde"


class Inscripcion(Base):
    __tablename__ = "pulso_inscripciones"

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("pulso_usuarios.id"), nullable=False)
    clase_id = Column(Integer, ForeignKey("pulso_clases.id"), nullable=False)
    estado = Column(String(20), nullable=False, default="confirmada")  # "confirmada" | "pendiente"

    usuario = relationship("Usuario", back_populates="inscripciones")
    clase = relationship("Clase", back_populates="inscripciones")
