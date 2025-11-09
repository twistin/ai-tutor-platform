# API de Crítica de Código por IA - Documentación

## POST /api/gemini/critique - Crítica de Código por IA

Genera una crítica constructiva de código Python usando Google Gemini AI. El sistema actúa como un tutor amable que da pistas y preguntas en lugar de soluciones directas.

### Endpoint
```
POST http://localhost:8080/api/gemini/critique
```

### Headers
```
Content-Type: application/json
```

### Body (JSON)

#### Campos Requeridos:
- `code` (string): El código Python que el estudiante quiere que sea evaluado. No puede estar vacío.
- `userId` (string): El ID del estudiante que solicita la crítica.

### Ejemplo de Request

```bash
curl -X POST http://localhost:8080/api/gemini/critique \
  -H "Content-Type: application/json" \
  -d '{
    "code": "for i in range(10):\nprint i",
    "userId": "11"
  }'
```

### Ejemplo con código más complejo

```bash
curl -X POST http://localhost:8080/api/gemini/critique \
  -H "Content-Type: application/json" \
  -d '{
    "code": "frutas = [\"manzana\", \"banana\", \"naranja\"]\nfor i in range(len(frutas)):\n    print(frutas[i])",
    "userId": "11"
  }'
```

### Respuestas

#### Éxito (200 OK)
```json
{
  "success": true,
  "data": {
    "critique": "¡Buen intento! Revisa la línea 2, ¿estás seguro de que la sintaxis de print es correcta? En Python 3, print es una función. ¿Qué falta?",
    "userId": "11",
    "timestamp": "2025-11-08T22:30:00.000Z"
  }
}
```

#### Error: Campos requeridos faltantes (400 Bad Request)
```json
{
  "success": false,
  "error": "Campos requeridos: code, userId"
}
```

#### Error: Código vacío (400 Bad Request)
```json
{
  "success": false,
  "error": "El código no puede estar vacío"
}
```

#### Error: GEMINI_KEY no configurada (500 Internal Server Error)
```json
{
  "success": false,
  "error": "GEMINI_KEY no está configurada en el servidor. Por favor, configura tu API key de Google Gemini en el archivo .env"
}
```

#### Error: Problema con la API de Gemini (500 Internal Server Error)
```json
{
  "success": false,
  "error": "Error de autenticación con la API de Gemini. Verifica tu API key.",
  "details": "API key not valid"
}
```

#### Error del servidor (500 Internal Server Error)
```json
{
  "success": false,
  "error": "Error al generar la crítica de código",
  "details": "Mensaje de error específico"
}
```

## Características del Sistema de Crítica

### Filosofía Educativa

El sistema está diseñado con los siguientes principios pedagógicos:

1. **Evaluación Formativa**: No da la respuesta, da pistas
2. **Tono Positivo**: Siempre comienza con un comentario alentador
3. **Una Pista a la Vez**: Enfoca la atención del estudiante en un solo problema
4. **Preguntas Guía**: Hace que el estudiante piense, no le da respuestas directas
5. **Edad Apropiada**: Lenguaje diseñado para estudiantes de ~15 años

### Ejemplos de Críticas Generadas

**Código con error de sintaxis:**
```python
for i in range(10):
print i
```
Crítica: *"¡Buen intento! Revisa la línea 2, ¿estás seguro de que la sintaxis de print es correcta? En Python 3, print es una función."*

**Código con problema de indentación:**
```python
def saludar():
print("Hola")
```
Crítica: *"Vas por buen camino, pero fíjate bien en la indentación. ¿Qué debe estar indentado dentro de una función?"*

**Código funcionalmente correcto pero ineficiente:**
```python
frutas = ["manzana", "banana"]
for i in range(len(frutas)):
    print(frutas[i])
```
Crítica: *"¡Excelente! Tu código funciona. ¿Sabías que hay una forma más 'pythonica' de iterar? Investiga sobre iterar directamente sobre listas."*

## System Prompt Usado

El endpoint utiliza el siguiente prompt para guiar a Gemini:

```
Eres un tutor de Python experto, amable y constructivo. Un alumno de 15 años ha escrito este código:

```python
[código del estudiante]
```

Tu misión es darle **evaluación formativa**, no la solución.
NO escribas el código corregido.
Dale UNA SOLA pista o pregunta clave para que descubra su error.

Ejemplos:
- "¡Buen intento! Revisa la línea 3, ¿estás seguro de que `frutas[i]` es la forma correcta de acceder a ese elemento?"
- "Vas por buen camino, pero fíjate bien en la indentación de tu bucle `else`."
- "Excelente inicio, pero ¿qué pasa si la lista está vacía? ¿Tu código maneja ese caso?"

Responde en español, de manera concisa (máximo 2-3 oraciones) y siempre con un tono alentador.
```

## Activity Logging

Cada vez que se genera una crítica, el sistema registra automáticamente el evento en `ActivityLog` con:
- `eventType`: `AI_QUERY_ASKED`
- `details`: JSON con longitud del código, longitud de la crítica, y timestamp
- `userId`: El ID del estudiante

Esto permite:
- Rastrear cuántas veces los estudiantes usan la herramienta de IA
- Analizar patrones de uso
- Generar métricas de engagement con la plataforma

## Logging en Consola

**Cuando se inicia la solicitud:**
```
🤖 Solicitando crítica de código para usuario 11...
```

**Cuando se genera exitosamente:**
```
✅ Crítica generada exitosamente (156 caracteres)
```

**Si hay error al registrar en ActivityLog:**
```
⚠️ No se pudo registrar en ActivityLog: [error]
```
*Nota: El endpoint NO falla si el logging falla. La crítica se devuelve de todas formas.*

## Validaciones Implementadas

1. ✅ **Campos requeridos**: Verifica que `code` y `userId` estén presentes
2. ✅ **Código no vacío**: El campo `code` debe tener contenido real
3. ✅ **API Key configurada**: Verifica que GEMINI_KEY esté en `.env` y no sea el placeholder
4. ✅ **Manejo de errores de Gemini**: Detecta errores específicos de autenticación y cuotas

## Límites y Consideraciones

### Límites de la API Gemini (Free Tier)
- **60 requests/minuto**: Suficiente para un aula pequeña
- **1,500 requests/día**: ~60 estudiantes con 25 críticas cada uno
- Sin límite de tokens en el free tier

### Tiempo de Respuesta
- Promedio: 2-4 segundos
- Depende de la longitud del código y la complejidad

### Longitud de Código
- Sin límite técnico, pero se recomienda:
  - Máximo: ~500 líneas para respuestas rápidas
  - Ideal: 10-50 líneas (ejercicios típicos)

## Casos de Uso

1. **Durante la lección**: Estudiante escribe código en `PythonConsole` y pide crítica
2. **Antes de enviar**: Estudiante revisa su código con IA antes de marcarlo como completo
3. **Después del feedback del profesor**: Estudiante usa IA para entender mejor el comentario del profesor
4. **Práctica adicional**: Estudiante prueba variaciones de código y obtiene feedback inmediato

## Seguridad

- ✅ El código del estudiante NO se almacena permanentemente (solo en logs temporales)
- ✅ La API key está protegida en variables de entorno
- ✅ No hay ejecución de código (solo análisis estático por IA)
- ✅ Sin límite de rate limiting (por ahora, confía en límites de Gemini)

## Próximas Mejoras

Ideas para futuras versiones:
- [ ] Cache de críticas comunes para ahorrar llamadas a API
- [ ] Contexto de la lección para críticas más específicas
- [ ] Nivel de dificultad ajustable (principiante/avanzado)
- [ ] Multiidioma (inglés, español, etc.)
- [ ] Análisis de progreso: comparar código actual con intentos previos
- [ ] Rate limiting por usuario para prevenir abuso

## Integración Frontend

Ejemplo de cómo llamar desde React:

```typescript
const getCritique = async (code: string, userId: string) => {
  try {
    const response = await fetch('http://localhost:8080/api/gemini/critique', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, userId })
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('Crítica:', data.data.critique);
      return data.data.critique;
    } else {
      console.error('Error:', data.error);
      return null;
    }
  } catch (error) {
    console.error('Error de red:', error);
    return null;
  }
};
```

## Testing

### Test Manual Básico

```bash
# Test 1: Código con error de sintaxis
curl -X POST http://localhost:8080/api/gemini/critique \
  -H "Content-Type: application/json" \
  -d '{"code":"for i in range(5):\nprint i","userId":"11"}' | jq .

# Test 2: Código correcto
curl -X POST http://localhost:8080/api/gemini/critique \
  -H "Content-Type: application/json" \
  -d '{"code":"for i in range(5):\n    print(i)","userId":"11"}' | jq .

# Test 3: Error de validación (sin código)
curl -X POST http://localhost:8080/api/gemini/critique \
  -H "Content-Type: application/json" \
  -d '{"userId":"11"}' | jq .
```

## Recursos Adicionales

- [Configuración de Gemini](./GEMINI_SETUP.md)
- [Documentación de Gemini API](https://ai.google.dev/docs)
- [Best Practices para Prompts](https://ai.google.dev/docs/prompt_best_practices)
