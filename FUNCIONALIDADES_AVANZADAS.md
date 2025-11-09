# 🚀 Funcionalidades Avanzadas - Gestión de Cursos

## ✅ Funcionalidades Implementadas

### 1. 🔍 Búsqueda y Filtrado de Contenido

**Funcionalidad:**
- Barra de búsqueda en tiempo real en la parte superior de Gestión de Cursos
- Busca en títulos y descripciones de cursos
- Busca en títulos y descripciones de módulos
- Busca en títulos y contenido de lecciones
- Botón "✕" para limpiar la búsqueda rápidamente

**Cómo usar:**
1. Ve a **Gestión de Cursos** (pestaña en el Dashboard del Profesor)
2. Escribe en la barra de búsqueda: 🔍 "Buscar cursos, módulos o lecciones..."
3. Los resultados se filtran automáticamente mientras escribes
4. Los cursos que no coincidan con la búsqueda se ocultan
5. Click en "✕" para mostrar todos los cursos nuevamente

**Ejemplos de búsqueda:**
- "python" → Muestra el curso de Python
- "variables" → Muestra módulos y lecciones sobre variables
- "librosa" → Mostrará los módulos de Librosa cuando los agregues
- "print" → Muestra lecciones que mencionen la función print

---

### 2. 🎯 Drag & Drop - Reordenamiento de Módulos

**Funcionalidad:**
- Reordena módulos dentro de un curso arrastrándolos
- Icono "⋮⋮" (drag handle) visible en cada módulo
- Cambios se guardan automáticamente
- Animación suave al mover módulos

**Cómo usar:**
1. Expande un curso (click en "▶ Ver Contenido")
2. Busca el icono "⋮⋮" al inicio de cada módulo
3. Mantén presionado sobre "⋮⋮" y arrastra el módulo
4. Suelta cuando esté en la posición deseada
5. El orden se guarda automáticamente

**Casos de uso:**
- Reorganizar el orden pedagógico de los módulos
- Mover módulos más importantes al principio
- Agrupar módulos relacionados consecutivamente
- Ajustar la secuencia de aprendizaje

---

### 3. ✏️ Edición de Módulos y Lecciones

**Funcionalidad:**
- Botón "✏️" en cada módulo y lección
- Modal de edición con los datos actuales pre-cargados
- Cambios se guardan al hacer click en "Guardar Cambios"
- El título del modal cambia a "Editar..." en lugar de "Añadir..."

**Cómo editar un módulo:**
1. Expande un curso
2. Hover sobre un módulo → aparecen botones en la esquina superior derecha
3. Click en el botón "✏️ Editar"
4. Modal se abre con:
   - Título del módulo (editable)
   - Descripción (editable)
   - Rango de semanas (editable)
5. Modifica los campos necesarios
6. Click en "Guardar Cambios"

**Cómo editar una lección:**
1. Expande un curso y visualiza los módulos
2. Hover sobre una lección → aparecen botones a la derecha
3. Click en el botón "✏️ Editar"
4. Modal se abre con:
   - Título de la lección (editable)
   - Contenido (editable)
   - Ejemplo de código (editable, opcional)
5. Modifica los campos necesarios
6. Click en "Guardar Cambios"

**Casos de uso:**
- Corregir errores tipográficos
- Actualizar contenido desactualizado
- Mejorar descripciones
- Añadir o modificar ejemplos de código
- Cambiar el rango de semanas de un módulo

---

### 4. 📋 Duplicar Módulos y Lecciones

**Funcionalidad:**
- Botón "📋" para duplicar módulos y lecciones
- Crea una copia exacta con "(Copia)" añadido al título
- Al duplicar un módulo, también duplica todas sus lecciones
- Útil para crear variaciones de contenido

**Cómo duplicar un módulo:**
1. Expande un curso
2. Hover sobre un módulo
3. Click en el botón "📋 Duplicar"
4. Se crea una copia del módulo al final de la lista
5. El nuevo módulo tiene el nombre: "{Nombre Original} (Copia)"
6. Todas las lecciones del módulo original se copian también

**Cómo duplicar una lección:**
1. Expande un curso y visualiza módulos
2. Hover sobre una lección
3. Click en el botón "📋 Duplicar"
4. Se crea una copia de la lección al final del módulo
5. La nueva lección tiene el nombre: "{Nombre Original} (Copia)"

**Casos de uso:**
- Crear variaciones de un módulo para diferentes niveles
- Reutilizar estructura de lecciones exitosas
- Crear versiones de práctica de lecciones teóricas
- Duplicar un módulo base para añadir Python libraries (Librosa, Music21)
- Experimentar con diferentes enfoques pedagógicos

---

### 5. 🗑️ Eliminación Mejorada

**Funcionalidad:**
- Botón "🗑️" en módulos y lecciones
- Confirmación antes de eliminar
- Mensajes descriptivos según el tipo de elemento

**Cómo eliminar:**

**Módulo:**
- Hover sobre el módulo
- Click en "🗑️"
- Confirma: "¿Seguro de eliminar este módulo y todas sus lecciones?"
- Si aceptas, se elimina el módulo y todo su contenido

**Lección:**
- Hover sobre la lección
- Click en "🗑️"
- Confirma: "¿Seguro de eliminar esta lección?"
- Si aceptas, se elimina solo esa lección

---

## 🎨 Mejoras de UI/UX

### Botones con Tooltips
- Hover sobre botones muestra su función
- "✏️ Editar", "📋 Duplicar", "🗑️ Eliminar"
- Botones solo visibles al hacer hover (no saturan la interfaz)

### Animaciones Suaves
- Transición suave al expandir/colapsar cursos
- Animación al arrastrar módulos
- Hover effects en lecciones y módulos

### Responsive Design
- Todos los elementos se adaptan a diferentes tamaños de pantalla
- Modales centrados y scrollables
- Grid responsive para formularios

### Tema Claro/Oscuro
- Todos los nuevos componentes soportan ambos temas
- Colores consistentes con el resto de la aplicación
- Contraste optimizado para legibilidad

---

## 🛠️ Flujo de Trabajo Recomendado

### Para añadir módulos de Librosa:

1. **Login como profesor**
   - Usuario: `profesor`
   - Password: `profesor`

2. **Ir a Gestión de Cursos**
   - Dashboard → pestaña "Gestión de Cursos"

3. **Expandir el curso de Python**
   - Click en "▶ Ver Contenido"

4. **Añadir nuevo módulo**
   - Click en "+ Módulo"
   - Título: "Módulo 8: Librosa para Análisis de Audio"
   - Descripción: "Aprende a procesar archivos de audio, extraer características y crear visualizaciones con Librosa"
   - Rango de semanas: "Semana 8"
   - Click en "Añadir Módulo"

5. **Añadir lecciones al módulo**
   - Click en "+ Lección" dentro del módulo de Librosa
   - Lección 1:
     - Título: "Introducción a Librosa"
     - Contenido: "Librosa es una biblioteca de Python para análisis de audio y música..."
     - Código: `import librosa\nprint(librosa.__version__)`
   - Lección 2:
     - Título: "Cargando archivos de audio"
     - Contenido: "Aprende a cargar diferentes formatos de audio..."
     - Código: `audio, sr = librosa.load('archivo.wav')`
   - Continúa añadiendo más lecciones...

6. **Reordenar si es necesario**
   - Arrastra módulos con "⋮⋮" para ajustar el orden

### Para añadir módulos de Music21:

1. **Duplicar el módulo de Librosa** (opcional, para reutilizar estructura)
   - Hover sobre el módulo de Librosa
   - Click en "📋 Duplicar"
   
2. **Editar el módulo duplicado**
   - Click en "✏️" en el módulo duplicado
   - Cambiar título a: "Módulo 9: Music21 para Teoría Musical"
   - Cambiar descripción
   - Guardar cambios

3. **Editar o reemplazar lecciones**
   - Editar lecciones existentes o eliminarlas
   - Añadir lecciones específicas de Music21

---

## 📊 Estadísticas de Funcionalidades

| Funcionalidad | Botón/Icono | Ubicación | Acción |
|--------------|-------------|-----------|--------|
| **Buscar** | 🔍 | Header superior | Filtrado en tiempo real |
| **Expandir** | ▶/▼ | Cada curso | Mostrar/ocultar módulos |
| **Añadir Módulo** | + Módulo | Curso expandido | Crear nuevo módulo |
| **Añadir Lección** | + Lección | Dentro de módulo | Crear nueva lección |
| **Reordenar** | ⋮⋮ | Inicio de módulo | Drag & drop |
| **Editar Módulo** | ✏️ | Hover sobre módulo | Modal de edición |
| **Editar Lección** | ✏️ | Hover sobre lección | Modal de edición |
| **Duplicar Módulo** | 📋 | Hover sobre módulo | Copiar con lecciones |
| **Duplicar Lección** | 📋 | Hover sobre lección | Copiar lección |
| **Eliminar Módulo** | 🗑️ | Hover sobre módulo | Borrar con confirmación |
| **Eliminar Lección** | 🗑️ | Hover sobre lección | Borrar con confirmación |

---

## 🔧 Detalles Técnicos

### Librerías Utilizadas
- **@dnd-kit/core**: Drag & drop base
- **@dnd-kit/sortable**: Listas ordenables
- **@dnd-kit/utilities**: Utilidades CSS para transforms

### Almacenamiento
- Todos los cambios se guardan en **localStorage**
- Persistencia entre sesiones
- Sincronización automática

### Performance
- Filtrado optimizado con `useEffect`
- Re-renders mínimos
- Animaciones con CSS transforms (GPU-accelerated)

### Accesibilidad
- Keyboard navigation en drag & drop
- Tooltips descriptivos
- Confirmaciones antes de acciones destructivas
- Contraste WCAG compliant

---

## 🎓 Próximas Mejoras Sugeridas

1. **Exportar/Importar Cursos**
   - Exportar curso a JSON
   - Importar cursos de otros profesores
   
2. **Plantillas de Módulos**
   - Plantilla de "Librosa básico"
   - Plantilla de "Music21 básico"
   - Plantilla de "Análisis de datos con Python"

3. **Versiones de Contenido**
   - Historial de cambios
   - Deshacer/Rehacer ediciones

4. **Colaboración**
   - Múltiples profesores editando
   - Comentarios en lecciones

5. **Analytics**
   - Lecciones más vistas
   - Tiempo promedio por módulo
   - Tasa de completitud

---

## 🌐 URLs y Accesos

- **Frontend**: http://localhost:3000/
- **Usuario Profesor**: `profesor` / `profesor`
- **Usuario Estudiante**: `estudiante` / `estudiante`

---

## 📝 Notas Importantes

- Todos los cambios se guardan automáticamente en localStorage
- El drag & drop solo funciona cuando el curso está expandido
- Los botones de acción solo son visibles al hacer hover (diseño limpio)
- La búsqueda es case-insensitive (no diferencia mayúsculas/minúsculas)
- Al duplicar un módulo, se generan IDs únicos automáticamente
- Los modales se pueden cerrar con el botón "Cancelar" o clickeando fuera

---

## ✨ ¡Disfruta de las Nuevas Funcionalidades!

Estas mejoras hacen que la plataforma sea totalmente escalable y lista para:
- ✅ Añadir módulos de **Librosa**
- ✅ Añadir módulos de **Music21**
- ✅ Añadir cualquier otra biblioteca o tema de Python
- ✅ Gestionar contenido de forma profesional
- ✅ Ofrecer una experiencia de usuario excepcional

**¡La plataforma está lista para crecer sin límites! 🚀**
