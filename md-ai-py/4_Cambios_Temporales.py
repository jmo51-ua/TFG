puntajes = [20, 25, 30, 18, 27, 33, 29, 24, 35, 31]
resultados_DAFO = {
    "Fortalezas": [],
    "Debilidades": [],
    "Oportunidades": [],
    "Amenazas": []
}
def comparar_sesiones(puntajes):
    cambios = []
    for i in range(1, len(puntajes)):
        cambio = (puntajes[i] - puntajes[i - 1]) / puntajes[i - 1] * 100
        cambios.append(cambio)
    return cambios

cambios_sesiones = comparar_sesiones(puntajes)
print(f"Cambios entre Sesiones: {cambios_sesiones}")

# Evaluar Cambios entre Sesiones
cambios_positivos = [cambio for cambio in cambios_sesiones if cambio > 0]
cambios_negativos = [cambio for cambio in cambios_sesiones if cambio < 0]

if len(cambios_positivos) > len(cambios_negativos):
    resultados_DAFO["Oportunidades"].append("Tiende a mejorar entre sesiones")
else:
    resultados_DAFO["Amenazas"].append("Tiende a empeorar entre sesiones")

print("\n\nResultados DAFO:")
for campo, resultados in resultados_DAFO.items():
    print(f"{campo}: {', '.join(resultados)}")