# 📊 Sistema de Activity Logging con IA - Documentación

## Resumen del Sistema

El sistema de Activity Logging registra automáticamente todas las interacciones importantes de los estudiantes con la plataforma, incluyendo el uso de la crítica de código por IA.

## Estructura de ActivityLog

### Modelo en Prisma

```prisma
model ActivityLog {
  id        Int           @id @default(autoincrement())
  createdAt DateTime      @default(now())
  eventType LogEventType
  details   String?       // JSON string con información adicional
  userId    Int
  user      User          @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([eventType])
  @@index([createdAt])
}

enum LogEventType {
  LOGIN
  LESSON_VIEWED
  AI_QUERY_ASKED
  CODE_SUBMITTED
  QUIZ_ATTEMPTED
}
```

## Tipos de Eventos Registrados

### 1. LOGIN
Se registra cuando un usuario inicia sesión.

**Details**:
```json
{
  "timestamp": "2025-11-08T22:00:00.000Z",
  "ipAddress": "192.168.1.1" // (opcional)
}
```

### 2. LESSON_VIEWED
Se registra cuando un estudiante completa una lección.

**Ubicación**: `POST /api/progress/complete`

**Details**:
```json
{
  "lessonId": 73,
  "lessonTitle": "Tu primer programa",
  "codeLength": 45,
  "timestamp": "2025-11-08T22:15:00.000Z"
}
```

### 3. AI_QUERY_ASKED ⭐ (Fase 3.2 - NUEVO)
Se registra cuando un estudiante solicita crítica de código por IA.

**Ubicación**: `POST /api/gemini/critique`

**Details** (actualizado en Prompt 3.2):
```json
{
  "code": "for i in range(5):\n    print i",
  "critique": "¡Buen intento! Revisa la línea 2. En Python 3, print es una función...",
  "codeLength": 32,
  "critiqueLength": 156,
  "timestamp": "2025-11-08T22:30:00.000Z"
}
```

**Cambios en Prompt 3.2**:
- ✅ Se agregó el campo `code` completo
- ✅ Se agregó el campo `critique` completo
- ✅ Se mantienen `codeLength` y `critiqueLength` para métricas
- ✅ Se agregó logging en consola: "📊 Actividad registrada: Usuario X usó crítica de IA"

### 4. CODE_SUBMITTED
Se registra cuando un estudiante envía código en una lección.

**Ubicación**: `POST /api/progress/complete` (si `lastSubmittedCode` está presente)

**Details**:
```json
{
  "lessonId": 73,
  "lessonTitle": "Tu primer programa",
  "codeLength": 45,
  "success": true,
  "timestamp": "2025-11-08T22:20:00.000Z"
}
```

### 5. QUIZ_ATTEMPTED
Se registra cuando un estudiante intenta un quiz (futuro).

**Details** (propuesto):
```json
{
  "quizId": 5,
  "score": 8,
  "totalQuestions": 10,
  "timestamp": "2025-11-08T22:25:00.000Z"
}
```

## Implementación de AI_QUERY_ASKED (Prompt 3.2)

### Código Actualizado

```typescript
// En POST /api/gemini/critique
// Después de recibir la respuesta de Gemini:

const critique = response.text();

// ✅ Registrar en ActivityLog con code y critique completos
try {
  await prisma.activityLog.create({
    data: {
      eventType: 'AI_QUERY_ASKED',
      details: JSON.stringify({
        code: code,              // ✅ NUEVO: código completo
        critique: critique,      // ✅ NUEVO: crítica completa
        codeLength: code.length,
        critiqueLength: critique.length,
        timestamp: new Date().toISOString()
      }),
      userId: parseInt(userId)
    }
  });
  console.log(`📊 Actividad registrada: Usuario ${userId} usó crítica de IA`);
} catch (logError) {
  console.warn('⚠️ No se pudo registrar en ActivityLog:', logError);
  // No fallar la petición si el log falla
}
```

## Consultas Útiles

### Ver todas las consultas de IA de un estudiante

```sql
SELECT 
  id,
  createdAt,
  details
FROM activity_logs
WHERE userId = 11
  AND eventType = 'AI_QUERY_ASKED'
ORDER BY createdAt DESC;
```

### Ver el código y crítica de una consulta específica

```bash
cd backend
sqlite3 prisma/dev.db "SELECT json_extract(details, '$.code') as code, json_extract(details, '$.critique') as critique FROM activity_logs WHERE eventType = 'AI_QUERY_ASKED' AND id = 10;"
```

### Contar cuántas veces cada estudiante usó la IA

```sql
SELECT 
  u.name,
  COUNT(*) as ai_queries
FROM activity_logs a
JOIN users u ON a.userId = u.id
WHERE a.eventType = 'AI_QUERY_ASKED'
GROUP BY u.id
ORDER BY ai_queries DESC;
```

### Ver el historial completo de un estudiante

```sql
SELECT 
  eventType,
  createdAt,
  CASE 
    WHEN eventType = 'AI_QUERY_ASKED' THEN json_extract(details, '$.critiqueLength') || ' caracteres'
    WHEN eventType = 'LESSON_VIEWED' THEN json_extract(details, '$.lessonTitle')
    ELSE details
  END as summary
FROM activity_logs
WHERE userId = 11
ORDER BY createdAt DESC;
```

### Métricas de uso de IA por día

```sql
SELECT 
  DATE(createdAt) as date,
  COUNT(*) as ai_queries,
  COUNT(DISTINCT userId) as unique_users
FROM activity_logs
WHERE eventType = 'AI_QUERY_ASKED'
GROUP BY DATE(createdAt)
ORDER BY date DESC;
```

## Casos de Uso

### 1. Dashboard del Profesor
Ver qué estudiantes están usando más la ayuda de IA:

```typescript
const aiUsage = await prisma.activityLog.findMany({
  where: { eventType: 'AI_QUERY_ASKED' },
  include: { user: true },
  orderBy: { createdAt: 'desc' },
  take: 50
});
```

### 2. Analítica del Estudiante
Mostrar al estudiante su historial de ayuda recibida:

```typescript
const studentHistory = await prisma.activityLog.findMany({
  where: {
    userId: studentId,
    eventType: 'AI_QUERY_ASKED'
  },
  orderBy: { createdAt: 'desc' }
});

// Parsear el JSON de details para mostrar código y crítica
const history = studentHistory.map(log => {
  const details = JSON.parse(log.details || '{}');
  return {
    date: log.createdAt,
    code: details.code,
    critique: details.critique
  };
});
```

### 3. Detección de Patrones de Errores
Analizar qué tipos de errores son más comunes:

```typescript
const aiLogs = await prisma.activityLog.findMany({
  where: { eventType: 'AI_QUERY_ASKED' }
});

// Análisis de patrones (requiere procesamiento adicional)
const patterns = aiLogs.map(log => {
  const details = JSON.parse(log.details || '{}');
  return {
    hasIndentationIssue: details.critique.includes('indentación'),
    hasSyntaxError: details.critique.includes('sintaxis'),
    hasPrintIssue: details.critique.includes('print')
  };
});
```

### 4. Rate Limiting
Evitar que un estudiante abuse del sistema:

```typescript
// Contar consultas en la última hora
const recentQueries = await prisma.activityLog.count({
  where: {
    userId: studentId,
    eventType: 'AI_QUERY_ASKED',
    createdAt: {
      gte: new Date(Date.now() - 60 * 60 * 1000) // última hora
    }
  }
});

if (recentQueries >= 10) {
  return res.status(429).json({
    error: 'Has usado la ayuda de IA muchas veces. Intenta resolver el problema por tu cuenta primero.'
  });
}
```

## Beneficios del Sistema de Logging

### Para el Estudiante
- ✅ Historial de su aprendizaje
- ✅ Revisar críticas pasadas
- ✅ Ver su progreso en la resolución de errores

### Para el Profesor
- ✅ Identificar estudiantes que necesitan más ayuda
- ✅ Ver qué temas generan más consultas
- ✅ Evaluar la efectividad de las críticas de IA
- ✅ Detectar patrones de errores comunes

### Para la Plataforma
- ✅ Métricas de engagement
- ✅ Análisis de uso de features
- ✅ Optimización del modelo de IA basado en feedback real
- ✅ Rate limiting y prevención de abuso

## Privacidad y Seguridad

### Almacenamiento de Datos
- ⚠️ El código del estudiante se guarda en `details` (JSON string)
- ⚠️ La crítica de IA se guarda en `details` (JSON string)
- ✅ Los datos están asociados al `userId`, no son anónimos

### Consideraciones
1. **GDPR**: Asegúrate de tener consentimiento para almacenar código del estudiante
2. **Retención**: Considera implementar limpieza automática después de X días
3. **Anonimización**: Para análisis agregados, considera anonimizar los datos

### Limpieza de Datos Antiguos (Opcional)

```typescript
// Eliminar logs de más de 90 días
await prisma.activityLog.deleteMany({
  where: {
    createdAt: {
      lt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
    }
  }
});
```

## Testing del Sistema

### Test 1: Verificar que se registra la actividad

```bash
# 1. Contar registros actuales
sqlite3 prisma/dev.db "SELECT COUNT(*) FROM activity_logs WHERE eventType = 'AI_QUERY_ASKED';"

# 2. Hacer una petición de crítica (con API key configurada)
curl -X POST http://localhost:8080/api/gemini/critique \
  -H "Content-Type: application/json" \
  -d '{"code":"print(123)","userId":"11"}'

# 3. Verificar que se agregó un registro
sqlite3 prisma/dev.db "SELECT COUNT(*) FROM activity_logs WHERE eventType = 'AI_QUERY_ASKED';"
```

### Test 2: Verificar contenido del registro

```bash
sqlite3 prisma/dev.db "SELECT id, createdAt, json_extract(details, '$.code') as code, json_extract(details, '$.critiqueLength') as critique_length FROM activity_logs WHERE eventType = 'AI_QUERY_ASKED' ORDER BY createdAt DESC LIMIT 1;"
```

### Test 3: Verificar que el logging no rompe el endpoint

```bash
# Debe devolver la crítica incluso si el logging falla
curl -X POST http://localhost:8080/api/gemini/critique \
  -H "Content-Type: application/json" \
  -d '{"code":"for i in range(5):\n    print(i)","userId":"11"}' | jq '.success'
# Debe devolver: true
```

## Monitoreo en Producción

### Logging en Consola

Cuando todo funciona correctamente, verás:

```
🤖 Solicitando crítica de código para usuario 11...
✅ Crítica generada exitosamente (156 caracteres)
📊 Actividad registrada: Usuario 11 usó crítica de IA
```

Si el logging falla (pero el endpoint funciona):

```
🤖 Solicitando crítica de código para usuario 11...
✅ Crítica generada exitosamente (156 caracteres)
⚠️ No se pudo registrar en ActivityLog: [error específico]
```

## Próximas Mejoras

Ideas para futuras iteraciones:

1. **Análisis de Sentimiento**: Detectar si las críticas son positivas/negativas
2. **Categorización Automática**: Clasificar errores (sintaxis, lógica, estilo)
3. **Recomendaciones**: Sugerir lecciones basadas en errores frecuentes
4. **Gamificación**: Badges por resolver problemas sin IA después de X intentos
5. **Dashboard Avanzado**: Visualizaciones de uso de IA por tema/lección

## Resumen de Cambios - Prompt 3.2

### ✅ Completado

1. **Actualizado `ActivityLog.create()`** en `POST /api/gemini/critique`
2. **Agregado al campo `details`**:
   - `code`: Código completo del estudiante
   - `critique`: Crítica completa de Gemini
3. **Agregado logging en consola**: "📊 Actividad registrada..."
4. **Mantenido comportamiento robusto**: El endpoint funciona incluso si el logging falla

### 🎯 Resultado

Ahora cada vez que un estudiante usa la crítica de IA, el sistema registra:
- ✅ Qué código escribió
- ✅ Qué crítica recibió
- ✅ Cuándo lo hizo
- ✅ Métricas de longitud

Esto permite análisis profundo del aprendizaje del estudiante y la efectividad de la IA.
