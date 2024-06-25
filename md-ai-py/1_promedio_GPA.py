puntajes = [20, 25, 30, 18, 27, 33, 29, 24, 35, 31]
rango = 50

# Paso 1: Asignar puntos a cada categoría basado en fracciones del rango
def convertir_a_gpa(puntaje, rango):
    if puntaje >= 0.75 * rango:
        return 4.0  # A (Fortaleza) Si el puntaje es mayor o igual al 75% del rango
    elif puntaje >= 0.50 * rango:
        return 3.0  # B (Oportunidad) Si el puntaje es mayor o igual al 50% del rango
    elif puntaje >= 0.25 * rango:
        return 2.0  # C (Amenaza) Si el puntaje es mayor o igual al 25% del rango
    else:
        return 1.0  # D (Debilidad) Si el puntaje es menor o igual al 25% del rango

# Convertir los puntajes a puntos GPA
gpa_puntos = [convertir_a_gpa(puntaje, rango) for puntaje in puntajes]

# Paso 2: Calcular el promedio de los puntos GPA
def calcular_promedio(gpa_puntos):
    return sum(gpa_puntos) / len(gpa_puntos)

promedio_gpa = calcular_promedio(gpa_puntos)
print(f"Promedio GPA: {promedio_gpa}")

# Paso 3: Evaluar DAFO basado en el promedio GPA
def evaluar_DAFO(promedio_gpa):
    resultados_DAFO = {
        "Fortalezas": [],
        "Debilidades": [],
        "Oportunidades": [],
        "Amenazas": []
    }
    
    if promedio_gpa >= 3.5:
        resultados_DAFO["Fortalezas"].append("Promedio GPA alto (Fortaleza)")
    elif promedio_gpa >= 2.5:
        resultados_DAFO["Oportunidades"].append("Promedio GPA moderado (Oportunidad)")
    elif promedio_gpa >= 1.5:
        resultados_DAFO["Amenazas"].append("Promedio GPA bajo (Amenaza)")
    else:
        resultados_DAFO["Debilidades"].append("Promedio GPA muy bajo (Debilidad)")
    
    return resultados_DAFO

resultados_DAFO = evaluar_DAFO(promedio_gpa)
print("Resultados DAFO:")
for campo, resultados in resultados_DAFO.items():
    print(f"{campo}: {', '.join(resultados)}")