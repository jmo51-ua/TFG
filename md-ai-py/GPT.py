import numpy as np
import statistics
from scipy.stats import linregress
import matplotlib.pyplot as plt

puntajes = [20, 25, 30, 18, 27, 33, 29, 24, 35, 31]

# 1. Promedio de Puntajes
def calcular_promedio(puntajes):
    return sum(puntajes) / len(puntajes)

promedio = calcular_promedio(puntajes)
print(f"Promedio de Puntajes: {promedio}")

# 2. Tendencia de Puntajes
def calcular_tendencia(puntajes):
    x = np.arange(len(puntajes))
    slope, intercept, r_value, p_value, std_err = linregress(x, puntajes)
    return slope, intercept, r_value, p_value, std_err

tendencia_slope, _, _, _, _ = calcular_tendencia(puntajes)
print(f"Tendencia (pendiente): {tendencia_slope}")

# 3. Variabilidad de Puntajes
def calcular_desviacion_estandar(puntajes):
    return statistics.stdev(puntajes)

desviacion_estandar = calcular_desviacion_estandar(puntajes)
print(f"Desviación Estándar: {desviacion_estandar}")

# 4. Comparación entre Sesiones
def comparar_sesiones(puntajes):
    cambios = []
    for i in range(1, len(puntajes)):
        cambio = (puntajes[i] - puntajes[i - 1]) / puntajes[i - 1] * 100
        cambios.append(cambio)
    return cambios

cambios_sesiones = comparar_sesiones(puntajes)
print(f"Cambios entre Sesiones: {cambios_sesiones}")

# Evaluar automáticamente en campos DAFO
def evaluar_DAFO(promedio, tendencia_slope, desviacion_estandar, cambios_sesiones):
    resultados_DAFO = {
        "Fortalezas": [],
        "Debilidades": [],
        "Oportunidades": [],
        "Amenazas": []
    }
    
    # !1. Evaluar Fortalezas y Debilidades
    if promedio > 25:
        resultados_DAFO["Fortalezas"].append("Promedio alto")
    else:
        resultados_DAFO["Debilidades"].append("Promedio bajo")
    
    #! Evaluar Oportunidades y Amenazas basadas en la Tendencia
    if tendencia_slope > 0:
        resultados_DAFO["Oportunidades"].append("Tendencia ascendente")
    else:
        resultados_DAFO["Amenazas"].append("Tendencia descendente")
    
    #! Evaluar Consistencia en el Desempeño
    if desviacion_estandar < 5:
        resultados_DAFO["Fortalezas"].append("Baja variabilidad")
    else:
        resultados_DAFO["Debilidades"].append("Alta variabilidad")
    
    # Evaluar Cambios entre Sesiones
    cambios_positivos = [cambio for cambio in cambios_sesiones if cambio > 0]
    cambios_negativos = [cambio for cambio in cambios_sesiones if cambio < 0]
    
    if len(cambios_positivos) > len(cambios_negativos):
        resultados_DAFO["Oportunidades"].append("Tiende a mejorar entre sesiones")
    else:
        resultados_DAFO["Amenazas"].append("Deterioro en sesiones recientes")
    
    return resultados_DAFO

resultados_DAFO = evaluar_DAFO(promedio, tendencia_slope, desviacion_estandar, cambios_sesiones)
print("\n\nResultados DAFO:")
for campo, resultados in resultados_DAFO.items():
    print(f"{campo}: {', '.join(resultados)}")
