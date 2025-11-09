# 📊 API de Historial de IA - Documentación

## GET /api/student/:id/ai_logs - Historial de Consultas de IA

Obtiene el historial completo de consultas de IA (críticas de código) de un estudiante específico. Este es el **"Súper-Poder"** del profesor para entender cómo sus alumnos están usando la asistencia de IA.

### Endpoint
```
GET http://localhost:8080/api/student/:id/ai_logs
```

### Parámetros de URL
- `id` (number): El ID del estudiante (`userId`) del que se quieren obtener los logs.

### Headers
No requiere headers especiales.

### Ejemplo de Request
```bash
curl http://localhost:8080/api/student/11/ai_logs
```

### Respuestas

#### Éxito (200 OK)
```json
{
  "success": true,
  "data": [
    {
      "id": 21,
      "createdAt": "2025-11-08T22:52:42.000Z",
      "code": "for i in range(5):\n    print i",
      "critique": "¡Buen intento! Revisa la línea 2. En Python 3, print es una función. ¿Qué le falta?",
      "codeLength": 32,
      "critiqueLength": 89
    },
    {
      "id": 18,
      "createdAt": "2025-11-08T22:15:32.572Z",
      "code": null,
      "critique": null,
      "codeLength": 0,
      "critiqueLength": 0
    }
  ],
  "total": 2,
  "student": {
    "id": 11,
    "name": "Estudiante Demo",
    "email": "estudiante@test.com"
  }
}
```

#### Éxito sin logs (200 OK)
Cuando el estudiante no ha usado la crítica de IA:
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

#### Error: ID inválido (400 Bad Request)
```json
{
  "success": false,
  "error": "El ID del estudiante debe ser un número válido"
}
```

#### Error: Estudiante no encontrado (404 Not Found)
```json
{
  "success": false,
  "error": "No se encontró el estudiante con ID 999"
}
```

#### Error del servidor (500 Internal Server Error)
```json
{
  "success": false,
  "error": "Error al obtener los logs de IA",
  "details": "Mensaje de error específico"
}
```

## Estructura de los Datos

### Objeto Log
Cada elemento del array `data` contiene:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | number | ID único del log en ActivityLog |
| `createdAt` | string (ISO 8601) | Timestamp de cuándo se hizo la consulta |
| `code` | string \| null | Código Python que el estudiante envió |
| `critique` | string \| null | Crítica/pista que la IA devolvió |
| `codeLength` | number | Longitud del código (en caracteres) |
| `critiqueLength` | number | Longitud de la crítica (en caracteres) |

**Nota**: `code` y `critique` pueden ser `null` si:
- El log es antiguo (antes de Prompt 3.2)
- Hubo error al parsear el JSON
- El formato del `details` es diferente

## Características del Endpoint

### ✅ Validaciones
1. **ID válido**: Verifica que el `:id` sea un número
2. **Estudiante existe**: Confirma que el estudiante está en la base de datos
3. **Array vacío**: Si no hay logs, devuelve array vacío (no error)

### ✅ Ordenamiento
Los logs se devuelven ordenados por `createdAt` descendente (más recientes primero).

### ✅ Parsing Seguro
- Intenta parsear el campo `details` (JSON string)
- Si falla el parsing, establece valores null
- Registra advertencia en consola pero no falla la petición

### ✅ Información Completa
Incluye:
- Todos los logs de tipo `AI_QUERY_ASKED`
- Información del estudiante (id, nombre, email)
- Total de consultas realizadas

## Casos de Uso

### 1. Dashboard del Profesor
Ver lista de estudiantes y cuántas veces cada uno ha usado la IA:

```typescript
// 1. Obtener lista de estudiantes
const students = await fetch('/api/students').then(r => r.json());

// 2. Para cada estudiante, obtener sus logs
for (const student of students) {
  const logs = await fetch(`/api/student/${student.id}/ai_logs`).then(r => r.json());
  console.log(`${student.name}: ${logs.total} consultas`);
}
```

### 2. Análisis Individual
Ver detalles de las consultas de un estudiante específico:

```typescript
const studentId = 11;
const response = await fetch(`/api/student/${studentId}/ai_logs`);
const { data, total, student } = await response.json();

console.log(`${student.name} ha usado la IA ${total} veces`);

data.forEach((log, index) => {
  console.log(`\nConsulta ${index + 1}:`);
  console.log(`Fecha: ${new Date(log.createdAt).toLocaleString()}`);
  console.log(`Código (${log.codeLength} caracteres):`);
  console.log(log.code);
  console.log(`\nCrítica recibida:`);
  console.log(log.critique);
});
```

### 3. Identificar Patrones de Errores
Analizar qué tipo de errores comete cada estudiante:

```typescript
const { data } = await fetch(`/api/student/${studentId}/ai_logs`).then(r => r.json());

const patterns = {
  syntaxErrors: 0,
  indentationIssues: 0,
  logicErrors: 0
};

data.forEach(log => {
  if (log.critique?.includes('sintaxis')) patterns.syntaxErrors++;
  if (log.critique?.includes('indentación')) patterns.indentationIssues++;
  if (log.critique?.includes('lógica')) patterns.logicErrors++;
});

console.log('Patrones detectados:', patterns);
```

### 4. Monitorear Progreso
Ver si un estudiante está mejorando con el tiempo:

```typescript
const { data } = await fetch(`/api/student/${studentId}/ai_logs`).then(r => r.json());

// Comparar consultas antiguas vs recientes
const recentLogs = data.slice(0, 5);  // últimas 5
const oldLogs = data.slice(-5);       // primeras 5

const avgRecentCodeLength = recentLogs.reduce((sum, log) => sum + log.codeLength, 0) / recentLogs.length;
const avgOldCodeLength = oldLogs.reduce((sum, log) => sum + log.codeLength, 0) / oldLogs.length;

console.log('El estudiante está escribiendo código', 
  avgRecentCodeLength > avgOldCodeLength ? 'más complejo' : 'más simple');
```

### 5. Detectar Estudiantes en Riesgo
Identificar estudiantes que usan mucho la IA (pueden estar luchando):

```typescript
const students = await fetch('/api/students').then(r => r.json());

const studentsWithLogs = await Promise.all(
  students.map(async (student) => {
    const logs = await fetch(`/api/student/${student.id}/ai_logs`).then(r => r.json());
    return { ...student, aiUsage: logs.total };
  })
);

const studentsAtRisk = studentsWithLogs
  .filter(s => s.aiUsage > 10)  // más de 10 consultas
  .sort((a, b) => b.aiUsage - a.aiUsage);

console.log('Estudiantes que pueden necesitar ayuda adicional:', studentsAtRisk);
```

## Logging en Consola

Cuando se consultan los logs exitosamente, se registra:
```
📖 Logs de IA encontrados para Estudiante Demo: 2
```

Si hay error al parsear un log individual:
```
⚠️ No se pudo parsear details del log 18
```
*Nota: Esto no impide que el endpoint funcione correctamente.*

## Comparación con Otros Endpoints

### vs. POST /api/gemini/critique
- **Critique**: Crea una nueva consulta de IA
- **ai_logs**: Lee el historial de consultas pasadas

### vs. GET /api/feedback/student/:studentId
- **Feedback**: Retroalimentación humana del profesor
- **ai_logs**: Retroalimentación automatizada de la IA

### vs. GET /api/dashboard/overview
- **Dashboard**: Vista general de todos los estudiantes
- **ai_logs**: Vista detallada de un estudiante específico

## Consideraciones de Privacidad

### ⚠️ Datos Sensibles
Este endpoint expone:
- Código escrito por el estudiante
- Críticas recibidas de la IA
- Timestamps de actividad

### 🔒 Recomendaciones
1. **Autenticación**: Implementar verificación de que el solicitante es un profesor
2. **Autorización**: Verificar que el profesor tiene permiso para ver ese estudiante
3. **GDPR**: Asegurar consentimiento del estudiante para almacenar su código
4. **Retención**: Considerar limitar el historial a X días/meses

### Ejemplo de Autorización (Futuro)
```typescript
app.get('/api/student/:id/ai_logs', async (req, res) => {
  // Verificar que quien hace la petición es profesor
  const professorId = req.headers['x-user-id'];
  const professor = await prisma.user.findUnique({ where: { id: professorId } });
  
  if (!professor || professor.role !== 'PROFESSOR') {
    return res.status(403).json({ error: 'Solo profesores pueden acceder' });
  }
  
  // Continuar con la lógica...
});
```

## Análisis de Rendimiento

### Consulta Eficiente
El endpoint usa:
- `findMany` con filtros específicos (userId + eventType)
- Índices en `userId` y `eventType` (definidos en schema.prisma)
- Ordenamiento por `createdAt` (también indexado)

### Tiempo de Respuesta Esperado
- **<10 logs**: ~50ms
- **10-100 logs**: ~100ms
- **100+ logs**: ~200-500ms

### Optimización (Si Necesario)
Para estudiantes con muchos logs (>100):
```typescript
// Agregar paginación
app.get('/api/student/:id/ai_logs', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  
  const aiLogs = await prisma.activityLog.findMany({
    where: { userId: studentId, eventType: 'AI_QUERY_ASKED' },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: skip
  });
  
  // ...
});
```

## Testing

### Test 1: Estudiante con logs
```bash
curl http://localhost:8080/api/student/11/ai_logs | jq '.total'
# Esperado: número > 0
```

### Test 2: Estudiante sin logs
```bash
curl http://localhost:8080/api/student/13/ai_logs | jq '.total'
# Esperado: 0
```

### Test 3: ID inválido
```bash
curl http://localhost:8080/api/student/abc/ai_logs | jq '.error'
# Esperado: "El ID del estudiante debe ser un número válido"
```

### Test 4: Estudiante no existe
```bash
curl http://localhost:8080/api/student/999/ai_logs | jq '.error'
# Esperado: "No se encontró el estudiante con ID 999"
```

### Test 5: Verificar orden (más recientes primero)
```bash
curl http://localhost:8080/api/student/11/ai_logs | jq '.data[0].createdAt, .data[1].createdAt'
# Esperado: primera fecha > segunda fecha
```

## Integración Frontend

### Componente React de Ejemplo
```typescript
import { useState, useEffect } from 'react';

interface AILog {
  id: number;
  createdAt: string;
  code: string | null;
  critique: string | null;
  codeLength: number;
  critiqueLength: number;
}

interface StudentAILogsResponse {
  success: boolean;
  data: AILog[];
  total: number;
  student: {
    id: number;
    name: string;
    email: string;
  };
}

function StudentAILogs({ studentId }: { studentId: number }) {
  const [logs, setLogs] = useState<AILog[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentName, setStudentName] = useState('');

  useEffect(() => {
    fetch(`http://localhost:8080/api/student/${studentId}/ai_logs`)
      .then(res => res.json())
      .then((data: StudentAILogsResponse) => {
        setLogs(data.data);
        setStudentName(data.student.name);
        setLoading(false);
      });
  }, [studentId]);

  if (loading) return <div>Cargando...</div>;

  return (
    <div>
      <h2>Historial de IA - {studentName}</h2>
      <p>Total de consultas: {logs.length}</p>
      
      {logs.map(log => (
        <div key={log.id} className="log-card">
          <small>{new Date(log.createdAt).toLocaleString()}</small>
          
          {log.code && (
            <>
              <h4>Código:</h4>
              <pre>{log.code}</pre>
            </>
          )}
          
          {log.critique && (
            <>
              <h4>Crítica de IA:</h4>
              <p>{log.critique}</p>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
```

## Próximas Mejoras

Ideas para futuras versiones:
- [ ] Paginación para estudiantes con muchos logs
- [ ] Filtros por rango de fechas
- [ ] Estadísticas agregadas (promedio de codeLength, etc.)
- [ ] Exportar logs a CSV/PDF para reportes
- [ ] Comparar logs entre estudiantes (anónimamente)
- [ ] Detección automática de patrones de errores comunes
- [ ] Alertas cuando un estudiante usa demasiado la IA

## Resumen

**¿Qué hace este endpoint?**
Le da al profesor visibilidad completa de cómo sus estudiantes están usando la crítica de código por IA.

**¿Por qué es útil?**
- Identificar estudiantes que necesitan más ayuda
- Detectar patrones de errores comunes
- Evaluar efectividad de la IA
- Monitorear progreso individual

**¿Qué incluye?**
- Código que el estudiante envió
- Crítica que la IA devolvió
- Métricas (longitud, fecha)
- Información del estudiante

**El "Súper-Poder" del profesor está activado! 🦸‍♂️**
