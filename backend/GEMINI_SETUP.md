# 🤖 Configuración de Google Gemini AI

Esta guía te ayudará a configurar la API de Google Gemini para la funcionalidad de crítica de código por IA.

## Paso 1: Obtener tu API Key de Gemini

1. Ve a [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Inicia sesión con tu cuenta de Google
3. Haz clic en "Create API Key" o "Get API Key"
4. Copia tu API key

## Paso 2: Configurar la API Key en el Backend

1. Abre el archivo `/backend/.env`
2. Busca la línea que dice:
   ```
   GEMINI_KEY="your-gemini-api-key-here"
   ```
3. Reemplaza `your-gemini-api-key-here` con tu API key real:
   ```
   GEMINI_KEY="TU_API_KEY_AQUI"
   ```
4. Guarda el archivo

## Paso 3: Reiniciar el Servidor

Si el servidor backend está corriendo, reinícialo para que cargue la nueva API key:

```bash
cd backend
npm run dev
```

## Verificar la Configuración

Una vez configurada la API key, puedes probar el endpoint:

```bash
curl -X POST http://localhost:8080/api/gemini/critique \
  -H "Content-Type: application/json" \
  -d '{
    "code": "for i in range(10):\nprint i",
    "userId": "11"
  }'
```

Si todo está configurado correctamente, recibirás una crítica constructiva del código.

## Errores Comunes

### Error: "GEMINI_KEY no está configurada"
- Verifica que el archivo `.env` tenga la línea `GEMINI_KEY` con tu API key
- Asegúrate de haber reiniciado el servidor después de modificar `.env`

### Error: "Error de autenticación con la API de Gemini"
- Verifica que tu API key sea válida
- Asegúrate de que no haya espacios o comillas extra en el `.env`
- Verifica que la API key tenga permisos activos en Google AI Studio

### Error: "Quota exceeded"
- Has excedido el límite gratuito de la API de Gemini
- Espera un tiempo o considera actualizar tu plan en Google AI Studio

## Límites de la API (Plan Gratuito)

- **60 requests por minuto**
- **1,500 requests por día**
- Suficiente para desarrollo y pruebas

## Seguridad

⚠️ **IMPORTANTE**: 
- NUNCA compartas tu API key públicamente
- NO subas el archivo `.env` a repositorios públicos
- El archivo `.env` está en `.gitignore` para proteger tu key
- Cada desarrollador debe usar su propia API key

## Modelos Disponibles

El endpoint usa actualmente el modelo `gemini-pro`, que es:
- Gratuito
- Optimizado para texto
- Ideal para crítica de código y evaluación formativa

## Recursos

- [Google AI Studio](https://makersuite.google.com/)
- [Documentación de Gemini API](https://ai.google.dev/docs)
- [Pricing de Gemini](https://ai.google.dev/pricing)
