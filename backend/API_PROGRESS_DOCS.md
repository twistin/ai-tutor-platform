# 📊 API de Progreso - Documentación

## ✅ Fase 2 Completada: Endpoints de la API

### 🎯 Endpoint Implementado

#### **POST** `/api/progress/complete`
Marca una lección como completada para un estudiante.

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "userId": 1,          // ID del usuario (requerido, número)
  "lessonId": 5,        // ID de la lección (requerido, número)
  "lastSubmittedCode": "print('Hola')" // Código enviado (opcional, string)
}
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "message": "Progreso actualizado correctamente",
  "data": {
    "id": 4,
    "userId": 1,
    "lessonId": 5,
    "completed": true,
    "lastSubmittedCode": "print('Hola')",
    "createdAt": "2025-11-08T11:38:11.927Z",
    "updatedAt": "2025-11-08T11:38:11.927Z",
    "user": {
      "id": 1,
      "email": "estudiante@test.com",
      "name": "Estudiante Demo",
      "role": "STUDENT"
    },
    "lesson": {
      "id": 5,
      "title": "Entrada y salida",
      "moduleId": "modulo1",
      "order": 5
    }
  }
}
```

**Respuesta de Error (400):**
```json
{
  "error": "userId y lessonId son requeridos"
}
```

**Respuesta de Error (500):**
```json
{
  "error": "Error al actualizar el progreso",
  "details": "Mensaje de error específico"
}
```

---

## 🧪 Tests Ejecutados

### ✅ Test 1: Crear Nuevo Progreso
- **Usuario:** 1 (Estudiante Demo)
- **Lección:** 5 (Entrada y salida)
- **Resultado:** ✅ Progreso creado con `completed: true`

### ✅ Test 2: Actualizar Progreso Existente
- **Usuario:** 1 (Estudiante Demo)
- **Lección:** 1 (¿Qué es Python?)
- **Resultado:** ✅ Progreso actualizado con nuevo código
- **Verificación:** `updatedAt` cambió de `11:34:40` a `11:38:19`

### ✅ Test 3: Error - Missing userId
- **Body:** `{"lessonId": 1}`
- **Resultado:** ✅ Error `400` con mensaje apropiado

### ✅ Test 4: Error - Invalid Type
- **Body:** `{"userId": "texto", "lessonId": 1}`
- **Resultado:** ✅ Error `400` con mensaje de validación

---

## 🔧 Características Técnicas

### **Upsert Pattern**
El endpoint usa `prisma.progress.upsert()` para:
- **Crear** el registro si no existe (`userId` + `lessonId` únicos)
- **Actualizar** el registro si ya existe

### **Validaciones**
1. ✅ Validación de campos requeridos (`userId`, `lessonId`)
2. ✅ Validación de tipos (deben ser números)
3. ✅ Manejo de errores con try-catch
4. ✅ Mensajes de error descriptivos

### **Relaciones Incluidas**
El endpoint devuelve:
- ✅ Datos completos del usuario (sin password)
- ✅ Datos completos de la lección
- ✅ Información de progreso con timestamps

---

## 📁 Archivos Creados

### 1. `backend/src/index.ts`
- ✅ Inicialización de `PrismaClient`
- ✅ Endpoint POST `/api/progress/complete`
- ✅ Manejo de cierre limpio de Prisma

### 2. `backend/prisma/seed.ts`
- ✅ Script de seed con usuarios de prueba
- ✅ 14 lecciones creadas (módulos 1, 2 y 3)
- ✅ 3 registros de progreso iniciales

### 3. `backend/test-api.http`
- ✅ Colección de tests para VS Code REST Client
- ✅ Tests de casos exitosos y errores

### 4. `backend/test-api.sh`
- ✅ Script bash para tests automatizados
- ✅ Formato JSON con `json_pp`

---

## 🗄️ Base de Datos

### Estado Actual
```
Usuarios: 2
  - ID: 1 | estudiante@test.com | STUDENT
  - ID: 2 | profesor@test.com | PROFESSOR

Lecciones: 14
  - Módulo 1: 5 lecciones
  - Módulo 2: 4 lecciones
  - Módulo 3: 5 lecciones

Progreso: 4 registros
  - Usuario 1: 4 lecciones completadas
```

---

## 🚀 Comandos Útiles

### Iniciar el servidor
```bash
cd backend
npm run dev
```

### Ejecutar seed
```bash
cd backend
npm run prisma:seed
```

### Ver base de datos (Prisma Studio)
```bash
cd backend
npm run prisma:studio
```

### Ejecutar tests
```bash
cd backend
./test-api.sh
```

---

## 📊 Próximos Pasos (Fase 3)

### Endpoints para el Profesor
1. **GET** `/api/progress/:userId` - Ver progreso de un estudiante
2. **GET** `/api/progress/all` - Ver progreso de todos los estudiantes
3. **GET** `/api/lessons` - Listar todas las lecciones
4. **GET** `/api/users/students` - Listar todos los estudiantes

### Autenticación
- Implementar JWT para proteger endpoints
- Login y registro de usuarios
- Middleware de autenticación

### Mejoras
- Paginación en listados
- Filtros y ordenamiento
- Estadísticas de progreso
