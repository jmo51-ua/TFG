import numpy as np
from scipy.stats import linregress

# Datos de ejemplo
puntajes = [20, 25, 30, 18, 27, 33, 29, 24, 35, 31]
tiempos = list(range(1, len(puntajes) + 1))

# Calcular la pendiente de la tendencia
slope, intercept, r_value, p_value, std_err = linregress(tiempos, puntajes)
print(f"Pendiente de la tendencia: {slope}")

# Calcular la media y la desviación estándar
mean = np.mean(puntajes)
std_dev = np.std(puntajes)

# Umbrales usando la regla empírica
umbral1 = mean + std_dev  # 68%
umbral2 = mean + 2 * std_dev  # 95%
umbral3 = mean + 3 * std_dev  # 99.7%

print(f"Media: {mean}")
print(f"Umbral 1 desviación estándar: {umbral1}")
print(f"Umbral 2 desviaciones estándar: {umbral2}")
print(f"Umbral 3 desviaciones estándar: {umbral3}")

if slope > 0:
    if mean > umbral1:
        categoria = 'Fortaleza'
        razon = 'Rendimiento en aumento y sólido.'
    else:
        categoria = 'Oportunidad'
        razon = 'Tendencia de mejora que aún no es fuerte pero tiene potencial.'
else:
    if mean < (mean - std_dev):
        categoria = 'Debilidad'
        razon = 'Rendimiento decreciente y problemático.'
    else:
        categoria = 'Amenaza'
        razon = 'Tendencia decreciente que aún no es fuerte pero es preocupante.'

print(f"Categoría en la matriz DAFO: {categoria}")
print(f"Razón: {razon}")
