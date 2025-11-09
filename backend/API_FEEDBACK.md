# API de Feedback - Documentación

## Endpoints de Feedback

### 1. POST /api/feedback - Crear Feedback (Profesor)

Crea una retroalimentación del profesor hacia un estudiante sobre una lección completada.

#### Endpoint
```
POST http://localhost:8080/api/feedback
```

### Headers
```
Content-Type: application/json
```

### Body (JSON)

#### Campos Requeridos:
- `content` (string): El comentario de retroalimentación. No puede estar vacío.
- `authorId` (number): El ID del profesor que crea el feedback. Debe ser un usuario con rol `PROFESSOR`.
- `progressId` (number): El ID del registro de progreso al que se refiere el feedback.

#### Campos Opcionales:
- `rating` (number | null): Calificación del 1 al 5. Si se omite, será `null`.

### Ejemplo de Request

#### Con rating:
```bash
curl -X POST http://localhost:8080/api/feedback \
  -H "Content-Type: application/json" \
  -d '{
    "content": "¡Excelente trabajo! Has entendido muy bien el concepto.",
    "authorId": 12,
    "progressId": 15,
    "rating": 5
  }'
```

#### Sin rating:
```bash
curl -X POST http://localhost:8080/api/feedback \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Recuerda revisar la sintaxis de las funciones.",
    "authorId": 12,
    "progressId": 16
  }'
```

### Respuestas

#### Éxito (201 Created)
```json
{
  "success": true,
  "data": {
    "id": 4,
    "createdAt": "2025-11-08T22:22:26.340Z",
    "updatedAt": "2025-11-08T22:22:26.340Z",
    "comment": "¡Excelente trabajo! Has entendido muy bien el concepto.",
    "rating": 5,
    "studentId": 11,
    "professorId": 12,
    "lessonId": 73,
    "progressId": 15,
    "student": {
      "id": 11,
      "name": "Estudiante Demo",
      "email": "estudiante@test.com"
    },
    "professor": {
      "id": 12,
      "name": "Profesor Demo",
      "email": "profesor@test.com"
    },
    "lesson": {
      "id": 73,
      "title": "Tu primer programa",
      "moduleId": 14
    },
    "progress": {
      "id": 15,
      "completed": true,
      "lastSubmittedCode": "print(\"Mi primer programa\")"
    }
  },
  "message": "Retroalimentación creada exitosamente"
}
```

#### Error: Campos requeridos faltantes (400 Bad Request)
```json
{
  "success": false,
  "error": "Campos requeridos: content, authorId, progressId"
}
```

#### Error: Contenido vacío (400 Bad Request)
```json
{
  "success": false,
  "error": "El contenido del feedback no puede estar vacío"
}
```

#### Error: Rating inválido (400 Bad Request)
```json
{
  "success": false,
  "error": "El rating debe ser un número entre 1 y 5"
}
```

#### Error: Progreso no encontrado (404 Not Found)
```json
{
  "success": false,
  "error": "No se encontró el progreso con ID 999"
}
```

#### Error: Usuario no es profesor (403 Forbidden)
```json
{
  "success": false,
  "error": "Solo los profesores pueden crear retroalimentación"
}
```

#### Error del servidor (500 Internal Server Error)
```json
{
  "success": false,
  "error": "Error al crear la retroalimentación",
  "details": "Mensaje de error específico"
}
```

## Validaciones Implementadas

1. ✅ **Campos requeridos**: Verifica que `content`, `authorId` y `progressId` estén presentes
2. ✅ **Contenido no vacío**: El campo `content` debe tener texto (no solo espacios)
3. ✅ **Rating válido**: Si se proporciona, debe ser un número entre 1 y 5
4. ✅ **Progreso existente**: Verifica que el `progressId` exista en la base de datos
5. ✅ **Rol de profesor**: Solo usuarios con rol `PROFESSOR` pueden crear feedback
6. ✅ **Extracción automática**: El endpoint obtiene automáticamente `studentId` y `lessonId` del registro de progreso

## Relaciones Incluidas en la Respuesta

El endpoint incluye automáticamente las siguientes relaciones:
- **student**: Información del estudiante (id, nombre, email)
- **professor**: Información del profesor (id, nombre, email)
- **lesson**: Información de la lección (id, título, moduleId)
- **progress**: Información del progreso (id, completed, lastSubmittedCode)

## Logging

Cuando se crea un feedback exitosamente, se registra en la consola:
```
💬 Feedback creado: ID 4 por Profesor Demo para Estudiante Demo en lección "Tu primer programa"
```

## Notas Técnicas

- El campo `rating` es opcional y puede ser `null`
- Los timestamps `createdAt` y `updatedAt` se generan automáticamente
- Las relaciones se cargan mediante `include` de Prisma para una sola query eficiente
- Se valida la existencia del progreso antes de crear el feedback
- Se verifica el rol del usuario para garantizar que solo profesores puedan crear feedback

---

### 2. GET /api/feedback/student/:studentId - Obtener Feedbacks del Estudiante

Obtiene todos los feedbacks recibidos por un estudiante específico.

#### Endpoint
```
GET http://localhost:8080/api/feedback/student/:studentId
```

#### Parámetros de URL
- `studentId` (number): El ID del estudiante del que se quieren obtener los feedbacks.

#### Headers
No requiere headers especiales.

#### Ejemplo de Request
```bash
curl http://localhost:8080/api/feedback/student/11
```

#### Respuestas

##### Éxito (200 OK)
```json
{
  "success": true,
  "data": [
    {
      "id": 5,
      "createdAt": "2025-11-08T22:23:14.393Z",
      "updatedAt": "2025-11-08T22:23:14.393Z",
      "comment": "Recuerda revisar la sintaxis de las funciones. Te envié algunos recursos adicionales.",
      "rating": null,
      "studentId": 11,
      "professorId": 12,
      "lessonId": 76,
      "progressId": 16,
      "professor": {
        "id": 12,
        "name": "Profesor Demo",
        "email": "profesor@test.com"
      },
      "lesson": {
        "id": 76,
        "title": "Entrada y salida",
        "moduleId": 14,
        "module": {
          "id": 14,
          "title": "Módulo 1: Introducción a Python"
        }
      },
      "progress": {
        "id": 16,
        "completed": true,
        "lastSubmittedCode": "nombre = input(\"Tu nombre: \")\nprint(f\"Hola {nombre}\")"
      }
    }
  ],
  "total": 5,
  "student": {
    "id": 11,
    "name": "Estudiante Demo",
    "email": "estudiante@test.com"
  }
}
```

##### Éxito sin feedbacks (200 OK)
```json
{
  "success": true,
  "data": [],
  "total": 0,
  "student": {
    "id": 13,
    "name": "Estudiante Nuevo",
    "email": "estudiante.nuevo@test.com"
  }
}
```

##### Error: ID inválido (400 Bad Request)
```json
{
  "success": false,
  "error": "El ID del estudiante debe ser un número válido"
}
```

##### Error: Estudiante no encontrado (404 Not Found)
```json
{
  "success": false,
  "error": "No se encontró el estudiante con ID 999"
}
```

##### Error del servidor (500 Internal Server Error)
```json
{
  "success": false,
  "error": "Error al obtener los feedbacks",
  "details": "Mensaje de error específico"
}
```

#### Características del Endpoint

1. ✅ **Validación de ID**: Verifica que el `studentId` sea un número válido
2. ✅ **Verificación de existencia**: Confirma que el estudiante existe en la base de datos
3. ✅ **Ordenamiento**: Los feedbacks se devuelven ordenados por fecha (más recientes primero)
4. ✅ **Relaciones completas**: Incluye información del profesor, lección (con módulo) y progreso
5. ✅ **Array vacío**: Si el estudiante no tiene feedbacks, devuelve un array vacío (no un error)

#### Relaciones Incluidas

El endpoint incluye automáticamente:
- **professor**: Información del profesor que creó el feedback (id, nombre, email)
- **lesson**: Información de la lección con su módulo padre (id, título, moduleId, module)
- **progress**: Información del progreso del estudiante (id, completed, lastSubmittedCode)

#### Logging

Cuando se consultan feedbacks exitosamente, se registra en la consola:
```
📖 Feedbacks encontrados para estudiante Estudiante Demo: 5
```

#### Casos de Uso

- Dashboard del estudiante mostrando todo su historial de retroalimentación
- Vista de una lección específica con los comentarios del profesor
- Sistema de notificaciones cuando el estudiante recibe nuevo feedback
- Estadísticas de progreso del estudiante basadas en ratings recibidos
