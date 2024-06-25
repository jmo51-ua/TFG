import statistics

puntajes = [20, 25, 30, 18, 27, 33, 29, 24, 35, 31]
rango = 50 # importar mis rango

desviacion_estandar = statistics.stdev(puntajes)
porcentaje_desviacion = (desviacion_estandar / rango) * 100

representatividadCV = {
    (0, 14): "Fortaleza: Mucha constancia",
    (15, 22): "Oportunidad: Puede ser más constante",
    (23, 29): "Amenaza: Constancia irregular",
    (30, 100): "Debilidad: Sus datos no son nada constantes",
}

def determinar_tramo(porcentaje, representatividad):
    for rango, descripcion in representatividad.items():
        if rango[0] <= porcentaje <= rango[1]:
            return descripcion
    return "Tramo no encontrado"


tramo_desviacion = determinar_tramo(porcentaje_desviacion, representatividadCV)

# Imprimir los resultados
print(f"Desviación Estándar: {desviacion_estandar}")
print(f"Porcentaje de Desviación respecto al rango total: {porcentaje_desviacion:.2f}%")
print(f"Tramo asociado: {tramo_desviacion}")

