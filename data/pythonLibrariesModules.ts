// 🎵 Módulos de Ejemplo: Librosa & Music21
// Copia y pega estos módulos en el curso de Python

export const LIBROSA_MODULE = {
  id: 'module-8',
  title: 'Módulo 8: Librosa para Análisis de Audio',
  description: 'Aprende a procesar archivos de audio, extraer características y crear visualizaciones con la poderosa biblioteca Librosa',
  weekRange: 'Semana 8',
  lessons: [
    {
      id: 'lesson-8-1',
      title: '¿Qué es Librosa?',
      content: `# Introducción a Librosa

Librosa es una biblioteca de Python diseñada para el análisis de audio y música. Es una herramienta fundamental para:

## 🎯 Casos de Uso:
- Análisis de señales de audio
- Extracción de características musicales
- Procesamiento de música
- Machine Learning con audio
- Visualización de audio

## 📦 Instalación:
\`\`\`bash
pip install librosa
\`\`\`

## 🔍 ¿Por qué Librosa?
- Fácil de usar
- Muy bien documentada
- Comunidad activa
- Integración con NumPy y SciPy
- Ideal para principiantes y expertos`,
      codeExample: `import librosa
import librosa.display
import matplotlib.pyplot as plt

# Verificar la versión instalada
print(f"Versión de Librosa: {librosa.__version__}")

# Cargar un archivo de audio de ejemplo
filename = librosa.example('trumpet')
print(f"Archivo de ejemplo: {filename}")`
    },
    {
      id: 'lesson-8-2',
      title: 'Cargando Archivos de Audio',
      content: `# Cargando y Explorando Audio

## 📂 Formatos Soportados:
- WAV (.wav)
- MP3 (.mp3)
- FLAC (.flac)
- OGG (.ogg)
- Y más...

## 🎵 Cargar Audio:
La función principal es \`librosa.load()\`, que devuelve:
1. **audio**: array NumPy con los datos de audio
2. **sr**: sample rate (tasa de muestreo) en Hz

## ⚙️ Parámetros Importantes:
- \`sr=None\`: Mantiene la tasa de muestreo original
- \`sr=22050\`: Remuestrea a 22.05 kHz (por defecto)
- \`mono=True\`: Convierte a mono automáticamente
- \`duration=30\`: Carga solo 30 segundos`,
      codeExample: `import librosa
import numpy as np

# Cargar audio manteniendo la tasa de muestreo original
audio, sr = librosa.load('mi_cancion.wav', sr=None)

print(f"Forma del audio: {audio.shape}")
print(f"Tasa de muestreo: {sr} Hz")
print(f"Duración: {len(audio)/sr:.2f} segundos")
print(f"Valores min/max: {audio.min():.3f} / {audio.max():.3f}")

# Cargar solo los primeros 10 segundos
audio_corto, sr = librosa.load('mi_cancion.wav', duration=10)
print(f"\\nAudio corto: {len(audio_corto)/sr:.2f} segundos")`
    },
    {
      id: 'lesson-8-3',
      title: 'Visualización de Formas de Onda',
      content: `# Visualizando Audio

## 📊 Tipos de Visualizaciones:
1. **Waveform** (Forma de onda): Amplitud vs Tiempo
2. **Spectrogram** (Espectrograma): Frecuencia vs Tiempo
3. **Mel Spectrogram**: Escala Mel (percepción humana)

## 🎨 Herramientas:
- \`librosa.display.waveshow()\`: Mostrar forma de onda
- \`matplotlib.pyplot\`: Personalizar gráficos`,
      codeExample: `import librosa
import librosa.display
import matplotlib.pyplot as plt
import numpy as np

# Cargar audio
audio, sr = librosa.load(librosa.example('trumpet'))

# Crear figura con subplots
plt.figure(figsize=(14, 5))

# Waveform
plt.subplot(1, 2, 1)
librosa.display.waveshow(audio, sr=sr)
plt.title('Forma de Onda')
plt.xlabel('Tiempo (s)')
plt.ylabel('Amplitud')

# Zoom en los primeros 0.1 segundos
plt.subplot(1, 2, 2)
samples = int(0.1 * sr)
librosa.display.waveshow(audio[:samples], sr=sr)
plt.title('Zoom: Primeros 0.1s')
plt.xlabel('Tiempo (s)')

plt.tight_layout()
plt.show()`
    },
    {
      id: 'lesson-8-4',
      title: 'Extracción de Características',
      content: `# Características de Audio

## 🎼 Características Principales:

### 1. **Tempo (BPM)**
- Velocidad de la música
- Beats por minuto

### 2. **Chroma Features**
- Representación de notas musicales
- 12 clases de pitch (Do, Do#, Re, etc.)

### 3. **MFCC (Mel-Frequency Cepstral Coefficients)**
- Representación compacta del espectro
- Usado en reconocimiento de voz

### 4. **Spectral Features**
- Centroide espectral
- Ancho de banda
- Contraste espectral

### 5. **Zero Crossing Rate**
- Tasa de cruces por cero
- Indica contenido de percusión`,
      codeExample: `import librosa
import numpy as np

# Cargar audio
audio, sr = librosa.load(librosa.example('trumpet'))

# 1. Tempo (BPM)
tempo, beats = librosa.beat.beat_track(y=audio, sr=sr)
print(f"Tempo: {tempo:.2f} BPM")
print(f"Beats detectados: {len(beats)}")

# 2. Chroma Features
chroma = librosa.feature.chroma_stft(y=audio, sr=sr)
print(f"\\nChroma shape: {chroma.shape}")
print(f"Promedio por nota: {np.mean(chroma, axis=1)}")

# 3. MFCC
mfcc = librosa.feature.mfcc(y=audio, sr=sr, n_mfcc=13)
print(f"\\nMFCC shape: {mfcc.shape}")
print(f"MFCC promedio: {np.mean(mfcc, axis=1)}")

# 4. Spectral Centroid
spectral_centroids = librosa.feature.spectral_centroid(y=audio, sr=sr)
print(f"\\nCentroide espectral promedio: {np.mean(spectral_centroids):.2f} Hz")

# 5. Zero Crossing Rate
zcr = librosa.feature.zero_crossing_rate(audio)
print(f"Zero Crossing Rate promedio: {np.mean(zcr):.4f}")`
    },
    {
      id: 'lesson-8-5',
      title: 'Proyecto: Analizador de Canciones',
      content: `# 🎵 Proyecto Final: Analizador de Canciones

Crea una aplicación que analice archivos de audio y muestre:
- Tempo (BPM)
- Duración
- Visualización de la forma de onda
- Espectrograma
- Características principales

## 📝 Requisitos:
1. Cargar un archivo MP3/WAV
2. Mostrar información básica
3. Generar visualizaciones
4. Extraer características musicales
5. Guardar resultados en un archivo

## 🎯 Bonus:
- Detectar género musical
- Comparar dos canciones
- Crear una playlist basada en similitud`,
      codeExample: `import librosa
import librosa.display
import matplotlib.pyplot as plt
import numpy as np

def analizar_cancion(archivo):
    """Analiza un archivo de audio y muestra información"""
    print(f"🎵 Analizando: {archivo}")
    print("="*50)
    
    # Cargar audio
    audio, sr = librosa.load(archivo)
    
    # Información básica
    duracion = len(audio) / sr
    print(f"⏱️  Duración: {duracion:.2f} segundos")
    print(f"📊 Tasa de muestreo: {sr} Hz")
    
    # Tempo
    tempo, _ = librosa.beat.beat_track(y=audio, sr=sr)
    print(f"🥁 Tempo: {tempo:.2f} BPM")
    
    # Características espectrales
    spectral_centroids = librosa.feature.spectral_centroid(y=audio, sr=sr)
    print(f"🎼 Centroide espectral: {np.mean(spectral_centroids):.2f} Hz")
    
    # Visualización
    plt.figure(figsize=(14, 8))
    
    # Waveform
    plt.subplot(3, 1, 1)
    librosa.display.waveshow(audio, sr=sr)
    plt.title('Forma de Onda')
    plt.ylabel('Amplitud')
    
    # Espectrograma
    plt.subplot(3, 1, 2)
    D = librosa.amplitude_to_db(np.abs(librosa.stft(audio)), ref=np.max)
    librosa.display.specshow(D, sr=sr, x_axis='time', y_axis='hz')
    plt.colorbar(format='%+2.0f dB')
    plt.title('Espectrograma')
    
    # MFCC
    plt.subplot(3, 1, 3)
    mfcc = librosa.feature.mfcc(y=audio, sr=sr, n_mfcc=13)
    librosa.display.specshow(mfcc, sr=sr, x_axis='time')
    plt.colorbar()
    plt.title('MFCC')
    
    plt.tight_layout()
    plt.savefig('analisis_cancion.png')
    print("\\n✅ Análisis completado! Gráficos guardados.")
    plt.show()

# Usar la función
# analizar_cancion('mi_cancion.mp3')`
    }
  ]
};

export const MUSIC21_MODULE = {
  id: 'module-9',
  title: 'Módulo 9: Music21 para Teoría Musical',
  description: 'Domina la teoría musical y composición con Music21. Crea, analiza y transforma música usando código Python',
  weekRange: 'Semana 9',
  lessons: [
    {
      id: 'lesson-9-1',
      title: 'Introducción a Music21',
      content: `# ¿Qué es Music21?

Music21 es un toolkit de Python para análisis computacional de música y teoría musical desarrollado por MIT.

## 🎼 Capacidades:
- Crear y manipular partituras
- Análisis armónico y melódico
- Teoría musical computacional
- Conversión entre formatos (MIDI, MusicXML, etc.)
- Búsqueda en corpus musicales

## 📚 Ideal para:
- Estudiantes de música
- Compositores
- Investigadores musicales
- Desarrolladores de software musical
- Educadores

## 📦 Instalación:
\`\`\`bash
pip install music21
\`\`\`

## 🎹 Primer uso:
Después de instalar, configura Music21:
\`\`\`python
import music21
music21.configure.run()
\`\`\``,
      codeExample: `import music21

# Verificar versión
print(f"Music21 versión: {music21.VERSION_STR}")

# Crear una nota simple
nota = music21.note.Note("C4")
print(f"Nota: {nota.name}")
print(f"Octava: {nota.octave}")
print(f"Duración: {nota.quarterLength} tiempos")
print(f"MIDI: {nota.pitch.midi}")

# Crear una escala
escala = music21.scale.MajorScale("C")
print(f"\\nEscala de Do Mayor: {[p.name for p in escala.pitches[:8]]}")`
    },
    {
      id: 'lesson-9-2',
      title: 'Notas, Acordes y Escalas',
      content: `# Elementos Básicos de Music21

## 🎵 Notas
Una nota tiene:
- **Pitch** (altura): C, D, E, F, G, A, B
- **Octava**: números 0-8 (C4 es el Do central)
- **Duración**: quarterLength (1 = negra, 0.5 = corchea, etc.)
- **Dinámica**: pp, p, mf, f, ff, etc.

## 🎹 Acordes
Conjunto de notas que suenan simultáneamente:
- Triadas: 3 notas
- Séptimas: 4 notas
- Inversiones

## 🎼 Escalas
Colecciones de notas organizadas:
- Mayor
- Menor (natural, armónica, melódica)
- Modos: Dórico, Frigio, Lidio, etc.
- Pentatónica
- Blues`,
      codeExample: `import music21

# === NOTAS ===
# Crear diferentes notas
do = music21.note.Note("C4", quarterLength=1.0)
re = music21.note.Note("D4", quarterLength=0.5)
mi = music21.note.Note("E4", quarterLength=2.0)

print("=== NOTAS ===")
print(f"Do: {do.nameWithOctave}, duración: {do.quarterLength}")
print(f"Re: {re.nameWithOctave}, duración: {re.quarterLength}")
print(f"Mi: {mi.nameWithOctave}, duración: {mi.quarterLength}")

# === ACORDES ===
# Acorde de Do Mayor (C-E-G)
acorde_mayor = music21.chord.Chord(["C4", "E4", "G4"])
print(f"\\n=== ACORDES ===")
print(f"Acorde: {acorde_mayor.pitchNames}")
print(f"Es mayor: {acorde_maior.isMajorTriad()}")
print(f"Fundamental: {acorde_mayor.root().name}")

# Acorde de séptima dominante
septima = music21.chord.Chord(["G4", "B4", "D5", "F5"])
print(f"Séptima: {septima.pitchNames}")
print(f"Es séptima dominante: {septima.isDominantSeventh()}")

# === ESCALAS ===
# Escala de Sol Mayor
escala_mayor = music21.scale.MajorScale("G")
print(f"\\n=== ESCALAS ===")
print(f"Sol Mayor: {[p.name for p in escala_mayor.pitches[:8]]}")

# Escala menor natural
escala_menor = music21.scale.MinorScale("A")
print(f"La menor: {[p.name for p in escala_menor.pitches[:8]]}")

# Escala pentatónica
penta = music21.scale.MajorPentatonicScale("C")
print(f"Pentatónica Mayor: {[p.name for p in penta.pitches[:6]]}")`
    },
    {
      id: 'lesson-9-3',
      title: 'Creando Partituras',
      content: `# 🎼 Composición con Music21

## Elementos de una Partitura:
1. **Stream**: Contenedor base
2. **Part**: Instrumento individual
3. **Measure**: Compás
4. **TimeSignature**: Métrica (4/4, 3/4, etc.)
5. **KeySignature**: Tonalidad
6. **Clef**: Clave (Sol, Fa, etc.)

## Flujo de Trabajo:
1. Crear un Stream
2. Añadir indicaciones (tempo, clave, métrica)
3. Añadir notas y acordes
4. Visualizar o exportar`,
      codeExample: `import music21

# Crear una partitura simple
partitura = music21.stream.Stream()

# Añadir indicaciones
partitura.append(music21.clef.TrebleClef())
partitura.append(music21.key.KeySignature(0))  # Do Mayor
partitura.append(music21.meter.TimeSignature('4/4'))
partitura.append(music21.tempo.MetronomeMark(number=120))

# Añadir notas (escala de Do Mayor)
notas = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5']
for nota in notas:
    n = music21.note.Note(nota, quarterLength=1)
    partitura.append(n)

# Añadir un acorde final
acorde_final = music21.chord.Chord(['C4', 'E4', 'G4'], quarterLength=4)
partitura.append(acorde_final)

print(f"Partitura creada con {len(partitura.notes)} elementos")

# Mostrar la partitura (requiere MuseScore o similar)
# partitura.show()

# Exportar a MIDI
# partitura.write('midi', 'mi_melodia.mid')

# Exportar a MusicXML
# partitura.write('musicxml', 'mi_melodia.xml')`
    },
    {
      id: 'lesson-9-4',
      title: 'Análisis Musical',
      content: `# 🔍 Análisis con Music21

Music21 puede analizar automáticamente:
- Tonalidad (Key Detection)
- Progresiones de acordes
- Cadencias
- Intervalos
- Forma musical

## Herramientas de Análisis:
- \`analysis.discrete.Ambitus\`: Rango de notas
- \`analysis.discrete.KrumhanslSchmuckler\`: Detección de tonalidad
- \`roman.romanNumeralFromChord\`: Análisis armónico`,
      codeExample: `import music21

# Crear una progresión de acordes simple
progresion = music21.stream.Stream()

# I - IV - V - I en Do Mayor
acordes = [
    music21.chord.Chord(['C4', 'E4', 'G4']),  # I
    music21.chord.Chord(['F4', 'A4', 'C5']),  # IV
    music21.chord.Chord(['G4', 'B4', 'D5']),  # V
    music21.chord.Chord(['C4', 'E4', 'G4'])   # I
]

for acorde in acordes:
    acorde.quarterLength = 4
    progresion.append(acorde)

print("=== ANÁLISIS DE PROGRESIÓN ===")

# Analizar cada acorde
for i, acorde in enumerate(acordes, 1):
    print(f"\\nAcorde {i}:")
    print(f"  Notas: {acorde.pitchNames}")
    print(f"  Fundamental: {acorde.root().name}")
    print(f"  Tipo: {'Mayor' if acorde.isMajorTriad() else 'Menor'}")
    
    # Grado romano en Do Mayor
    rn = music21.roman.romanNumeralFromChord(acorde, music21.key.Key('C'))
    print(f"  Grado: {rn.figure}")

# Detectar tonalidad
tonalidad = progresion.analyze('key')
print(f"\\nTonalidad detectada: {tonalidad}")

# Ambitus (rango de notas)
notas_todas = progresion.flatten().notes
if notas_todas:
    nota_mas_baja = min(notas_todas, key=lambda x: x.pitch.midi)
    nota_mas_alta = max(notas_todas, key=lambda x: x.pitch.midi)
    print(f"Rango: {nota_mas_baja.nameWithOctave} - {nota_mas_alta.nameWithOctave}")`
    },
    {
      id: 'lesson-9-5',
      title: 'Proyecto: Generador de Melodías',
      content: `# 🎵 Proyecto: Generador Algorítmico

Crea un programa que genere melodías automáticamente usando reglas musicales.

## 🎯 Objetivos:
1. Generar melodías aleatorias en una escala
2. Aplicar reglas de teoría musical
3. Exportar a MIDI
4. Visualizar en partitura

## 🎼 Reglas Musicales:
- Usar solo notas de la escala
- Evitar saltos grandes
- Terminar en la tónica
- Mantener un ritmo variado

## 💡 Ideas de Extensión:
- Generador de acordes
- Armonización automática
- Variaciones sobre un tema
- Composición en diferentes estilos`,
      codeExample: `import music21
import random

def generar_melodia(tonalidad='C', longitud=16):
    """
    Genera una melodía aleatoria siguiendo reglas musicales básicas
    """
    # Crear escala
    escala = music21.scale.MajorScale(tonalidad)
    notas_escala = escala.pitches[:8]  # Primera octava
    
    # Crear stream para la melodía
    melodia = music21.stream.Stream()
    
    # Configuración
    melodia.append(music21.clef.TrebleClef())
    melodia.append(music21.key.Key(tonalidad))
    melodia.append(music21.meter.TimeSignature('4/4'))
    melodia.append(music21.tempo.MetronomeMark(number=120))
    
    # Generar notas
    nota_actual = random.choice(notas_escala[:3])  # Empezar en tónica/dominante
    
    duraciones = [0.5, 1.0, 1.5, 2.0]  # Corchea, negra, negra con puntillo, blanca
    
    for i in range(longitud):
        # Elegir duración aleatoria
        duracion = random.choice(duraciones)
        
        # Crear nota
        n = music21.note.Note(nota_actual, quarterLength=duracion)
        melodia.append(n)
        
        # Siguiente nota (movimiento por grado conjunto o salto pequeño)
        if i < longitud - 1:
            idx = notas_escala.index(nota_actual)
            movimiento = random.choice([-2, -1, 0, 1, 2])  # Movimiento limitado
            nuevo_idx = max(0, min(len(notas_escala)-1, idx + movimiento))
            nota_actual = notas_escala[nuevo_idx]
    
    # Terminar en la tónica
    nota_final = music21.note.Note(notas_escala[0], quarterLength=4)
    melodia.append(nota_final)
    
    print(f"✅ Melodía generada en {tonalidad} Mayor")
    print(f"📊 {len(melodia.notes)} notas")
    
    return melodia

# Generar y mostrar
mi_melodia = generar_melodia('D', longitud=12)

# Exportar
# mi_melodia.write('midi', 'melodia_generada.mid')
# mi_melodia.show()

print("\\n🎼 Primeras 8 notas:")
for nota in mi_melodia.notes[:8]:
    print(f"  {nota.nameWithOctave} ({nota.quarterLength} tiempos)")`
    }
  ]
};

// 📝 Instrucciones de uso:
// 1. Login como profesor
// 2. Ir a Gestión de Cursos
// 3. Expandir el curso de Python
// 4. Copiar y pegar el contenido de LIBROSA_MODULE o MUSIC21_MODULE
// 5. O usar los datos como referencia para crear tus propios módulos
