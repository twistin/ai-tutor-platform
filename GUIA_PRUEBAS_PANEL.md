# 🧪 Guía de Pruebas - Panel Profesional del Profesor

## 🚀 Iniciar la Aplicación

### Verificar que los servidores estén corriendo:

```bash
# 1. Backend (puerto 8080)
curl http://localhost:8080/health

# 2. Frontend (puerto 3000)
curl http://localhost:3000
```

**Si no están corriendo:**
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend  
npm run dev
```

---

## 🎬 Flujo de Prueba Completo

### **PASO 1: Acceder como Profesor** 👨‍🏫

1. Abrir navegador en: **http://localhost:3000**
2. Click en botón **"Entrar como Profesor"** (color morado/violeta)
3. Deberías ver el nuevo **Panel Profesional** con navegación superior

---

### **PASO 2: Explorar Panel General** 📊

**Qué ver:**
- ✅ 6 tarjetas de estadísticas en la parte superior:
  - 👥 Total Estudiantes (azul)
  - 📚 Total Lecciones (morado)
  - 📦 Total Módulos (verde)
  - 💬 Mensajes Pendientes (naranja, con badge si hay)
  - ✅ Estudiantes Activos (cyan)
  - 📈 Tasa de Completitud (índigo)

- ✅ Panel de **"Acciones Rápidas"** con 3 botones:
  - 📝 Crear Nueva Lección
  - 📢 Nuevo Anuncio
  - 💬 Ver Mensajes

- ✅ **Feed de Actividad Reciente** (últimas 5 acciones)

**Pruebas:**
- [ ] Las estadísticas muestran números reales del backend
- [ ] El botón "🔄 Actualizar" recarga las estadísticas
- [ ] Los botones de acciones rápidas son clicables

---

### **PASO 3: Navegar a Gestión de Contenido** 📝

**Cómo llegar:**
- Click en tab **"Gestión de Contenido"** (segunda opción en navegación)

**Qué ver:**
- ✅ Componente `CourseManagement` existente
- ✅ Lista de módulos y lecciones
- ✅ Botones de crear, editar, eliminar

**Pruebas:**
- [ ] Se renderiza el componente de gestión de contenido
- [ ] Puedes expandir/colapsar módulos
- [ ] Botones de edición funcionan

---

### **PASO 4: Explorar Comunicación** 💬

**Cómo llegar:**
- Click en tab **"Comunicación"** (tercera opción, puede tener badge verde)

**Qué ver:**
- ✅ Dual-tab interface:
  - **📢 Anuncios** (tab izquierdo)
  - **💬 Mensajes de Estudiantes** (tab derecho, con contador)

**Pruebas en Anuncios:**
- [ ] Ver lista de anuncios existentes
- [ ] Click en "➕ Crear Anuncio"
- [ ] Modal se abre con formulario
- [ ] Crear anuncio de prueba:
  - Título: "Prueba de anuncio profesional"
  - Contenido: "Este es un anuncio desde el nuevo panel"
  - Prioridad: Alta
  - Categoría: General
- [ ] Verificar que aparece en la lista
- [ ] Probar botones de editar ✏️ y eliminar 🗑️

**Pruebas en Mensajes:**
- [ ] Click en tab "💬 Mensajes de Estudiantes"
- [ ] Ver lista de mensajes (debería haber 2 de prueba)
- [ ] Estados visibles: PENDIENTE (amarillo) / RESPONDIDO (verde)
- [ ] Click en "Responder" en un mensaje pendiente
- [ ] Campo de texto aparece
- [ ] Escribir respuesta: "Gracias por tu mensaje, estoy revisando"
- [ ] Click en "Enviar Respuesta"
- [ ] Estado cambia a RESPONDIDO

---

### **PASO 5: Analizar Analíticas** 📈

**Cómo llegar:**
- Click en tab **"Analíticas"** (cuarta opción, icono de gráfico)

**Qué ver:**

#### **Sección Superior: Estadísticas Generales**
- ✅ 3 tarjetas grandes:
  - 👥 Estudiantes (total + activos)
  - ✅ Completitud Promedio %
  - ⏰ Necesitan Atención (estudiantes en riesgo)

#### **Tabla de Progreso Individual**
- ✅ Columnas:
  - Estudiante (nombre + email)
  - Estado (badge: Activo 🟢 / Inactivo ⏸️ / En Riesgo 🔴)
  - Progreso (barra visual coloreada)
  - Lecciones (completadas/totales)
  - Promedio (calificación con color)
  - Última Actividad (formato relativo)
  - Acciones (botón "Ver Detalle")

#### **Rendimiento por Lección**
- ✅ Tarjetas por cada lección mostrando:
  - Tasa de Completitud %
  - Tiempo Promedio (minutos)
  - Dificultad Percibida (emoji + color)

**Pruebas:**
- [ ] Filtros funcionan:
  - Click en "Todos" → Muestra todos los estudiantes
  - Click en "Activos" → Filtra solo activos
  - Click en "⚠️ En Riesgo" → Filtra estudiantes con bajo progreso
- [ ] Botón "🔄 Actualizar" recarga datos del backend
- [ ] Barra de progreso tiene color según porcentaje:
  - 🟢 Verde: ≥75%
  - 🟡 Amarillo: 50-74%
  - 🟠 Naranja: 25-49%
  - 🔴 Rojo: <25%
- [ ] Scroll funciona si hay muchas lecciones

---

### **PASO 6: Explorar Biblioteca de Recursos** 📚

**Cómo llegar:**
- Click en tab **"Biblioteca"** (quinta opción, icono de carpeta)

**Qué ver:**

#### **Header**
- ✅ Título: "📚 Biblioteca de Contenidos"
- ✅ Botón "➕ Subir Recurso" (azul, esquina superior derecha)
- ✅ Barra de búsqueda (con icono de lupa 🔍)
- ✅ Filtros por tipo:
  - Todos
  - PDF 📄
  - IMAGE 🖼️
  - CODE 💻
  - LINK 🔗
  - VIDEO 🎥

#### **Estadísticas Rápidas**
- ✅ 5 tarjetas pequeñas mostrando:
  - Total de recursos
  - Contador por cada tipo

#### **Grid de Recursos** (3 recursos mock)
Cada tarjeta muestra:
- ✅ Icono grande del tipo (📄/🖼️/💻/🔗/🎥)
- ✅ Título del recurso
- ✅ Badge de tipo (color según categoría)
- ✅ Descripción
- ✅ Tags (#variables, #bucles, etc.)
- ✅ Metadata:
  - Categoría
  - Tamaño del archivo
  - Fecha de subida
  - Lecciones asociadas
- ✅ Botones de acción:
  - "Ver/Descargar" (azul)
  - "🗑️ Eliminar" (rojo)

**Pruebas:**

**Búsqueda:**
- [ ] Escribir "Variables" en barra de búsqueda
- [ ] Ver que filtra solo el recurso "Guía de Variables en Python"
- [ ] Borrar búsqueda → Vuelven todos los recursos

**Filtros:**
- [ ] Click en "PDF 📄"
- [ ] Ver solo recursos de tipo PDF
- [ ] Click en "CODE 💻"
- [ ] Ver solo recursos de código
- [ ] Click en "Todos"
- [ ] Ver todos los recursos nuevamente

**Subir Recurso:**
- [ ] Click en botón "➕ Subir Recurso"
- [ ] Modal se abre con formulario:
  - Título
  - Tipo (dropdown)
  - Categoría
  - Descripción
  - Archivo (file input)
- [ ] Llenar formulario de prueba:
  - Título: "Mi Recurso de Prueba"
  - Tipo: PDF
  - Categoría: "ejercicios"
  - Descripción: "Recurso de prueba del panel profesional"
- [ ] Seleccionar cualquier archivo
- [ ] Ver spinner "Subiendo archivo..."
- [ ] Recurso aparece en el grid
- [ ] Click en "🗑️ Eliminar" para limpiarlo

---

## 🎯 Checklist de Funcionalidades

### **Panel General** ✅
- [ ] 6 tarjetas de estadísticas con datos reales
- [ ] Botón de actualizar recarga datos
- [ ] Acciones rápidas (3 botones)
- [ ] Feed de actividad reciente

### **Gestión de Contenido** ✅
- [ ] Renderiza componente CourseManagement
- [ ] CRUD de módulos funciona
- [ ] CRUD de lecciones funciona

### **Comunicación** ✅
- [ ] Dual-tab interface visible
- [ ] Tab Anuncios: Crear, editar, eliminar
- [ ] Tab Mensajes: Ver, responder, eliminar
- [ ] Badge de pendientes actualizado

### **Analíticas** ✅
- [ ] Estadísticas generales (3 tarjetas)
- [ ] Tabla de estudiantes con filtros
- [ ] Estado visual (Activo/Inactivo/En Riesgo)
- [ ] Barra de progreso coloreada
- [ ] Rendimiento por lección
- [ ] Dificultad percibida automática

### **Biblioteca** ✅
- [ ] Búsqueda en tiempo real funciona
- [ ] Filtros por tipo funcionan
- [ ] Grid de recursos renderiza
- [ ] Metadata completa visible
- [ ] Modal de subida funciona
- [ ] Botones de acción funcionan

---

## 🐛 Troubleshooting

### **Problema: "Failed to fetch"**
**Solución:**
```bash
# Verificar backend
curl http://localhost:8080/health

# Si no responde, reiniciar
cd backend && npm run dev
```

### **Problema: Estadísticas en 0**
**Solución:**
```bash
# Verificar datos en base de datos
cd backend
sqlite3 dev.db "SELECT COUNT(*) FROM users WHERE role='STUDENT';"
sqlite3 dev.db "SELECT COUNT(*) FROM lessons;"
```

### **Problema: Componentes no se encuentran**
**Solución:**
```bash
# Reiniciar frontend (limpia cache de TypeScript)
# Ctrl+C en terminal del frontend
npm run dev
```

### **Problema: Iconos no se ven**
**Solución:**
- Verificar que `icons.tsx` tiene exportados:
  - ChartBarIcon
  - FolderIcon
  - UsersIcon
  - DownloadIcon
  - SearchIcon

---

## 📸 Screenshots Esperados

### **Panel General**
```
┌─────────────────────────────────────────────────────┐
│  🏠 Panel General  📝 Contenido  💬 Comunicación  ... │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐           │
│  │  👥  │  │  📚  │  │  📦  │  │  💬  │           │
│  │  1   │  │  14  │  │  3   │  │  0   │           │
│  └──────┘  └──────┘  └──────┘  └──────┘           │
│                                                     │
│  ┌─ Acciones Rápidas ─────────────────────┐        │
│  │  📝 Crear Lección  📢 Nuevo Anuncio    │        │
│  └─────────────────────────────────────────┘        │
│                                                     │
│  ┌─ Actividad Reciente ───────────────────┐        │
│  │  • Nuevo anuncio publicado - Hace 1h   │        │
│  │  • Lección actualizada - Hace 3h       │        │
│  └─────────────────────────────────────────┘        │
└─────────────────────────────────────────────────────┘
```

### **Analíticas**
```
┌─────────────────────────────────────────────────────┐
│  📊 Panel de Analíticas                    🔄       │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─ Progreso Individual ─────────────────────────┐ │
│  │  Nombre    Estado     Progreso    Lecciones   │ │
│  │  ──────────────────────────────────────────── │ │
│  │  Juan      🟢 Activo  ████▒▒▒▒ 45%   6/14    │ │
│  │  María     🔴 Riesgo  ██▒▒▒▒▒▒ 20%   3/14    │ │
│  └─────────────────────────────────────────────── ┘ │
└─────────────────────────────────────────────────────┘
```

### **Biblioteca**
```
┌─────────────────────────────────────────────────────┐
│  📚 Biblioteca de Contenidos           ➕ Subir     │
│  🔍 [Buscar recursos...]                            │
│  [Todos] [PDF] [IMAGE] [CODE] [LINK] [VIDEO]       │
├─────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │ 📄       │  │ 💻       │  │ 🎥       │          │
│  │ Variables│  │ Ejerc...│  │ Tutorial│          │
│  │ PDF      │  │ CODE     │  │ VIDEO    │          │
│  └──────────┘  └──────────┘  └──────────┘          │
└─────────────────────────────────────────────────────┘
```

---

## ✅ Criterios de Éxito

**El panel está funcionando correctamente si:**

1. ✅ Todos los 5 tabs son navegables
2. ✅ Las estadísticas muestran números del backend
3. ✅ La tabla de analíticas tiene filtros funcionales
4. ✅ La búsqueda en biblioteca funciona en tiempo real
5. ✅ Los modales se abren y cierran correctamente
6. ✅ Los badges de pendientes se actualizan
7. ✅ Los colores son consistentes (tema oscuro)
8. ✅ No hay errores en consola del navegador
9. ✅ No hay errores en backend (terminal)
10. ✅ Todas las animaciones son suaves

---

**🎉 ¡Disfruta tu nuevo panel profesional!**

*Si encuentras algún problema, verifica primero los endpoints del backend con curl.*
