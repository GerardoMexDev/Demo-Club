"""
Archivo: database.py
Proyecto: PULSO Club (demo)
Descripcion: Configuracion de la conexion a SQLite y la sesion de SQLAlchemy.
Creado: 2026-09-09
Ultima edicion: 2026-09-09
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# check_same_thread=False es necesario porque SQLite por defecto solo permite
# el hilo que abrio la conexion; FastAPI puede atender requests en otros hilos.
SQLALCHEMY_DATABASE_URL = "sqlite:///./pulso.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    """Dependencia de FastAPI: entrega una sesion de DB y la cierra al terminar el request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
