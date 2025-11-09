import { Module } from '../types';

// Módulos restantes del curso de Python para Adolescentes
export const MODULE_5: Module = {
  id: 'module-5',
  title: 'Módulo 5: Programación Orientada a Objetos',
  description: 'Aprende a crear tus propios tipos de datos',
  weekRange: 'Semana 9-10',
  lessons: [
    {
      id: 'l5-1',
      title: 'Clases y objetos',
      content: `# Programación Orientada a Objetos (POO)

La POO te permite crear tus propios tipos de datos personalizados.

**Conceptos clave:**
- **Clase:** El molde/plantilla
- **Objeto:** Una instancia de la clase
- **Atributos:** Características del objeto
- **Métodos:** Acciones que puede hacer`,
      codeExample: `# Crear una clase
class Perro:
    def __init__(self, nombre, edad):
        self.nombre = nombre
        self.edad = edad
    
    def ladrar(self):
        print(f"{self.nombre} dice: ¡Guau!")
    
    def cumplir_años(self):
        self.edad += 1
        print(f"{self.nombre} ahora tiene {self.edad} años")

# Crear objetos
mi_perro = Perro("Max", 3)
otro_perro = Perro("Luna", 1)

mi_perro.ladrar()
mi_perro.cumplir_años()`,
    },
    {
      id: 'l5-2',
      title: 'Métodos y atributos',
      content: `# Métodos y Atributos

**Atributos:** Variables que pertenecen al objeto
**Métodos:** Funciones que pertenecen al objeto

**Tipos de métodos:**
- Métodos de instancia: usan \`self\`
- Métodos de clase: usan \`@classmethod\`
- Métodos estáticos: usan \`@staticmethod\``,
      codeExample: `class Estudiante:
    # Atributo de clase (compartido por todos)
    escuela = "CodeLearn Academy"
    
    def __init__(self, nombre, grado):
        # Atributos de instancia (únicos para cada objeto)
        self.nombre = nombre
        self.grado = grado
        self.materias = []
    
    def agregar_materia(self, materia):
        self.materias.append(materia)
        print(f"{materia} agregada para {self.nombre}")
    
    def mostrar_info(self):
        print(f"Estudiante: {self.nombre}")
        print(f"Grado: {self.grado}")
        print(f"Escuela: {self.escuela}")
        print(f"Materias: {', '.join(self.materias)}")

alumno = Estudiante("Ana", "10°")
alumno.agregar_materia("Python")
alumno.agregar_materia("Matemáticas")
alumno.mostrar_info()`,
    },
    {
      id: 'l5-3',
      title: 'Herencia',
      content: `# Herencia

La herencia permite crear clases basadas en otras clases, heredando sus atributos y métodos.

**Ventajas:**
- Reutilizar código
- Crear jerarquías lógicas
- Especializar comportamiento`,
      codeExample: `# Clase base
class Animal:
    def __init__(self, nombre):
        self.nombre = nombre
    
    def hacer_sonido(self):
        pass
    
    def dormir(self):
        print(f"{self.nombre} está durmiendo...")

# Clases derivadas
class Perro(Animal):
    def hacer_sonido(self):
        print(f"{self.nombre} dice: ¡Guau!")

class Gato(Animal):
    def hacer_sonido(self):
        print(f"{self.nombre} dice: ¡Miau!")

# Usar las clases
perro = Perro("Rex")
gato = Gato("Whiskers")

perro.hacer_sonido()
perro.dormir()
gato.hacer_sonido()`,
    },
    {
      id: 'l5-4',
      title: 'Encapsulación',
      content: `# Encapsulación

La encapsulación oculta los detalles internos y protege los datos.

**Convenciones:**
- \`_atributo\`: Protegido (convención, no forzado)
- \`__atributo\`: Privado (name mangling)
- \`atributo\`: Público`,
      codeExample: `class CuentaBancaria:
    def __init__(self, titular, saldo_inicial):
        self.titular = titular
        self.__saldo = saldo_inicial  # Privado
    
    def depositar(self, cantidad):
        if cantidad > 0:
            self.__saldo += cantidad
            print(f"Depositado: $` + `{cantidad}")
        else:
            print("Cantidad inválida")
    
    def retirar(self, cantidad):
        if 0 < cantidad <= self.__saldo:
            self.__saldo -= cantidad
            print(f"Retirado: $` + `{cantidad}")
        else:
            print("Fondos insuficientes o cantidad inválida")
    
    def ver_saldo(self):
        return f"Saldo actual: $` + `{self.__saldo}"

# Usar la cuenta
cuenta = CuentaBancaria("Alex", 1000)
cuenta.depositar(500)
cuenta.retirar(200)
print(cuenta.ver_saldo())
# print(cuenta.__saldo)  # Error! Es privado`,
    },
    {
      id: 'l5-5',
      title: 'Proyecto: Simulador de Juegos',
      content: `# Proyecto: Sistema de Juego RPG

Vamos a crear un pequeño sistema de juego con personajes, combate y niveles.`,
      codeExample: `import random

class Personaje:
    def __init__(self, nombre, vida, ataque, defensa):
        self.nombre = nombre
        self.vida = vida
        self.vida_maxima = vida
        self.ataque = ataque
        self.defensa = defensa
        self.nivel = 1
    
    def atacar(self, objetivo):
        daño = max(0, self.ataque - objetivo.defensa + random.randint(-5, 5))
        objetivo.recibir_daño(daño)
        print(f"{self.nombre} ataca a {objetivo.nombre} y causa {daño} de daño!")
    
    def recibir_daño(self, daño):
        self.vida = max(0, self.vida - daño)
        print(f"{self.nombre} tiene {self.vida}/{self.vida_maxima} HP")
    
    def esta_vivo(self):
        return self.vida > 0
    
    def curar(self, cantidad):
        self.vida = min(self.vida_maxima, self.vida + cantidad)
        print(f"{self.nombre} se curó {cantidad} HP")

class Guerrero(Personaje):
    def __init__(self, nombre):
        super().__init__(nombre, vida=120, ataque=25, defensa=15)
    
    def ataque_especial(self, objetivo):
        print(f"{self.nombre} usa GOLPE PODEROSO!")
        daño = self.ataque * 2 - objetivo.defensa
        objetivo.recibir_daño(daño)

class Mago(Personaje):
    def __init__(self, nombre):
        super().__init__(nombre, vida=80, ataque=35, defensa=8)
        self.mana = 100
    
    def hechizo(self, objetivo):
        if self.mana >= 20:
            print(f"{self.nombre} lanza BOLA DE FUEGO!")
            daño = self.ataque * 1.5
            objetivo.recibir_daño(int(daño))
            self.mana -= 20
        else:
            print("¡Sin mana suficiente!")

# Crear personajes y simular combate
heroe = Guerrero("Aragorn")
enemigo = Mago("Saruman")

print("=== COMIENZA EL COMBATE ===")
while heroe.esta_vivo() and enemigo.esta_vivo():
    heroe.atacar(enemigo)
    if enemigo.esta_vivo():
        enemigo.hechizo(heroe)
    print()

ganador = heroe if heroe.esta_vivo() else enemigo
print(f"¡{ganador.nombre} gana el combate!")`,
    },
  ],
};

export const MODULE_6: Module = {
  id: 'module-6',
  title: 'Módulo 6: Manejo de Archivos y Errores',
  description: 'Trabaja con archivos y maneja errores elegantemente',
  weekRange: 'Semana 11-12',
  lessons: [
    {
      id: 'l6-1',
      title: 'Lectura y escritura de archivos',
      content: `# Manejo de Archivos

Python puede leer y escribir archivos de texto fácilmente.

**Modos de apertura:**
- \`'r'\`: Lectura (por defecto)
- \`'w'\`: Escritura (sobrescribe)
- \`'a'\`: Añadir al final
- \`'r+'\`: Lectura y escritura`,
      codeExample: `# Escribir en un archivo
with open('mi_archivo.txt', 'w') as archivo:
    archivo.write("¡Hola desde Python!\\n")
    archivo.write("Esta es la línea 2\\n")
    archivo.write("Python es increíble\\n")

# Leer todo el archivo
with open('mi_archivo.txt', 'r') as archivo:
    contenido = archivo.read()
    print(contenido)

# Leer línea por línea
with open('mi_archivo.txt', 'r') as archivo:
    for linea in archivo:
        print(linea.strip())

# Añadir al final
with open('mi_archivo.txt', 'a') as archivo:
    archivo.write("Nueva línea añadida\\n")`,
    },
    {
      id: 'l6-2',
      title: 'Manejo de excepciones (try, except)',
      content: `# Manejo de Errores

Los errores son inevitables, pero podemos manejarlos elegantemente.

**Estructura:**
\`\`\`python
try:
    # Código que puede fallar
except TipoDeError:
    # Qué hacer si falla
else:
    # Si todo salió bien
finally:
    # Siempre se ejecuta
\`\`\``,
      codeExample: `# Ejemplo básico
def dividir(a, b):
    try:
        resultado = a / b
        print(f"Resultado: {resultado}")
    except ZeroDivisionError:
        print("¡Error! No se puede dividir por cero")
    except TypeError:
        print("¡Error! Usa números válidos")
    else:
        print("División exitosa")
    finally:
        print("Operación completada")

dividir(10, 2)
dividir(10, 0)

# Capturar múltiples excepciones
def leer_archivo(nombre):
    try:
        with open(nombre, 'r') as f:
            return f.read()
    except FileNotFoundError:
        print(f"El archivo {nombre} no existe")
    except PermissionError:
        print("No tienes permiso para leer este archivo")
    except Exception as e:
        print(f"Error inesperado: {e}")

leer_archivo('noexiste.txt')`,
    },
    {
      id: 'l6-3',
      title: 'Trabajo con JSON',
      content: `# JSON (JavaScript Object Notation)

JSON es un formato popular para intercambiar datos. Python tiene soporte nativo.

**Uso común:**
- Guardar configuraciones
- APIs web
- Almacenar datos estructurados`,
      codeExample: `import json

# Python dict a JSON (serialización)
estudiante = {
    "nombre": "Alex",
    "edad": 15,
    "materias": ["Python", "Matemáticas", "Ciencias"],
    "promedio": 9.5
}

# Guardar en archivo JSON
with open('estudiante.json', 'w') as archivo:
    json.dump(estudiante, archivo, indent=2)
    print("Datos guardados en JSON")

# Leer desde archivo JSON
with open('estudiante.json', 'r') as archivo:
    datos = json.load(archivo)
    print("\\nDatos leídos desde JSON:")
    print(f"Nombre: {datos['nombre']}")
    print(f"Edad: {datos['edad']}")
    print(f"Materias: {', '.join(datos['materias'])}")

# Convertir a string JSON
json_string = json.dumps(estudiante, indent=2)
print("\\nJSON como string:")
print(json_string)`,
    },
    {
      id: 'l6-4',
      title: 'Logging básico',
      content: `# Sistema de Logs

El logging ayuda a rastrear qué hace tu programa y encontrar errores.

**Niveles de log:**
- DEBUG: Información detallada
- INFO: Confirmación de que funciona
- WARNING: Advertencia, algo inesperado
- ERROR: Error serio
- CRITICAL: Error crítico`,
      codeExample: `import logging

# Configurar logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s',
    filename='app.log'
)

# También mostrar en consola
console = logging.StreamHandler()
console.setLevel(logging.INFO)
logging.getLogger('').addHandler(console)

# Usar logging
logging.debug("Esto es un mensaje de debug")
logging.info("Programa iniciado")
logging.warning("Esto es una advertencia")
logging.error("Ha ocurrido un error")

# Ejemplo práctico
def calcular_promedio(calificaciones):
    logging.info(f"Calculando promedio de {len(calificaciones)} calificaciones")
    try:
        promedio = sum(calificaciones) / len(calificaciones)
        logging.info(f"Promedio calculado: {promedio}")
        return promedio
    except ZeroDivisionError:
        logging.error("Lista de calificaciones vacía")
        return 0
    except TypeError as e:
        logging.error(f"Error de tipo: {e}")
        return None

calcular_promedio([8, 9, 7, 10])
calcular_promedio([])`,
    },
    {
      id: 'l6-5',
      title: 'Proyecto: Sistema de Notas Personales',
      content: `# Proyecto: Gestor de Notas

Crea un sistema para guardar y gestionar notas personales con archivos JSON.`,
      codeExample: `import json
import os
from datetime import datetime

class GestorNotas:
    def __init__(self, archivo='notas.json'):
        self.archivo = archivo
        self.notas = self.cargar_notas()
    
    def cargar_notas(self):
        try:
            with open(self.archivo, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            return []
    
    def guardar_notas(self):
        with open(self.archivo, 'w') as f:
            json.dump(self.notas, f, indent=2)
    
    def agregar_nota(self, titulo, contenido):
        nota = {
            'id': len(self.notas) + 1,
            'titulo': titulo,
            'contenido': contenido,
            'fecha': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }
        self.notas.append(nota)
        self.guardar_notas()
        print(f"✓ Nota '{titulo}' guardada")
    
    def listar_notas(self):
        if not self.notas:
            print("No hay notas guardadas")
            return
        
        print("\\n=== MIS NOTAS ===")
        for nota in self.notas:
            print(f"\\n[{nota['id']}] {nota['titulo']}")
            print(f"Fecha: {nota['fecha']}")
            print(f"Contenido: {nota['contenido'][:50]}...")
    
    def buscar_nota(self, termino):
        encontradas = [n for n in self.notas 
                      if termino.lower() in n['titulo'].lower() 
                      or termino.lower() in n['contenido'].lower()]
        
        if encontradas:
            print(f"\\n=== Encontradas {len(encontradas)} notas ===")
            for nota in encontradas:
                print(f"\\n{nota['titulo']}: {nota['contenido']}")
        else:
            print("No se encontraron notas")
    
    def eliminar_nota(self, id_nota):
        self.notas = [n for n in self.notas if n['id'] != id_nota]
        self.guardar_notas()
        print(f"✓ Nota eliminada")

# Usar el gestor
gestor = GestorNotas()
gestor.agregar_nota("Python", "Aprendiendo POO y archivos")
gestor.agregar_nota("Proyecto", "Ideas para el proyecto final")
gestor.listar_notas()
gestor.buscar_nota("Python")`,
    },
  ],
};

export const MODULE_7: Module = {
  id: 'module-7',
  title: 'Módulo 7: Proyectos Finales y Próximos Pasos',
  description: 'Integra todo lo aprendido en proyectos reales',
  weekRange: 'Semana 13-14',
  lessons: [
    {
      id: 'l7-1',
      title: 'Proyecto integrador: App de Gestión Personal',
      content: `# Proyecto Final: Gestor Personal Completo

Vamos a crear una aplicación que combine todo lo aprendido:
- POO para estructurar el código
- Archivos JSON para persistencia
- Manejo de errores
- Menú interactivo
- Múltiples funcionalidades`,
      codeExample: `# Este es un proyecto grande, aquí está la estructura base
import json
from datetime import datetime

class Tarea:
    def __init__(self, titulo, descripcion, prioridad="media"):
        self.id = None
        self.titulo = titulo
        self.descripcion = descripcion
        self.prioridad = prioridad
        self.completada = False
        self.fecha_creacion = datetime.now().strftime('%Y-%m-%d %H:%M')
    
    def marcar_completada(self):
        self.completada = True
    
    def to_dict(self):
        return {
            'id': self.id,
            'titulo': self.titulo,
            'descripcion': self.descripcion,
            'prioridad': self.prioridad,
            'completada': self.completada,
            'fecha_creacion': self.fecha_creacion
        }

class GestorTareas:
    def __init__(self):
        self.tareas = []
        self.cargar_tareas()
    
    def cargar_tareas(self):
        try:
            with open('tareas.json', 'r') as f:
                datos = json.load(f)
                for d in datos:
                    tarea = Tarea(d['titulo'], d['descripcion'], d['prioridad'])
                    tarea.id = d['id']
                    tarea.completada = d['completada']
                    tarea.fecha_creacion = d['fecha_creacion']
                    self.tareas.append(tarea)
        except FileNotFoundError:
            self.tareas = []
    
    def guardar_tareas(self):
        with open('tareas.json', 'w') as f:
            json.dump([t.to_dict() for t in self.tareas], f, indent=2)
    
    def agregar_tarea(self, tarea):
        tarea.id = len(self.tareas) + 1
        self.tareas.append(tarea)
        self.guardar_tareas()
        print(f"✓ Tarea '{tarea.titulo}' agregada")
    
    def listar_tareas(self, mostrar_completadas=True):
        tareas_filtradas = self.tareas if mostrar_completadas else [t for t in self.tareas if not t.completada]
        
        if not tareas_filtradas:
            print("No hay tareas")
            return
        
        print("\\n=== LISTA DE TAREAS ===")
        for t in tareas_filtradas:
            estado = "✓" if t.completada else "○"
            print(f"{estado} [{t.id}] {t.titulo} - Prioridad: {t.prioridad}")
            print(f"   {t.descripcion}")

# Continúa en la siguiente lección...`,
    },
    {
      id: 'l7-2',
      title: 'Introducción a librerías populares',
      content: `# Librerías Populares de Python

Python tiene miles de librerías para casi cualquier cosa que imagines.

**Librerías esenciales:**
- **requests**: Hacer peticiones HTTP
- **pandas**: Análisis de datos
- **numpy**: Cálculos numéricos
- **matplotlib**: Gráficas
- **pygame**: Crear juegos
- **flask/django**: Aplicaciones web`,
      codeExample: `# Ejemplo con requests (instalar: pip install requests)
import requests

# Obtener datos de una API
response = requests.get('https://api.github.com/users/github')
if response.status_code == 200:
    datos = response.json()
    print(f"Usuario: {datos['name']}")
    print(f"Seguidores: {datos['followers']}")

# Ejemplo conceptual con pandas
# import pandas as pd
# 
# # Crear un DataFrame
# datos = {
#     'nombre': ['Ana', 'Bob', 'Carlos'],
#     'edad': [15, 16, 15],
#     'promedio': [9.5, 8.7, 9.2]
# }
# df = pd.DataFrame(datos)
# print(df)
# print(f"Promedio de edad: {df['edad'].mean()}")

# Ejemplo conceptual con matplotlib
# import matplotlib.pyplot as plt
#
# calificaciones = [8, 9, 7, 10, 8, 9, 10]
# plt.plot(calificaciones)
# plt.title('Mis Calificaciones')
# plt.xlabel('Examen')
# plt.ylabel('Calificación')
# plt.show()`,
    },
    {
      id: 'l7-3',
      title: 'Mejores prácticas de programación',
      content: `# Mejores Prácticas (Best Practices)

Sigue estas reglas para escribir código profesional.

**1. Nombres descriptivos**
\`\`\`python
# Mal
x = 15
# Bien
edad_estudiante = 15
\`\`\`

**2. Funciones pequeñas**
Cada función debe hacer una sola cosa

**3. Comentarios útiles**
Explica el "por qué", no el "qué"

**4. DRY (Don't Repeat Yourself)**
No repitas código, usa funciones

**5. Maneja errores**
Siempre anticipa qué puede fallar`,
      codeExample: `# ❌ Código malo
def f(x,y,z):
  if x>10:
    return x*y*z
  else:
    return 0

# ✅ Código bueno
def calcular_volumen_si_valido(ancho, alto, profundidad):
    """
    Calcula el volumen solo si las dimensiones son válidas.
    
    Args:
        ancho: Ancho en cm
        alto: Alto en cm
        profundidad: Profundidad en cm
    
    Returns:
        Volumen en cm³ o 0 si dimensiones inválidas
    """
    MIN_DIMENSION = 10
    
    if ancho >= MIN_DIMENSION:
        volumen = ancho * alto * profundidad
        return volumen
    else:
        return 0

# ✅ Uso de constantes
VELOCIDAD_LUZ = 299792458  # m/s
PI = 3.14159
MAX_INTENTOS = 3

# ✅ Validación de entrada
def dividir_seguro(numerador, denominador):
    try:
        if denominador == 0:
            raise ValueError("El denominador no puede ser cero")
        return numerador / denominador
    except TypeError:
        print("Error: Usa números válidos")
        return None`,
    },
    {
      id: 'l7-4',
      title: 'Recursos para continuar aprendiendo',
      content: `# ¿Qué sigue después de este curso?

Has aprendido las bases de Python, pero esto es solo el comienzo.

**Caminos de especialización:**

**1. Desarrollo Web** 🌐
- Flask (micro-framework)
- Django (framework completo)
- FastAPI (APIs modernas)

**2. Ciencia de Datos** 📊
- pandas, numpy
- matplotlib, seaborn
- jupyter notebooks

**3. Inteligencia Artificial** 🤖
- TensorFlow, PyTorch
- scikit-learn
- OpenCV

**4. Desarrollo de Juegos** 🎮
- pygame
- pyglet
- Panda3D

**5. Automatización** ⚙️
- Selenium (web scraping)
- BeautifulSoup
- Scripts de automatización`,
      codeExample: `# Ejemplo de web scraping básico (concepto)
# from bs4 import BeautifulSoup
# import requests
#
# response = requests.get('https://example.com')
# soup = BeautifulSoup(response.text, 'html.parser')
# titulos = soup.find_all('h1')
# for titulo in titulos:
#     print(titulo.text)

# Ejemplo de bot simple
def bot_matematico():
    """Bot que ayuda con problemas matemáticos"""
    print("¡Hola! Soy tu asistente matemático")
    
    while True:
        operacion = input("\\n¿Qué quieres calcular? (suma/resta/salir): ")
        
        if operacion == 'salir':
            print("¡Hasta luego!")
            break
        
        if operacion in ['suma', 'resta']:
            a = float(input("Primer número: "))
            b = float(input("Segundo número: "))
            
            if operacion == 'suma':
                print(f"Resultado: {a + b}")
            else:
                print(f"Resultado: {a - b}")

# bot_matematico()

print("""
📚 Recursos recomendados:
- python.org/docs
- realpython.com
- stackoverflow.com
- github.com (proyectos open source)
- kaggle.com (competencias de datos)

¡Sigue practicando y construyendo proyectos!
""")`,
    },
    {
      id: 'l7-5',
      title: '¡Felicitaciones! Has completado el curso',
      content: `# 🎉 ¡Felicitaciones!

Has completado el curso "Python para Adolescentes - De Principiante a Programador"

**Lo que has aprendido:**
✅ Fundamentos de Python
✅ Control de flujo y lógica
✅ Estructuras de datos
✅ Funciones y modularidad
✅ Programación Orientada a Objetos
✅ Manejo de archivos y errores
✅ Mejores prácticas

**Próximos pasos:**
1. Construye proyectos personales
2. Contribuye a proyectos open source
3. Participa en hackathons
4. Comparte tu conocimiento

**Recuerda:**
"El código es poesía" - No solo escribas código que funcione, escribe código del que estés orgulloso.

¡Continúa aprendiendo y nunca dejes de programar! 🚀`,
      codeExample: `# Tu viaje apenas comienza...
import random

frases_motivadoras = [
    "El único modo de hacer un gran trabajo es amar lo que haces - Steve Jobs",
    "El código es como el humor. Cuando tienes que explicarlo, es malo - Cory House",
    "Primero, resuelve el problema. Luego, escribe el código - John Johnson",
    "Cualquier tonto puede escribir código que una computadora entienda. Los buenos programadores escriben código que los humanos pueden entender - Martin Fowler"
]

print("\\n" + "="*60)
print("🎓 CERTIFICADO DE FINALIZACIÓN")
print("="*60)
print("\\nEste certifica que has completado exitosamente")
print("Python para Adolescentes - De Principiante a Programador")
print("\\nFecha:", "2025-11-07")
print("\\nFrase del día:")
print(random.choice(frases_motivadoras))
print("\\n" + "="*60)
print("\\n¡Sigue programando y cambia el mundo! 🌍✨")
print("="*60)

# ¿Cuál será tu próximo proyecto?`,
    },
  ],
};
