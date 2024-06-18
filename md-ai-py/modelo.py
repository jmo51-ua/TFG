import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder

# Supongamos que tus datos están en un DataFrame llamado df
df = pd.read_csv('datos_kpi.csv')

# Identifica las columnas categóricas
categorical_columns = df.select_dtypes(include=['object']).columns

# Codifica las columnas categóricas
label_encoders = {}
for col in categorical_columns:
    label_encoders[col] = LabelEncoder()
    df[col] = label_encoders[col].fit_transform(df[col])

# Asegúrate de que no haya valores faltantes
df = df.fillna(0)  # O usa cualquier método apropiado para tu caso

# Separar las características (X) y la variable objetivo (y)
# Supongamos que la columna objetivo se llama 'target'
X = df.drop(['dafo_label'], axis=1)
y = df['dafo_label']

# División de los datos en conjunto de entrenamiento y prueba
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Entrenar el modelo
model = RandomForestClassifier()
model.fit(X_train, y_train)

# Evaluar el modelo
print("Accuracy:", model.score(X_test, y_test))
