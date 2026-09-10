"""
Archivo: seed.py
Proyecto: Club Solis (demo)
Descripcion: Datos semilla para que la demo nunca arranque vacia: 4 disciplinas,
             profesores ficticios, agenda de tarde completa (+ un par de clases
             de manana para mostrar el soporte de bloques) y alumnos con
             inscripciones ya cargadas.
Creado: 2026-09-09
Ultima edicion: 2026-09-09

Uso standalone: python -m app.seed  (crea las tablas si no existen y siembra
solo si la tabla de disciplinas esta vacia; no duplica datos si se corre de nuevo).
"""
from datetime import time
from sqlalchemy.orm import Session
from . import models
from .database import Base, engine, SessionLocal


def _hora(h: int, m: int = 0) -> time:
    return time(hour=h, minute=m)


def ya_sembrado(db: Session) -> bool:
    return db.query(models.Disciplina).count() > 0


def sembrar(db: Session) -> None:
    if ya_sembrado(db):
        return

    # --- Usuarios ---
    admin = models.Usuario(nombre="Admin Demo", email="admin@pulsoclub.demo", rol="admin")
    valentina = models.Usuario(nombre="Valentina Ríos", telefono="59899123456", rol="alumno")
    bruno = models.Usuario(nombre="Bruno Acosta", telefono="59898234567", rol="alumno")
    camila = models.Usuario(nombre="Camila Duarte", telefono="59897345678", rol="alumno")
    tomas = models.Usuario(nombre="Tomás Pereyra", telefono="59896456789", rol="alumno")
    agustina = models.Usuario(nombre="Agustina López", telefono="59895567890", rol="alumno")
    db.add_all([admin, valentina, bruno, camila, tomas, agustina])

    # --- Profesores ---
    martin = models.Profesor(nombre="Martín Fernández", especialidad="Fútbol formativo")
    lucia = models.Profesor(nombre="Lucía Sosa", especialidad="Fútbol femenino")
    diego = models.Profesor(nombre="Diego Ramírez", especialidad="Básquetbol")
    carla = models.Profesor(nombre="Carla Núñez", especialidad="Básquetbol juvenil")
    rodrigo = models.Profesor(nombre="Rodrigo Silva", especialidad="Vóleibol")
    valentina_p = models.Profesor(nombre="Valentina Acosta", especialidad="Vóleibol")
    kenji = models.Profesor(nombre="Kenji Yamamoto", especialidad="Karate - cinturones altos")
    sofia = models.Profesor(nombre="Sofía Bentancur", especialidad="Karate - iniciación")
    db.add_all([martin, lucia, diego, carla, rodrigo, valentina_p, kenji, sofia])

    # --- Disciplinas (color_tag segun paleta del sistema de diseno) ---
    futbol = models.Disciplina(nombre="Fútbol", descripcion="Fútbol 5 y 7, formativo y competitivo", color_tag="#4ADE80")
    basquet = models.Disciplina(nombre="Básquetbol", descripcion="Minibasquet y mayores", color_tag="#FF9E6B")
    voley = models.Disciplina(nombre="Vóleibol", descripcion="Vóley recreativo y federado", color_tag="#60A5FA")
    karate = models.Disciplina(nombre="Karate", descripcion="Karate tradicional, todas las edades", color_tag="#F87171")
    db.add_all([futbol, basquet, voley, karate])

    futbol.profesores = [martin, lucia]
    basquet.profesores = [diego, carla]
    voley.profesores = [rodrigo, valentina_p]
    karate.profesores = [kenji, sofia]

    db.flush()  # asigna IDs sin cerrar la transaccion, para poder crear las clases

    # --- Clases: agenda de tarde completa + algunas de manana ---
    LUNES, MARTES, MIERCOLES, JUEVES, VIERNES, SABADO = 0, 1, 2, 3, 4, 5

    c_futbol_lun = models.Clase(disciplina=futbol, profesor=martin, dia_semana=LUNES,
                                 hora_inicio=_hora(17), hora_fin=_hora(18), cupo_maximo=20)
    c_basquet_lun = models.Clase(disciplina=basquet, profesor=diego, dia_semana=LUNES,
                                  hora_inicio=_hora(18, 30), hora_fin=_hora(19, 30), cupo_maximo=16)
    c_voley_mar = models.Clase(disciplina=voley, profesor=rodrigo, dia_semana=MARTES,
                                hora_inicio=_hora(17), hora_fin=_hora(18), cupo_maximo=14)
    c_karate_mar = models.Clase(disciplina=karate, profesor=kenji, dia_semana=MARTES,
                                 hora_inicio=_hora(19), hora_fin=_hora(20), cupo_maximo=12,
                                 estado="cancelada", motivo_cancelacion="Profesor con licencia médica")
    c_futbol_mie = models.Clase(disciplina=futbol, profesor=lucia, dia_semana=MIERCOLES,
                                 hora_inicio=_hora(17), hora_fin=_hora(18), cupo_maximo=20)
    c_basquet_mie = models.Clase(disciplina=basquet, profesor=carla, dia_semana=MIERCOLES,
                                  hora_inicio=_hora(18, 30), hora_fin=_hora(19, 30), cupo_maximo=16)
    c_karate_mie_am = models.Clase(disciplina=karate, profesor=sofia, dia_semana=MIERCOLES,
                                    hora_inicio=_hora(9), hora_fin=_hora(10), cupo_maximo=10)
    c_voley_jue = models.Clase(disciplina=voley, profesor=valentina_p, dia_semana=JUEVES,
                                hora_inicio=_hora(17), hora_fin=_hora(18), cupo_maximo=14)
    c_karate_jue = models.Clase(disciplina=karate, profesor=sofia, dia_semana=JUEVES,
                                 hora_inicio=_hora(19), hora_fin=_hora(20), cupo_maximo=12)
    c_futbol_vie = models.Clase(disciplina=futbol, profesor=martin, dia_semana=VIERNES,
                                 hora_inicio=_hora(17), hora_fin=_hora(18, 30), cupo_maximo=22)
    c_basquet_vie = models.Clase(disciplina=basquet, profesor=diego, dia_semana=VIERNES,
                                  hora_inicio=_hora(18, 30), hora_fin=_hora(19, 30), cupo_maximo=16)
    c_karate_lun_am = models.Clase(disciplina=karate, profesor=kenji, dia_semana=LUNES,
                                    hora_inicio=_hora(9), hora_fin=_hora(10), cupo_maximo=10)
    c_futbol_sab_am = models.Clase(disciplina=futbol, profesor=lucia, dia_semana=SABADO,
                                    hora_inicio=_hora(10), hora_fin=_hora(11, 30), cupo_maximo=24)

    db.add_all([
        c_futbol_lun, c_basquet_lun, c_voley_mar, c_karate_mar, c_futbol_mie,
        c_basquet_mie, c_karate_mie_am, c_voley_jue, c_karate_jue, c_futbol_vie,
        c_basquet_vie, c_karate_lun_am, c_futbol_sab_am,
    ])
    db.flush()

    # --- Inscripciones: dejan "Mi horario" y el dashboard con datos reales ---
    inscripciones = [
        models.Inscripcion(usuario=valentina, clase=c_futbol_lun, estado="confirmada"),
        models.Inscripcion(usuario=valentina, clase=c_voley_mar, estado="confirmada"),
        models.Inscripcion(usuario=valentina, clase=c_karate_mar, estado="confirmada"),  # clase ya cancelada: demo de aviso WhatsApp
        models.Inscripcion(usuario=bruno, clase=c_futbol_lun, estado="confirmada"),
        models.Inscripcion(usuario=bruno, clase=c_basquet_lun, estado="confirmada"),
        models.Inscripcion(usuario=camila, clase=c_karate_mar, estado="confirmada"),  # tambien afectada por la cancelacion
        models.Inscripcion(usuario=tomas, clase=c_voley_jue, estado="confirmada"),
        models.Inscripcion(usuario=tomas, clase=c_karate_mie_am, estado="confirmada"),
        models.Inscripcion(usuario=agustina, clase=c_basquet_mie, estado="confirmada"),
        models.Inscripcion(usuario=agustina, clase=c_futbol_vie, estado="confirmada"),
    ]
    db.add_all(inscripciones)

    db.commit()


def main():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if ya_sembrado(db):
            print("La base ya tiene datos, no se vuelve a sembrar.")
            return
        sembrar(db)
        print("Datos semilla cargados: 4 disciplinas, 8 profesores, 13 clases, 6 usuarios.")
    finally:
        db.close()


if __name__ == "__main__":
    main()
