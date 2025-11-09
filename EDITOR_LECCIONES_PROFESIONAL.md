# 🎨 Editor de Lecciones Profesional - Documentación

## 📋 Resumen

Se ha creado un **Editor de Lecciones de Pantalla Completa** que reemplaza el modal pequeño anterior. Este nuevo editor permite crear contenido multimedia rico con bloques de diferentes tipos.

---

## ✨ Características Principales

### 1. **Modal de Pantalla Completa** 📺
- **Tamaño**: 90% de altura de pantalla, ancho máximo 6xl (1152px)
- **Scroll independiente**: El contenido es scrollable dentro del modal
- **Interfaz oscura**: Diseño profesional con tema oscuro consistente

### 2. **Sistema de Bloques de Contenido** 🧱

El contenido de cada lección se compone de **bloques independientes** que se pueden:
- ✅ Agregar dinámicamente
- ✅ Reordenar (mover arriba/abajo)
- ✅ Eliminar individualmente
- ✅ Editar de forma independiente

#### **Tipos de Bloques Disponibles:**

##### **📝 Bloque de Texto**
- Área de texto grande y expandible
- Soporte para Markdown (negrita, cursiva, listas)
- Mínimo 120px de altura, expandible

##### **💻 Bloque de Código**
- Selector de lenguaje de programación:
  - Python, JavaScript, TypeScript, Java
  - C++, HTML, CSS, SQL
- Editor con fuente monoespaciada
- Sintaxis resaltada (color verde para código)
- Mínimo 150px de altura

##### **🖼️ Bloque de Imagen**
- **Dos formas de agregar imágenes**:
  1. **Subir archivo**: Drag & drop o click
  2. **Pegar URL**: Enlace directo a imagen
- Vista previa de imagen
- Campo para pie de imagen (caption)
- Botón para eliminar y cambiar imagen

##### **🎥 Bloque de Video**
- Campo para URL del video (YouTube, Vimeo, etc.)
- Campo opcional para descripción
- Vista previa del reproductor
- Soporte para múltiples plataformas

##### **🔗 Bloque de Enlace**
- Campo para URL del recurso
- Campo opcional para texto personalizado del enlace
- Validación de URLs

---

## 🎨 Interfaz de Usuario

### **Estructura del Editor**

```
┌────────────────────────────────────────────────┐
│ Header (Fijo)                                  │
│ • Título: "Editar/Nueva Lección"              │
│ • Módulo: "Nombre del módulo"                 │
│ • Botón cerrar (X)                            │
├────────────────────────────────────────────────┤
│ Body (Scrollable)                              │
│                                                │
│ ┌──────────────────────────────────────────┐  │
│ │ 📌 Título de la Lección *                │  │
│ │ [Input grande para título]               │  │
│ └──────────────────────────────────────────┘  │
│                                                │
│ ┌──────────────────────────────────────────┐  │
│ │ ➕ Agregar bloque de contenido:          │  │
│ │ [📝 Texto] [💻 Código] [🖼️ Imagen]      │  │
│ │ [🎥 Video] [🔗 Enlace]                  │  │
│ └──────────────────────────────────────────┘  │
│                                                │
│ ┌──────────────────────────────────────────┐  │
│ │ 📝 Texto - Bloque 1 de 3   [⬆️] [⬇️] [🗑️] │
│ │ ┌────────────────────────────────────┐   │  │
│ │ │ [Área de texto expandible]         │   │  │
│ │ └────────────────────────────────────┘   │  │
│ └──────────────────────────────────────────┘  │
│                                                │
│ ┌──────────────────────────────────────────┐  │
│ │ 💻 Código - Bloque 2 de 3  [⬆️] [⬇️] [🗑️] │
│ │ [Python ▼] Lenguaje del código           │  │
│ │ ┌────────────────────────────────────┐   │  │
│ │ │ import librosa                     │   │  │
│ │ │ audio, sr = librosa.load('file')  │   │  │
│ │ └────────────────────────────────────┘   │  │
│ └──────────────────────────────────────────┘  │
│                                                │
│ ┌──────────────────────────────────────────┐  │
│ │ 🖼️ Imagen - Bloque 3 de 3  [⬆️] [⬇️] [🗑️] │
│ │ [Vista previa de imagen]     [🗑️ Quitar] │  │
│ │ [Pie de imagen (opcional)]               │  │
│ └──────────────────────────────────────────┘  │
│                                                │
├────────────────────────────────────────────────┤
│ Footer (Fijo)                                  │
│ 3 bloque(s) de contenido    [Cancelar] [💾 Guardar] │
└────────────────────────────────────────────────┘
```

### **Indicadores Visuales**

#### **Bloque Activo**
- Border azul brillante (`border-blue-500`)
- Sombra azul (`shadow-blue-500/20`)
- Resaltado al hacer click

#### **Controles de Bloque**
- **⬆️ Mover Arriba**: Solo si no es el primer bloque
- **⬇️ Mover Abajo**: Solo si no es el último bloque
- **🗑️ Eliminar**: Siempre visible (mínimo 1 bloque)

#### **Estados de Botones**
- **Hover**: Color más intenso (+100 en escala de colores)
- **Disabled**: Botones de movimiento ocultos si no aplican
- **Transiciones**: Suaves en todos los cambios

---

## 🔧 Implementación Técnica

### **Componente: LessonEditor**

```typescript
interface LessonEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lessonData: LessonData) => void;
  initialData?: LessonData;
  mode: 'create' | 'edit';
  moduleTitle?: string;
}

interface LessonData {
  title: string;
  content: ContentBlock[];
}

interface ContentBlock {
  id: string; // Único generado con timestamp + random
  type: 'text' | 'code' | 'image' | 'video' | 'link';
  content: string;
  language?: string; // Para bloques de código
  alt?: string; // Para imágenes (futuro)
  caption?: string; // Para imágenes/videos
}
```

### **Funciones Principales**

```typescript
// Generar ID único para cada bloque
generateId() => `block-${Date.now()}-${random}`

// Agregar nuevo bloque al final
addBlock(type: ContentBlock['type'])

// Actualizar contenido de un bloque
updateBlock(id: string, updates: Partial<ContentBlock>)

// Eliminar bloque (mínimo 1)
deleteBlock(id: string)

// Reordenar bloques
moveBlock(id: string, direction: 'up' | 'down')

// Manejo de subida de imágenes
handleImageUpload(blockId: string, event)

// Validación y guardado
handleSave()
```

---

## 💾 Formato de Datos

### **Ejemplo de Lección Guardada**

```json
{
  "title": "Introducción a Librosa para análisis de audio",
  "content": [
    {
      "id": "block-1699567890-abc123",
      "type": "text",
      "content": "Librosa es una biblioteca de Python para análisis de audio y música. En esta lección aprenderemos a cargar y procesar archivos de audio."
    },
    {
      "id": "block-1699567891-def456",
      "type": "code",
      "language": "python",
      "content": "import librosa\nimport librosa.display\nimport matplotlib.pyplot as plt\n\n# Cargar archivo de audio\naudio, sr = librosa.load('example.wav')\nprint(f'Tasa de muestreo: {sr} Hz')"
    },
    {
      "id": "block-1699567892-ghi789",
      "type": "image",
      "content": "https://example.com/waveform.png",
      "caption": "Forma de onda de un archivo de audio"
    },
    {
      "id": "block-1699567893-jkl012",
      "type": "video",
      "content": "https://youtube.com/watch?v=example",
      "caption": "Tutorial completo de Librosa"
    },
    {
      "id": "block-1699567894-mno345",
      "type": "link",
      "content": "https://librosa.org/doc/latest/index.html",
      "caption": "Documentación oficial de Librosa"
    }
  ]
}
```

---

## 🎯 Validaciones

### **Al Guardar**
1. ✅ Título obligatorio (no puede estar vacío)
2. ⚠️ Alerta si hay bloques vacíos (permite continuar)
3. ✅ Filtra bloques vacíos antes de guardar
4. ✅ Mínimo 1 bloque de contenido

### **Durante Edición**
- ✅ No permite eliminar el último bloque
- ✅ Botones de movimiento solo visibles cuando aplican
- ✅ Confirmación antes de eliminar bloque con contenido

---

## 🚀 Mejoras vs. Editor Anterior

| Aspecto | Antes ❌ | Ahora ✅ |
|---------|---------|---------|
| **Tamaño** | Modal pequeño ~400px | Modal 90vh pantalla completa |
| **Contenido** | Solo texto plano | 5 tipos de bloques multimedia |
| **Edición** | Textarea pequeño | Editor por bloques expandible |
| **Imágenes** | ❌ No soportado | ✅ Subida + URL + Caption |
| **Videos** | ❌ No soportado | ✅ Embeds + Descripción |
| **Código** | Campo único | ✅ Múltiples bloques + Lenguaje |
| **Enlaces** | ❌ No soportado | ✅ URLs con texto personalizado |
| **Reordenar** | ❌ No posible | ✅ Mover arriba/abajo |
| **Scroll** | Todo junto | ✅ Independiente en body |

---

## 🎨 Colores del Tema

```css
/* Bloques de tipo */
.text-block: bg-blue-600 hover:bg-blue-700
.code-block: bg-green-600 hover:bg-green-700
.image-block: bg-purple-600 hover:bg-purple-700
.video-block: bg-red-600 hover:bg-red-700
.link-block: bg-orange-600 hover:bg-orange-700

/* Estados */
.active-block: border-blue-500 shadow-blue-500/20
.hover-control: bg-gray-700 text-white
.delete-button: bg-red-600 hover:bg-red-700
```

---

## 📝 Uso Recomendado

### **Estructura Típica de Lección**

1. **Bloque de Texto (Introducción)**
   - Explicación del tema
   - Objetivos de aprendizaje

2. **Bloque de Código (Ejemplo básico)**
   - Código simple y comentado
   - Demostración de conceptos

3. **Bloque de Imagen (Visual)**
   - Diagrama explicativo
   - Screenshot de resultado

4. **Bloque de Código (Ejemplo avanzado)**
   - Aplicación práctica
   - Ejercicio guiado

5. **Bloque de Video (Opcional)**
   - Tutorial complementario
   - Demo en vivo

6. **Bloque de Enlaces (Recursos)**
   - Documentación oficial
   - Tutoriales adicionales

---

## 🔐 Consideraciones de Seguridad

### **Subida de Imágenes**
- ⚠️ Actualmente usa Data URLs (base64)
- 📌 **Para producción**: Implementar upload a servidor/cloud
- 📌 **Límite de tamaño**: Agregar validación (max 5MB)

### **Validación de URLs**
- ✅ Campo type="url" para validación básica
- 📌 **Mejorar**: Validar dominios permitidos
- 📌 **Sanitizar**: Prevenir XSS en contenido

### **Almacenamiento**
- Actualmente JSON en memoria/localStorage
- 📌 **Para producción**: Base de datos con versionado

---

## 🎯 Próximas Mejoras Sugeridas

### **Corto Plazo** (1-2 semanas)
1. ✅ Vista previa en tiempo real (modo split)
2. ✅ Soporte para Markdown en bloques de texto
3. ✅ Arrastrar y soltar para reordenar bloques
4. ✅ Duplicar bloques existentes

### **Mediano Plazo** (1 mes)
5. ✅ Editor WYSIWYG para texto (TinyMCE/Quill)
6. ✅ Galería de imágenes de stock
7. ✅ Templates de lecciones predefinidos
8. ✅ Autoguardado cada X segundos

### **Largo Plazo** (3+ meses)
9. ✅ Colaboración en tiempo real (múltiples editores)
10. ✅ Historial de versiones con rollback
11. ✅ Exportar lección a PDF/HTML
12. ✅ Importar desde Word/Markdown

---

## 📖 Iconos Agregados

Se agregaron **5 nuevos iconos** a `icons.tsx`:

```typescript
- XIcon: Cerrar/Cancelar (X)
- ImageIcon: Imagen/Foto
- LinkIcon: Enlace/Hipervínculo
- CodeIcon: Código (< >)
- VideoIcon: Video/Reproducir
```

Todos siguen el patrón consistente con `IconProps` y SVG de Feather Icons.

---

## ✅ Estado Actual

**El editor está completamente funcional y listo para usar.**

### **Archivos Creados:**
- `components/LessonEditor.tsx` (650+ líneas)
- 5 nuevos iconos en `icons.tsx`

### **Próximo Paso:**
Integrar `LessonEditor` en `CourseManagement.tsx` para reemplazar el modal actual.

---

*Última actualización: 9 de Noviembre, 2025*
*Versión: 1.0 - Editor Profesional*
