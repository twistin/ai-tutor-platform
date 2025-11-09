# 📝 Casos de Prueba para Crítica de Código IA

Este archivo contiene ejemplos de código con diferentes tipos de errores para probar el sistema de crítica por IA.

## Categorías de Errores

### 1. Errores de Sintaxis

#### 1.1 Print sin paréntesis (Python 2 vs 3)
```python
for i in range(5):
    print i
```
**Error**: `print` debe ser una función en Python 3

#### 1.2 Paréntesis no cerrados
```python
print("Hola mundo"
```
**Error**: Falta cerrar paréntesis

#### 1.3 Comillas no cerradas
```python
mensaje = "Hola mundo
print(mensaje)
```
**Error**: Falta cerrar comillas

#### 1.4 Dos puntos faltantes
```python
if x > 5
    print(x)
```
**Error**: Falta `:` después del `if`

### 2. Errores de Indentación

#### 2.1 Función sin indentar
```python
def saludar():
print("Hola")
```
**Error**: El cuerpo de la función debe estar indentado

#### 2.2 Else mal indentado
```python
if True:
    print("Sí")
  else:
    print("No")
```
**Error**: `else` debe alinearse con `if`

#### 2.3 Loop con indentación inconsistente
```python
for i in range(3):
    print(i)
      print(i * 2)
```
**Error**: Indentación inconsistente dentro del loop

### 3. Errores Lógicos

#### 3.1 Variable usada antes de definir
```python
print(nombre)
nombre = "Juan"
```
**Error**: `nombre` se usa antes de ser definida

#### 3.2 División por cero
```python
x = 10
y = 0
resultado = x / y
```
**Error**: División por cero

#### 3.3 Índice fuera de rango
```python
frutas = ["manzana", "banana"]
print(frutas[5])
```
**Error**: Índice 5 no existe en lista de 2 elementos

#### 3.4 Comparación con asignación
```python
x = 5
if x = 10:
    print("Es 10")
```
**Error**: Usar `=` en lugar de `==`

### 4. Errores de Tipo

#### 4.1 Concatenar string y número
```python
edad = 15
mensaje = "Tengo " + edad + " años"
```
**Error**: No se puede concatenar string con int directamente

#### 4.2 Sumar string y número
```python
resultado = "5" + 3
```
**Error**: No se puede sumar string con número

### 5. Código Correcto pero Mejorable

#### 5.1 Loop con índices innecesarios
```python
frutas = ["manzana", "banana", "naranja"]
for i in range(len(frutas)):
    print(frutas[i])
```
**Mejorable**: Más pythonic iterar directamente: `for fruta in frutas:`

#### 5.2 Lista vacía sin inicializar
```python
def obtener_numeros():
    numeros = []
    for i in range(5):
        numeros.append(i)
    return numeros
```
**Mejorable**: List comprehension: `return [i for i in range(5)]`

#### 5.3 If redundante
```python
def es_mayor(x):
    if x > 18:
        return True
    else:
        return False
```
**Mejorable**: Simplemente `return x > 18`

#### 5.4 Variable no usada
```python
def calcular(a, b):
    resultado = a + b
    total = resultado * 2
    return resultado
```
**Mejorable**: `total` no se usa

### 6. Código Perfecto (Control)

#### 6.1 Función simple bien escrita
```python
def saludar(nombre):
    return f"Hola, {nombre}!"

print(saludar("María"))
```
**Estado**: Perfecto

#### 6.2 Loop pythonic
```python
frutas = ["manzana", "banana", "naranja"]
for fruta in frutas:
    print(f"Me gusta la {fruta}")
```
**Estado**: Perfecto

#### 6.3 Manejo de excepciones
```python
try:
    numero = int(input("Número: "))
    print(f"El doble es {numero * 2}")
except ValueError:
    print("Eso no es un número válido")
```
**Estado**: Perfecto

## Cómo Usar Estos Ejemplos

### Con curl:

```bash
# Ejemplo 1: Print sin paréntesis
curl -X POST http://localhost:8080/api/gemini/critique \
  -H "Content-Type: application/json" \
  -d '{
    "code": "for i in range(5):\n    print i",
    "userId": "11"
  }' | jq -r '.data.critique'
```

### Script para probar todos:

```bash
#!/bin/bash

# Array de ejemplos (código y descripción)
declare -a tests=(
  "for i in range(5):\n    print i|Print sin paréntesis"
  "def saludar():\nprint(\"Hola\")|Función sin indentar"
  "print(nombre)\nnombre = \"Juan\"|Variable antes de definir"
  "frutas = [\"manzana\", \"banana\"]\nfor i in range(len(frutas)):\n    print(frutas[i])|Loop mejorable"
)

for test in "${tests[@]}" ; do
    CODE="${test%%|*}"
    DESC="${test##*|}"
    
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🧪 Test: $DESC"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    CRITIQUE=$(curl -s -X POST http://localhost:8080/api/gemini/critique \
      -H "Content-Type: application/json" \
      -d "{\"code\":\"$CODE\",\"userId\":\"11\"}" | jq -r '.data.critique // .error')
    
    echo "💬 Crítica: $CRITIQUE"
    echo ""
    sleep 2  # Respetar rate limit de API
done
```

## Métricas Esperadas

### Tipos de Respuesta

- **Errores de sintaxis**: ~80% de precisión en identificar el problema
- **Errores lógicos**: ~70% de precisión en sugerir la solución
- **Código mejorable**: ~60% de sugerencias útiles
- **Código perfecto**: ~90% de feedback positivo o sugerencias menores

### Tiempo de Respuesta

- **Código corto (<10 líneas)**: 2-3 segundos
- **Código medio (10-50 líneas)**: 3-5 segundos
- **Código largo (>50 líneas)**: 5-8 segundos

## Notas para Evaluación

Al probar, considera:

1. **Tono**: ¿Es alentador y constructivo?
2. **Precisión**: ¿Identifica el problema correcto?
3. **Claridad**: ¿La pista es suficientemente clara sin dar la solución?
4. **Edad apropiada**: ¿El lenguaje es adecuado para estudiantes de ~15 años?
5. **Concisión**: ¿La respuesta es breve (2-3 oraciones)?

## Resultados de Ejemplo

### Ejemplo Real 1:
**Código**:
```python
for i in range(5):
    print i
```

**Crítica Esperada**:
> "¡Buen intento! Revisa la línea 2. En Python 3, print es una función, no una palabra clave. ¿Qué le falta a tu print?"

### Ejemplo Real 2:
**Código**:
```python
def saludar():
print("Hola")
```

**Crítica Esperada**:
> "Vas por buen camino, pero fíjate en la línea 2. ¿Qué debe pasar con el código dentro de una función? Piensa en la indentación."

### Ejemplo Real 3:
**Código**:
```python
frutas = ["manzana", "banana"]
for i in range(len(frutas)):
    print(frutas[i])
```

**Crítica Esperada**:
> "¡Excelente! Tu código funciona. ¿Sabías que hay una forma más 'pythonica' de hacer esto? En Python, puedes iterar directamente sobre la lista sin usar índices."

## Casos Especiales

### Código Vacío
```python

```
**Resultado**: Error de validación antes de llamar a Gemini

### Código Muy Largo (>500 líneas)
**Resultado**: Puede ser lento pero funcional

### Código con Múltiples Errores
```python
def calcular(x, y)
    resultado = x + y
    Print(resultado)
```
**Resultado**: Gemini debería enfocarse en UN error a la vez

## Integración con Frontend

Cuando integres con `PythonConsole.tsx`, considera:

1. Mostrar un spinner mientras espera respuesta
2. Limitar a 1 crítica cada 30 segundos por usuario
3. Guardar el último código criticado para no repetir
4. Mostrar la crítica en un panel destacado
5. Opción de "Probar de nuevo" después de hacer cambios
