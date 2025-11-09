# 🧪 Cómo Probar el Endpoint de Crítica de IA

Este documento te guía para probar el endpoint de crítica de código por IA.

## Prerequisitos

1. **Obtener una API Key de Google Gemini** (gratis):
   - Ve a [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Inicia sesión con tu cuenta de Google
   - Crea una API key
   - Copia la key

2. **Configurar la API Key**:
   ```bash
   # Edita el archivo backend/.env
   GEMINI_KEY="TU_API_KEY_AQUI"
   ```

3. **Reiniciar el servidor**:
   ```bash
   cd backend
   npm run dev
   ```

## Tests Básicos

### Test 1: Código con Error de Sintaxis (Python 2 vs 3)

```bash
curl -X POST http://localhost:8080/api/gemini/critique \
  -H "Content-Type: application/json" \
  -d '{
    "code": "for i in range(5):\n    print i",
    "userId": "11"
  }' | jq .
```

**Respuesta Esperada**: Una crítica que sugiere que `print` debe ser una función en Python 3.

### Test 2: Código con Error de Indentación

```bash
curl -X POST http://localhost:8080/api/gemini/critique \
  -H "Content-Type: application/json" \
  -d '{
    "code": "def saludar():\nprint(\"Hola\")",
    "userId": "11"
  }' | jq .
```

**Respuesta Esperada**: Una crítica sobre la indentación incorrecta.

### Test 3: Código Correcto pero Mejorable

```bash
curl -X POST http://localhost:8080/api/gemini/critique \
  -H "Content-Type: application/json" \
  -d '{
    "code": "frutas = [\"manzana\", \"banana\", \"naranja\"]\nfor i in range(len(frutas)):\n    print(frutas[i])",
    "userId": "11"
  }' | jq .
```

**Respuesta Esperada**: Una crítica que sugiere una forma más "pythonica" de iterar.

### Test 4: Código con Variable No Definida

```bash
curl -X POST http://localhost:8080/api/gemini/critique \
  -H "Content-Type: application/json" \
  -d '{
    "code": "print(nombre)\nnombre = \"Juan\"",
    "userId": "11"
  }' | jq .
```

**Respuesta Esperada**: Una crítica sobre usar la variable antes de definirla.

### Test 5: Código Perfecto

```bash
curl -X POST http://localhost:8080/api/gemini/critique \
  -H "Content-Type: application/json" \
  -d '{
    "code": "def saludar(nombre):\n    return f\"Hola, {nombre}!\"\n\nprint(saludar(\"María\"))",
    "userId": "11"
  }' | jq .
```

**Respuesta Esperada**: Un comentario positivo o sugerencia de mejora menor.

## Respuesta de Ejemplo

Cuando todo funciona correctamente, recibirás algo como:

```json
{
  "success": true,
  "data": {
    "critique": "¡Buen intento! Revisa la línea 2. En Python 3, print es una función, no una palabra clave. ¿Qué le falta?",
    "userId": "11",
    "timestamp": "2025-11-08T22:35:00.000Z"
  }
}
```

## Verificar Activity Log

Después de hacer una crítica, puedes verificar que se registró en la base de datos:

```bash
cd backend
sqlite3 prisma/dev.db "SELECT * FROM activity_logs WHERE eventType = 'AI_QUERY_ASKED' ORDER BY createdAt DESC LIMIT 1;"
```

## Tests de Error

### Test: Sin API Key Configurada

```bash
curl -X POST http://localhost:8080/api/gemini/critique \
  -H "Content-Type: application/json" \
  -d '{"code":"print(123)","userId":"11"}' | jq .
```

**Respuesta Esperada** (si GEMINI_KEY no está configurada):
```json
{
  "success": false,
  "error": "GEMINI_KEY no está configurada en el servidor..."
}
```

### Test: Campos Faltantes

```bash
curl -X POST http://localhost:8080/api/gemini/critique \
  -H "Content-Type: application/json" \
  -d '{"code":"print(123)"}' | jq .
```

**Respuesta Esperada**:
```json
{
  "success": false,
  "error": "Campos requeridos: code, userId"
}
```

## Script de Prueba Completo

Puedes guardar esto como `test-gemini.sh` y ejecutarlo:

```bash
#!/bin/bash

echo "🧪 TESTS DEL ENDPOINT DE CRÍTICA DE CÓDIGO POR IA"
echo "=================================================="
echo ""

echo "✅ Test 1: Código con error de sintaxis Python 2 vs 3"
curl -s -X POST http://localhost:8080/api/gemini/critique \
  -H "Content-Type: application/json" \
  -d '{"code":"for i in range(5):\n    print i","userId":"11"}' | jq -r '.data.critique // .error'

echo ""
echo "✅ Test 2: Código con error de indentación"
curl -s -X POST http://localhost:8080/api/gemini/critique \
  -H "Content-Type: application/json" \
  -d '{"code":"def saludar():\nprint(\"Hola\")","userId":"11"}' | jq -r '.data.critique // .error'

echo ""
echo "✅ Test 3: Código correcto pero mejorable"
curl -s -X POST http://localhost:8080/api/gemini/critique \
  -H "Content-Type: application/json" \
  -d '{"code":"frutas = [\"manzana\", \"banana\"]\nfor i in range(len(frutas)):\n    print(frutas[i])","userId":"11"}' | jq -r '.data.critique // .error'

echo ""
echo "=================================================="
echo "✅ Tests completados"
```

Para ejecutarlo:

```bash
chmod +x test-gemini.sh
./test-gemini.sh
```

## Monitoreo de Uso

Para ver cuántas críticas se han solicitado:

```bash
cd backend
sqlite3 prisma/dev.db "SELECT COUNT(*) as total_criticas FROM activity_logs WHERE eventType = 'AI_QUERY_ASKED';"
```

Para ver las críticas por estudiante:

```bash
cd backend
sqlite3 prisma/dev.db "SELECT u.name, COUNT(*) as criticas FROM activity_logs a JOIN users u ON a.userId = u.id WHERE a.eventType = 'AI_QUERY_ASKED' GROUP BY u.id;"
```

## Troubleshooting

### Problema: "API key not valid"
**Solución**: Verifica que copiaste correctamente la API key sin espacios extra

### Problema: "Quota exceeded"
**Solución**: Has excedido el límite gratuito. Espera o actualiza tu plan en Google AI Studio

### Problema: Respuestas muy lentas
**Solución**: 
- Normal: 2-4 segundos
- Si es más lento: Verifica tu conexión a internet
- Considera reducir la longitud del código

### Problema: La crítica no aparece en ActivityLog
**Solución**: No es un error crítico. El endpoint devuelve la crítica incluso si el log falla. Revisa los permisos de la base de datos.

## Próximos Pasos

Una vez que el endpoint funcione correctamente:

1. Integrar con el componente `PythonConsole.tsx` en el frontend
2. Agregar un botón "💡 Obtener Ayuda de IA"
3. Mostrar la crítica en un modal o panel lateral
4. Agregar animación de "pensando..." mientras espera la respuesta
5. Implementar rate limiting si es necesario

## Recursos

- [Configuración de Gemini](./GEMINI_SETUP.md)
- [Documentación del API](./API_GEMINI_CRITIQUE.md)
- [Google AI Studio](https://makersuite.google.com/)
