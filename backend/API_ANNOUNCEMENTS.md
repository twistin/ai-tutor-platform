# 📢 API de Anuncios - Documentación

## Sistema de Comunicación Profesor-Estudiantes

Este sistema permite a los profesores enviar anuncios, mensajes y notificaciones importantes a los estudiantes de forma centralizada.

---

## Modelo de Datos

### Announcement (Anuncio)

```typescript
interface Announcement {
  id: number;
  title: string;
  message: string;
  priority: 'high' | 'normal' | 'low';
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  professorId: number;
  professor: {
    id: number;
    name: string;
    email: string;
  };
  lessonId?: number | null;
  moduleId?: number | null;
}
```

### Campos

| Campo | Tipo | Descripción | Por defecto |
|-------|------|-------------|-------------|
| `id` | number | ID único del anuncio | Auto-incremento |
| `title` | string | Título del anuncio | Requerido |
| `message` | string | Contenido/mensaje del anuncio | Requerido |
| `priority` | string | Nivel de prioridad: "high", "normal", "low" | "normal" |
| `published` | boolean | Si el anuncio es visible para estudiantes | true |
| `createdAt` | Date | Fecha de creación | Auto |
| `updatedAt` | Date | Fecha de última actualización | Auto |
| `professorId` | number | ID del profesor que creó el anuncio | Requerido |
| `lessonId` | number? | ID de lección relacionada (opcional) | null |
| `moduleId` | number? | ID de módulo relacionado (opcional) | null |

---

## Endpoints

### 1. GET /api/announcements - Obtener Anuncios

Obtiene todos los anuncios. Por defecto, solo muestra los anuncios publicados. Los profesores pueden usar `?showAll=true` para ver todos (incluidos borradores).

#### Request

```http
GET http://localhost:8080/api/announcements
```

**Query Parameters:**
- `showAll` (boolean, opcional): Si es `true`, muestra todos los anuncios (incluidos no publicados)

#### Response Success (200 OK)

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "¡Bienvenidos al Curso de Python!",
      "message": "Hola estudiantes,\n\nEstoy muy emocionado...",
      "priority": "high",
      "published": true,
      "createdAt": "2025-11-08T23:15:00.000Z",
      "updatedAt": "2025-11-08T23:15:00.000Z",
      "professorId": 12,
      "professor": {
        "id": 12,
        "name": "Profesor Demo",
        "email": "profesor@test.com"
      },
      "lessonId": null,
      "moduleId": null
    }
  ],
  "total": 1
}
```

#### Ejemplos de Uso

**Estudiantes (solo publicados):**
```bash
curl http://localhost:8080/api/announcements
```

**Profesores (ver todos):**
```bash
curl "http://localhost:8080/api/announcements?showAll=true"
```

---

### 2. POST /api/announcements - Crear Anuncio

Crea un nuevo anuncio. Solo profesores pueden crear anuncios.

#### Request

```http
POST http://localhost:8080/api/announcements
Content-Type: application/json
```

**Body:**
```json
{
  "title": "Título del anuncio",
  "message": "Contenido del mensaje",
  "priority": "high",
  "published": true,
  "professorId": 12,
  "lessonId": null,
  "moduleId": null
}
```

**Campos requeridos:**
- `title` (string)
- `message` (string)
- `professorId` (number)

**Campos opcionales:**
- `priority` (string): "high" | "normal" | "low" - Default: "normal"
- `published` (boolean): Default: true
- `lessonId` (number | null)
- `moduleId` (number | null)

#### Response Success (201 Created)

```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Título del anuncio",
    "message": "Contenido del mensaje",
    "priority": "high",
    "published": true,
    "createdAt": "2025-11-08T23:15:00.000Z",
    "updatedAt": "2025-11-08T23:15:00.000Z",
    "professorId": 12,
    "professor": {
      "id": 12,
      "name": "Profesor Demo",
      "email": "profesor@test.com"
    },
    "lessonId": null,
    "moduleId": null
  },
  "message": "Anuncio creado exitosamente"
}
```

#### Errores

**400 Bad Request - Campos faltantes:**
```json
{
  "success": false,
  "error": "Faltan campos requeridos: title, message, professorId"
}
```

**404 Not Found - Profesor no existe:**
```json
{
  "success": false,
  "error": "No se encontró el profesor con ID 999"
}
```

**403 Forbidden - Usuario no es profesor:**
```json
{
  "success": false,
  "error": "Solo los profesores pueden crear anuncios"
}
```

#### Ejemplo

```bash
curl -X POST http://localhost:8080/api/announcements \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Nueva Lección Disponible",
    "message": "Ya pueden acceder a la lección sobre funciones en Python.",
    "priority": "normal",
    "published": true,
    "professorId": 12,
    "lessonId": 5
  }'
```

---

### 3. PUT /api/announcements/:id - Actualizar Anuncio

Actualiza un anuncio existente.

#### Request

```http
PUT http://localhost:8080/api/announcements/1
Content-Type: application/json
```

**Body:**
```json
{
  "title": "Título actualizado",
  "message": "Mensaje actualizado",
  "priority": "low",
  "published": false
}
```

**Campos opcionales (actualiza solo los proporcionados):**
- `title` (string)
- `message` (string)
- `priority` (string)
- `published` (boolean)

#### Response Success (200 OK)

```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Título actualizado",
    "message": "Mensaje actualizado",
    "priority": "low",
    "published": false,
    "createdAt": "2025-11-08T23:15:00.000Z",
    "updatedAt": "2025-11-08T23:20:00.000Z",
    "professorId": 12,
    "professor": {
      "id": 12,
      "name": "Profesor Demo",
      "email": "profesor@test.com"
    },
    "lessonId": null,
    "moduleId": null
  },
  "message": "Anuncio actualizado exitosamente"
}
```

#### Errores

**400 Bad Request - ID inválido:**
```json
{
  "success": false,
  "error": "El ID del anuncio debe ser un número válido"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "error": "No se encontró el anuncio con ID 999"
}
```

#### Ejemplo

```bash
curl -X PUT http://localhost:8080/api/announcements/1 \
  -H "Content-Type: application/json" \
  -d '{
    "published": false
  }'
```

---

### 4. DELETE /api/announcements/:id - Eliminar Anuncio

Elimina un anuncio permanentemente.

#### Request

```http
DELETE http://localhost:8080/api/announcements/1
```

#### Response Success (200 OK)

```json
{
  "success": true,
  "message": "Anuncio eliminado exitosamente"
}
```

#### Errores

**400 Bad Request:**
```json
{
  "success": false,
  "error": "El ID del anuncio debe ser un número válido"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "error": "No se encontró el anuncio con ID 999"
}
```

#### Ejemplo

```bash
curl -X DELETE http://localhost:8080/api/announcements/1
```

---

## Casos de Uso

### 1. Anuncio de Bienvenida

```javascript
const announcement = await fetch('http://localhost:8080/api/announcements', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: '¡Bienvenidos al Curso!',
    message: 'Hola a todos! Estoy emocionado de comenzar este viaje de aprendizaje.',
    priority: 'high',
    published: true,
    professorId: professorId
  })
});
```

### 2. Notificación sobre Nueva Lección

```javascript
const announcement = await fetch('http://localhost:8080/api/announcements', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Nueva Lección: Funciones',
    message: 'Ya está disponible la lección sobre funciones en Python.',
    priority: 'normal',
    published: true,
    professorId: professorId,
    lessonId: 5
  })
});
```

### 3. Anuncio Urgente

```javascript
const announcement = await fetch('http://localhost:8080/api/announcements', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: '⚠️ Cambio de Horario',
    message: 'IMPORTANTE: La clase de mañana se pospone una hora.',
    priority: 'high',
    published: true,
    professorId: professorId
  })
});
```

### 4. Borrador (No Publicado)

```javascript
const announcement = await fetch('http://localhost:8080/api/announcements', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Borrador: Examen Final',
    message: 'Detalles sobre el examen final...',
    priority: 'normal',
    published: false,  // No visible para estudiantes
    professorId: professorId
  })
});
```

### 5. Cambiar Visibilidad

```javascript
// Ocultar un anuncio
await fetch(`http://localhost:8080/api/announcements/${id}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ published: false })
});

// Publicar un borrador
await fetch(`http://localhost:8080/api/announcements/${id}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ published: true })
});
```

---

## Integración Frontend

### Componente React - StudentCommunication

El componente `StudentCommunication.tsx` proporciona:

#### Para Profesores:
- ✅ Vista completa de todos los anuncios (publicados y borradores)
- ✅ Formulario para crear nuevos anuncios
- ✅ Editar anuncios existentes
- ✅ Cambiar visibilidad (publicar/ocultar)
- ✅ Eliminar anuncios
- ✅ Indicadores visuales de prioridad
- ✅ Toggle para ver solo publicados o todos

#### Para Estudiantes:
- ✅ Vista de solo anuncios publicados
- ✅ Indicadores de prioridad con colores
- ✅ Información del profesor
- ✅ Fechas de publicación

### Características de UI

**Prioridades con colores:**
- 🔴 Alta (High): Fondo rojo, borde rojo
- 🟡 Normal: Fondo amarillo, borde amarillo
- 🔵 Baja (Low): Fondo azul, borde azul

**Estados:**
- ✅ Publicado: Verde, visible para estudiantes
- 📝 Borrador: Amarillo, solo visible para profesores

**Iconos:**
- 👁️ Ver/Publicado
- 👁️‍🗨️ Oculto/Borrador
- ✏️ Editar
- 🗑️ Eliminar
- ➕ Crear nuevo

---

## Testing

### Test 1: Crear anuncio como profesor
```bash
curl -X POST http://localhost:8080/api/announcements \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Anuncio",
    "message": "Mensaje de prueba",
    "priority": "normal",
    "published": true,
    "professorId": 12
  }' | jq
```

### Test 2: Listar anuncios (estudiantes)
```bash
curl http://localhost:8080/api/announcements | jq
```

### Test 3: Listar todos (profesores)
```bash
curl "http://localhost:8080/api/announcements?showAll=true" | jq
```

### Test 4: Actualizar anuncio
```bash
curl -X PUT http://localhost:8080/api/announcements/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Título Actualizado",
    "priority": "high"
  }' | jq
```

### Test 5: Ocultar anuncio
```bash
curl -X PUT http://localhost:8080/api/announcements/1 \
  -H "Content-Type: application/json" \
  -d '{"published": false}' | jq
```

### Test 6: Eliminar anuncio
```bash
curl -X DELETE http://localhost:8080/api/announcements/1 | jq
```

---

## Validaciones

### Backend

✅ **Validación de campos requeridos**
- title, message, professorId son obligatorios al crear

✅ **Validación de profesor**
- Verifica que el profesor existe
- Verifica que el usuario tiene rol PROFESSOR

✅ **Validación de IDs**
- IDs deben ser números válidos
- Verifica existencia del anuncio al actualizar/eliminar

✅ **Valores por defecto**
- priority: "normal" si no se especifica
- published: true si no se especifica

### Frontend

✅ **Formulario validado**
- Campos title y message requeridos
- Selector de prioridad con 3 opciones
- Toggle publicado/borrador

✅ **Permisos basados en rol**
- Solo profesores ven formulario y botones de acción
- Estudiantes solo ven anuncios publicados

✅ **Confirmación de eliminación**
- Diálogo de confirmación antes de eliminar

---

## Logs en Consola

### Crear anuncio:
```
✅ Anuncio creado: "Nueva Lección Disponible" por Profesor Demo
```

### Obtener anuncios:
```
📢 Anuncios obtenidos: 3
```

### Actualizar anuncio:
```
✏️ Anuncio actualizado: ID 1
```

### Eliminar anuncio:
```
🗑️ Anuncio eliminado: ID 1
```

---

## Mejoras Futuras

### Notificaciones en Tiempo Real
- [ ] WebSocket para notificar a estudiantes de nuevos anuncios
- [ ] Badge con contador de anuncios no leídos
- [ ] Sistema de "marcar como leído"

### Filtros Avanzados
- [ ] Filtrar por prioridad
- [ ] Filtrar por fecha
- [ ] Búsqueda por título/contenido
- [ ] Filtrar por lección/módulo

### Categorías
- [ ] Categorías de anuncios (general, examen, tarea, etc.)
- [ ] Iconos personalizados por categoría

### Adjuntos
- [ ] Permitir adjuntar archivos a los anuncios
- [ ] Links a recursos externos

### Destinatarios
- [ ] Enviar anuncios a estudiantes específicos
- [ ] Grupos de estudiantes
- [ ] Notificaciones por email

### Reacciones
- [ ] Estudiantes pueden reaccionar (👍, ❤️, etc.)
- [ ] Comentarios en anuncios

### Estadísticas
- [ ] Tracking de quién vio cada anuncio
- [ ] Tiempo promedio de lectura
- [ ] Analytics del profesor

---

## Resumen

**Sistema de Anuncios Completo:**
- ✅ Modelo de datos en Prisma
- ✅ 4 endpoints RESTful (GET, POST, PUT, DELETE)
- ✅ Validaciones completas
- ✅ UI completa en React con formularios
- ✅ Permisos basados en roles
- ✅ Estados: publicado/borrador
- ✅ 3 niveles de prioridad
- ✅ Timestamps automáticos
- ✅ Relación con profesor

**¡El profesor ahora puede comunicarse efectivamente con sus estudiantes!** 📢
