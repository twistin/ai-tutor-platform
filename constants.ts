import { Course, User } from './types';

// Mock user data for login simulation.
// Usuarios de DEMOSTRACIÓN - Para probar la plataforma
export const USERS: User[] = [
  { id: 1, name: 'estudiante', role: 'STUDENT', progress: [], email: 'estudiante@test.com' },
  { id: 2, name: 'profesor', role: 'PROFESSOR', email: 'profesor@test.com' },
];

// Credenciales de demostración para el landing page
export const DEMO_CREDENTIALS = {
  student: { username: 'estudiante', description: 'Accede como estudiante para ver las lecciones' },
  teacher: { username: 'profesor', description: 'Accede como profesor para gestionar cursos' }
};

// Mock course and lesson data for the application.
export const COURSES: Course[] = [
  {
    id: 'py-teens',
    title: 'Python para Adolescentes - De Principiante a Programador',
    description: 'Curso completo de Python diseñado específicamente para estudiantes de 15 años. Aprende programación desde cero con proyectos prácticos y divertidos.',
    level: 'beginner',
    duration: '14 semanas',
    createdAt: '2025-01-15',
    modules: [
      {
        id: 'module-1',
        title: 'Módulo 1: Primeros Pasos en Python',
        description: 'Comienza tu viaje en programación con Python',
        weekRange: 'Semana 1-2',
        lessons: [
          {
            id: 'l1-1',
            title: '¿Qué es Python y por qué es popular?',
            content: `# ¿Qué es Python?

Python es un lenguaje de programación versátil y fácil de aprender que se usa en:
- 🌐 Desarrollo web (Instagram, Spotify)
- 🤖 Inteligencia Artificial (ChatGPT, robots)
- 🎮 Videojuegos (Minecraft mods)
- 📊 Análisis de datos (NASA, científicos)
- 🎬 Efectos especiales (Pixar, Disney)

**¿Por qué es perfecto para empezar?**
- Sintaxis clara y legible (casi como hablar inglés)
- Gran comunidad que te puede ayudar
- Miles de librerías para hacer lo que imagines`,
            codeExample: `# Este es tu primer código Python
print("¡Bienvenido al mundo de la programación!")
print("Python es divertido 🐍")`,
          },
          {
            id: 'l1-2',
            title: 'Tu primer programa: ¡Hola, mundo!',
            content: `# ¡Hola, Mundo!

El primer programa que todo programador escribe. Es una tradición que comenzó hace más de 40 años.

**La función print()**
La función \`print()\` muestra texto en la pantalla. Todo lo que pongas entre comillas aparecerá tal cual.`,
            codeExample: `print("¡Hola, mundo!")
print("Mi nombre es Python")
print("¡Estoy aprendiendo a programar!")`,
          },
          {
            id: 'l1-3',
            title: 'Variables y tipos de datos básicos',
            content: `# Variables

Las variables son como cajas donde guardas información. Le pones un nombre y dentro guardas un valor.

**Tipos de datos básicos:**
- **Números enteros (int)**: 1, 42, -5
- **Números decimales (float)**: 3.14, -0.5, 2.0
- **Texto (string)**: "Hola", 'Python', "123"
- **Booleanos (bool)**: True, False`,
            codeExample: `# Variables con diferentes tipos de datos
nombre = "Alex"
edad = 15
altura = 1.65
es_estudiante = True

print("Me llamo", nombre)
print("Tengo", edad, "años")
print("Mido", altura, "metros")`,
          },
          {
            id: 'l1-4',
            title: 'Operaciones matemáticas simples',
            content: `# Operaciones Matemáticas

Python puede funcionar como una calculadora súper potente.

**Operadores básicos:**
- \`+\` Suma
- \`-\` Resta
- \`*\` Multiplicación
- \`/\` División
- \`**\` Potencia
- \`%\` Módulo (resto de división)
- \`//\` División entera`,
            codeExample: `# Operaciones matemáticas
suma = 10 + 5
resta = 20 - 7
multiplicacion = 6 * 8
division = 15 / 3
potencia = 2 ** 3  # 2 elevado a 3
modulo = 17 % 5    # resto de 17/5

print("Suma:", suma)
print("Potencia:", potencia)
print("Módulo:", modulo)`,
          },
          {
            id: 'l1-5',
            title: 'Interacción con el usuario (input/output)',
            content: `# Interacción con el Usuario

Haz que tus programas sean interactivos pidiendo información al usuario.

**La función input()**
\`input()\` muestra un mensaje y espera que el usuario escriba algo.

**¡Importante!** \`input()\` siempre devuelve texto (string). Si necesitas un número, debes convertirlo.`,
            codeExample: `# Programa interactivo
nombre = input("¿Cómo te llamas? ")
print("¡Hola,", nombre + "!")

# Trabajando con números
edad_texto = input("¿Cuántos años tienes? ")
edad = int(edad_texto)  # Convertir a número
años_futuros = edad + 10
print("En 10 años tendrás", años_futuros, "años")`,
          },
        ],
      },
      {
        id: 'module-2',
        title: 'Módulo 2: Control de Flujo y Lógica',
        description: 'Aprende a tomar decisiones en tu código',
        weekRange: 'Semana 3-4',
        lessons: [
          {
            id: 'l2-1',
            title: 'Operadores de comparación',
            content: `# Operadores de Comparación

Los operadores de comparación te permiten comparar valores y obtener True o False.

**Operadores:**
- \`==\` Igual a
- \`!=\` Diferente de
- \`>\` Mayor que
- \`<\` Menor que
- \`>=\` Mayor o igual que
- \`<=\` Menor o igual que`,
            codeExample: `edad = 15
print(edad == 15)    # True
print(edad > 18)     # False
print(edad <= 16)    # True

nombre = "Python"
print(nombre == "python")  # False (mayúsculas importan)
print(nombre != "Java")    # True`,
          },
          {
            id: 'l2-2',
            title: 'Sentencias if, elif, else',
            content: `# Condicionales

Los condicionales permiten que tu programa tome decisiones.

**Estructura:**
\`\`\`
if condicion:
    # código si es verdadero
elif otra_condicion:
    # código si la segunda es verdadera
else:
    # código si ninguna es verdadera
\`\`\``,
            codeExample: `# Sistema de calificaciones
nota = 85

if nota >= 90:
    print("¡Excelente! 🌟")
elif nota >= 80:
    print("¡Muy bien! 👍")
elif nota >= 70:
    print("Bien, sigue así")
elif nota >= 60:
    print("Suficiente, puedes mejorar")
else:
    print("Necesitas estudiar más")`,
          },
          {
            id: 'l2-3',
            title: 'Bucles for y while',
            content: `# Bucles

Los bucles te permiten repetir código sin escribirlo muchas veces.

**Bucle for:** Cuando sabes cuántas veces repetir
**Bucle while:** Cuando repites hasta que algo cambie`,
            codeExample: `# Bucle for - contar del 1 al 5
for numero in range(1, 6):
    print("Número:", numero)

# Bucle while - cuenta regresiva
contador = 5
while contador > 0:
    print(contador, "...")
    contador = contador - 1
print("¡Despegue! 🚀")`,
          },
          {
            id: 'l2-4',
            title: 'break, continue y pass',
            content: `# Control de Bucles

Palabras especiales que controlan cómo funcionan los bucles:

- **break:** Sale del bucle inmediatamente
- **continue:** Salta a la siguiente iteración
- **pass:** No hace nada (placeholder)`,
            codeExample: `# Ejemplo con break
for i in range(1, 11):
    if i == 5:
        print("¡Encontré el 5! Saliendo...")
        break
    print(i)

# Ejemplo con continue
print("\\nNúmeros impares:")
for i in range(1, 11):
    if i % 2 == 0:  # Si es par, salta
        continue
    print(i)`,
          },
          {
            id: 'l2-5',
            title: 'Proyecto: Calculadora Interactiva',
            content: `# Proyecto: Calculadora Interactiva

Vamos a crear una calculadora que puede sumar, restar, multiplicar y dividir.

**Características:**
- Menú de opciones
- Validación de entrada
- Operaciones matemáticas
- Opción para salir`,
            codeExample: `# Calculadora Interactiva
while True:
    print("\\n=== CALCULADORA ===")
    print("1. Sumar")
    print("2. Restar")
    print("3. Multiplicar")
    print("4. Dividir")
    print("5. Salir")
    
    opcion = input("Elige una opción (1-5): ")
    
    if opcion == "5":
        print("¡Hasta luego!")
        break
    
    if opcion in ["1", "2", "3", "4"]:
        num1 = float(input("Primer número: "))
        num2 = float(input("Segundo número: "))
        
        if opcion == "1":
            print("Resultado:", num1 + num2)
        elif opcion == "2":
            print("Resultado:", num1 - num2)
        elif opcion == "3":
            print("Resultado:", num1 * num2)
        elif opcion == "4":
            if num2 != 0:
                print("Resultado:", num1 / num2)
            else:
                print("Error: No se puede dividir por cero")
    else:
        print("Opción inválida")`,
          },
        ],
      },
      {
        id: 'module-3',
        title: 'Módulo 3: Estructuras de Datos',
        description: 'Organiza y manipula colecciones de datos',
        weekRange: 'Semana 5-6',
        lessons: [
          {
            id: 'l3-1',
            title: 'Listas: crear, modificar, acceder',
            content: `# Listas en Python

Las listas son colecciones ordenadas y modificables. Perfectas para guardar varios elementos relacionados.

**Características:**
- Se escriben con corchetes \`[]\`
- Pueden contener cualquier tipo de dato
- Se puede acceder por índice (empezando en 0)
- Son modificables`,
            codeExample: `# Crear y usar listas
frutas = ["manzana", "banana", "naranja"]
print(frutas[0])  # Primera fruta

# Modificar
frutas[1] = "uva"
print(frutas)

# Agregar elementos
frutas.append("pera")
frutas.insert(0, "fresa")
print(frutas)

# Eliminar
frutas.remove("naranja")
ultimo = frutas.pop()
print("Eliminado:", ultimo)`,
          },
          {
            id: 'l3-2',
            title: 'Tuplas: datos inmutables',
            content: `# Tuplas

Las tuplas son como listas pero **no se pueden modificar** después de crearlas.

**¿Cuándo usar tuplas?**
- Datos que no deben cambiar (coordenadas, fechas)
- Son más rápidas que las listas
- Pueden ser claves en diccionarios`,
            codeExample: `# Crear tuplas
coordenadas = (10, 20)
fecha = (2025, 11, 7)
colores = ("rojo", "verde", "azul")

print(coordenadas[0])  # Acceder: 10
print(fecha)

# Desempaquetar tuplas
x, y = coordenadas
print(f"X: {x}, Y: {y}")

año, mes, dia = fecha
print(f"Fecha: {dia}/{mes}/{año}")`,
          },
          {
            id: 'l3-3',
            title: 'Diccionarios: pares clave-valor',
            content: `# Diccionarios

Los diccionarios guardan pares de clave-valor. Como un diccionario real: buscas una palabra (clave) y obtienes su definición (valor).

**Características:**
- Se escriben con llaves \`{}\`
- Cada elemento tiene una clave única
- Muy rápidos para buscar datos`,
            codeExample: `# Crear diccionario
estudiante = {
    "nombre": "Alex",
    "edad": 15,
    "grado": "10°",
    "materias": ["Matemáticas", "Python", "Ciencias"]
}

# Acceder a valores
print(estudiante["nombre"])
print(estudiante["edad"])

# Agregar o modificar
estudiante["promedio"] = 9.5
estudiante["edad"] = 16

# Recorrer diccionario
for clave, valor in estudiante.items():
    print(f"{clave}: {valor}")`,
          },
          {
            id: 'l3-4',
            title: 'Sets: colecciones únicas',
            content: `# Sets (Conjuntos)

Los sets son colecciones de elementos únicos sin orden específico.

**Características:**
- No permite duplicados
- No tiene índices
- Muy eficiente para eliminar duplicados
- Operaciones matemáticas de conjuntos`,
            codeExample: `# Crear sets
numeros = {1, 2, 3, 4, 5}
frutas = {"manzana", "banana", "manzana"}  # Solo queda 1 manzana
print(frutas)

# Operaciones de conjuntos
grupo_a = {1, 2, 3, 4}
grupo_b = {3, 4, 5, 6}

union = grupo_a | grupo_b
print("Unión:", union)

interseccion = grupo_a & grupo_b
print("Intersección:", interseccion)

diferencia = grupo_a - grupo_b
print("Diferencia:", diferencia)`,
          },
          {
            id: 'l3-5',
            title: 'Comprehensions',
            content: `# List Comprehensions

Una forma elegante y rápida de crear listas basadas en listas existentes.

**Sintaxis:**
\`nueva_lista = [expresion for item in lista if condicion]\``,
            codeExample: `# Crear lista de cuadrados
cuadrados = [x**2 for x in range(1, 11)]
print("Cuadrados:", cuadrados)

# Filtrar números pares
numeros = range(1, 21)
pares = [n for n in numeros if n % 2 == 0]
print("Pares:", pares)

# Convertir a mayúsculas
nombres = ["ana", "bob", "carlos"]
mayusculas = [nombre.upper() for nombre in nombres]
print(mayusculas)

# Dict comprehension
cuadrados_dict = {x: x**2 for x in range(1, 6)}
print(cuadrados_dict)`,
          },
        ],
      },
      {
        id: 'module-4',
        title: 'Módulo 4: Funciones y Modularidad',
        description: 'Organiza tu código con funciones reutilizables',
        weekRange: 'Semana 7-8',
        lessons: [
          {
            id: 'l4-1',
            title: 'Definir funciones',
            content: `# Funciones

Las funciones son bloques de código reutilizable que realizan una tarea específica.

**Ventajas:**
- Evitas repetir código
- Código más organizado
- Fácil de probar y corregir
- Reutilizable en otros proyectos`,
            codeExample: `# Función simple
def saludar():
    print("¡Hola, bienvenido!")

saludar()  # Llamar la función

# Función con retorno
def sumar(a, b):
    resultado = a + b
    return resultado

total = sumar(5, 3)
print("Total:", total)

# Función con múltiples retornos
def operaciones(a, b):
    return a + b, a - b, a * b, a / b

suma, resta, multi, div = operaciones(10, 2)
print(f"Suma: {suma}, Resta: {resta}")`,
          },
          {
            id: 'l4-2',
            title: 'Parámetros y argumentos',
            content: `# Parámetros y Argumentos

Los parámetros permiten pasar información a las funciones.

**Tipos:**
- Posicionales: deben estar en orden
- Con nombre (keyword): puedes ponerlos en cualquier orden
- Predeterminados: tienen un valor por defecto
- *args y **kwargs: cantidad variable`,
            codeExample: `# Parámetros predeterminados
def saludar(nombre, saludo="Hola"):
    print(f"{saludo}, {nombre}!")

saludar("Ana")
saludar("Bob", "Buenos días")

# Argumentos con nombre
def presentar(nombre, edad, ciudad):
    print(f"Soy {nombre}, tengo {edad} años y vivo en {ciudad}")

presentar(edad=15, ciudad="Madrid", nombre="Carlos")

# *args para múltiples argumentos
def sumar_todos(*numeros):
    return sum(numeros)

print(sumar_todos(1, 2, 3, 4, 5))`,
          },
          {
            id: 'l4-3',
            title: 'Alcance de variables (scope)',
            content: `# Alcance de Variables (Scope)

El "scope" determina dónde una variable puede ser usada.

**Tipos de scope:**
- **Local:** dentro de una función
- **Global:** fuera de funciones
- **Nonlocal:** en funciones anidadas`,
            codeExample: `# Variables globales y locales
mensaje_global = "Soy global"

def mi_funcion():
    mensaje_local = "Soy local"
    print(mensaje_global)  # Puede acceder a global
    print(mensaje_local)

mi_funcion()
# print(mensaje_local)  # Error! No existe fuera

# Modificar variable global
contador = 0

def incrementar():
    global contador
    contador += 1
    print(f"Contador: {contador}")

incrementar()
incrementar()`,
          },
          {
            id: 'l4-4',
            title: 'Funciones lambda',
            content: `# Funciones Lambda

Las funciones lambda son funciones pequeñas y anónimas de una sola línea.

**Sintaxis:** \`lambda argumentos: expresión\`

**Cuándo usarlas:**
- Operaciones simples
- Como argumento de otras funciones
- Cuando no necesitas nombre`,
            codeExample: `# Función normal vs lambda
def cuadrado(x):
    return x ** 2

cuadrado_lambda = lambda x: x ** 2

print(cuadrado(5))
print(cuadrado_lambda(5))

# Con múltiples argumentos
suma = lambda a, b: a + b
print(suma(10, 20))

# Usando con map y filter
numeros = [1, 2, 3, 4, 5]
cuadrados = list(map(lambda x: x**2, numeros))
pares = list(filter(lambda x: x % 2 == 0, numeros))

print("Cuadrados:", cuadrados)
print("Pares:", pares)`,
          },
          {
            id: 'l4-5',
            title: 'Módulos estándar de Python',
            content: `# Módulos Estándar

Python viene con una "biblioteca estándar" llena de módulos útiles.

**Módulos populares:**
- \`math\`: operaciones matemáticas
- \`random\`: números aleatorios
- \`datetime\`: fechas y tiempo
- \`os\`: interactuar con el sistema operativo`,
            codeExample: `# Módulo math
import math

print(math.pi)
print(math.sqrt(16))
print(math.ceil(4.3))

# Módulo random
import random

numero = random.randint(1, 100)
print("Número aleatorio:", numero)

eleccion = random.choice(["piedra", "papel", "tijera"])
print("Elección:", eleccion)

# Módulo datetime
from datetime import datetime

ahora = datetime.now()
print("Fecha y hora:", ahora)
print("Año:", ahora.year)
print("Mes:", ahora.month)`,
          },
        ],
      },
    ],
  },
];
