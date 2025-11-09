# ⚡ DEPLOYMENT CHECKLIST RÁPIDO

## ✅ Frontend en Vercel (YA HECHO)

**Tu URL de Vercel**: https://ai-tutor-platform-pink.vercel.app

---

## 📝 AHORA: Configurar Variables en Vercel

1. Ve a: https://vercel.com/dashboard
2. Selecciona tu proyecto "ai-python-tutor" (o como lo hayas llamado)
3. Click en **"Settings"** (arriba)
4. Click en **"Environment Variables"** (menú izquierdo)
5. Agrega estas variables:

```
Name: VITE_API_URL
Value: https://PENDIENTE-cuando-despliegues-backend.onrender.com

Name: VITE_MODE  
Value: production
```

6. **Click en "Add"** para cada una
7. **¡NO HAGAS REDEPLOY TODAVÍA!** (espera a tener el backend)

---

## 🚀 SIGUIENTE: Desplegar Backend en Render

### OPCIÓN A: Deployment Manual (Recomendado - 10 minutos)

#### Paso 1: Crear cuenta
1. Ve a: https://render.com
2. Click "Get Started"
3. Sign up con GitHub
4. Autoriza acceso a tu repositorio

#### Paso 2: Crear Base de Datos
1. En Render Dashboard, busca en el menú lateral izquierdo
2. Click en **"PostgreSQL"** (en el menú lateral)
3. Click en el botón azul **"New PostgreSQL"** (arriba a la derecha)
4. Configuración:
   ```
   Name: ai-python-tutor-db
   Database: ai_tutor
   Region: Oregon (US West)
   Instance Type: Free
   ```
5. Click **"Create Database"**
6. Espera 2 minutos a que se cree
7. **COPIA** la "Internal Database URL" (empieza con `postgresql://...`)
   - La encuentras en la sección "Connections" → "Internal Database URL"

#### Paso 3: Crear Web Service (Backend)
1. En el menú lateral izquierdo, click en **"Web Services"**
2. Click en el botón azul **"New Web Service"** (arriba a la derecha)
3. Si es tu primera vez:
   - Click **"Build and deploy from a Git repository"**
   - Conecta tu cuenta de GitHub
   - Autoriza acceso a tu repositorio
4. Selecciona tu repositorio: **twistin/ai-tutor-platform**
5. Click **"Connect"**
4. Configuración:
   ```
   Name: ai-python-tutor-backend
   Region: Oregon (US West)
   Branch: main
   Root Directory: backend
   Runtime: Node
   
   Build Command:
   npm install && npx prisma generate && npm run build
   
   Start Command:
   npm start
   
   Instance Type: Free
   ```

#### Paso 4: Variables de Entorno
En la sección **"Environment Variables"**, click **"Add Environment Variable"** y agrega:

```
Key: NODE_ENV
Value: production

Key: PORT
Value: 8080

Key: FRONTEND_URL
Value: [TU URL DE VERCEL] (ejemplo: https://ai-python-tutor.vercel.app)

Key: DATABASE_URL
Value: [LA URL QUE COPIASTE EN PASO 2]

Key: GEMINI_KEY (OPCIONAL)
Value: [tu clave de Gemini si la tienes]
```

#### Paso 5: Deploy
1. Click **"Create Web Service"**
2. Render empezará a construir tu backend
3. **Espera 5-10 minutos** (la primera vez es lenta)
4. Verás logs en tiempo real
5. Cuando termine, verás "Live" con un ✅ verde

#### Paso 6: Copiar URL del Backend
Una vez desplegado, verás arriba tu URL:
```
https://ai-python-tutor-backend.onrender.com
```
**CÓPIALA** - la necesitas para el siguiente paso

---

## 🔄 FINAL: Conectar Frontend y Backend

### 1. Actualizar Vercel con URL del Backend
1. Ve a Vercel Dashboard → tu proyecto
2. Settings → Environment Variables
3. **Edita** `VITE_API_URL` con la URL de Render que copiaste
4. Click **"Save"**
5. Ve a **"Deployments"**
6. Click en los **3 puntos** del último deployment
7. Click **"Redeploy"**
8. Espera 2-3 minutos

### 2. Verificar que funciona
1. Abre tu app en Vercel: `https://tu-app.vercel.app`
2. Deberías ver el landing page
3. Click en "Acceder a la Plataforma"
4. Login con:
   ```
   Estudiante: estudiante@test.com / password
   Profesor: profesor@test.com / password
   ```

---

## 🎯 PASOS FINALES - Inicializar Base de Datos

### Estado Actual:
- ✅ Backend desplegado y funcionando
- ✅ Schema de PostgreSQL creado
- ❌ Base de datos vacía (sin usuarios ni contenido)

### Solución: Endpoint Temporal de Inicialización

**Commit más reciente**: `fcf748b` - "Add temporary endpoint to initialize users and data"

**Esperar 3-5 minutos** a que Render termine el nuevo despliegue, luego:

#### Paso 1: Llamar al endpoint temporal
```bash
curl -X POST https://ai-tutor-platform-gv56.onrender.com/api/init-users
```

**Respuesta esperada**:
```json
{
  "success": true,
  "message": "Usuarios y datos iniciales creados exitosamente",
  "users": [
    {"email": "estudiante@test.com", "role": "STUDENT"},
    {"email": "profesor@test.com", "role": "PROFESSOR"}
  ],
  "module": "Introducción a Python",
  "lessonsCount": 3,
  "announcementsCount": 2
}
```

#### Paso 2: Probar login en la app
1. Ir a: https://ai-tutor-platform-pink.vercel.app
2. Click en "Acceder a la Plataforma"
3. Probar credenciales:
   - **Estudiante**: `estudiante@test.com` / `password123`
   - **Profesor**: `profesor@test.com` / `password123`

#### Paso 3: Verificar funcionalidad
- ✅ Dashboard carga correctamente
- ✅ Se muestra el módulo "Introducción a Python"
- ✅ Se muestran 3 lecciones
- ✅ Se muestran 2 anuncios
- ✅ Gemini AI responde consultas

#### Paso 4: Eliminar endpoint temporal (SEGURIDAD)
Una vez confirmado que todo funciona:

```bash
cd /Volumes/Nexus/ai-python-tutor
git checkout backend/src/index.ts
# Eliminar manualmente el bloque del endpoint /api/init-users
git add backend/src/index.ts
git commit -m "Remove temporary init-users endpoint for security"
git push
```

---

## ✅ Checklist de Verificación

- [x] Frontend en Vercel desplegado ✅ https://ai-tutor-platform-pink.vercel.app
- [x] Variables agregadas en Vercel (`VITE_API_URL`, `VITE_MODE`, `VITE_GEMINI_KEY`)
- [x] Base de datos PostgreSQL creada en Render ✅ dpg-d48fn4ripnbc73dfk2q0-a
- [x] Backend desplegado en Render ✅ https://ai-tutor-platform-gv56.onrender.com
- [x] Variables configuradas en Render (DATABASE_URL, GEMINI_KEY, etc.)
- [x] Build del backend exitoso (verde en Render)
- [x] URL del backend copiada
- [x] `VITE_API_URL` actualizado en Vercel con URL real
- [x] Redeploy de Vercel realizado
- [ ] ⏳ **PENDIENTE: Poblar base de datos** (en proceso)
- [ ] ⏳ **PENDIENTE: Probar login y funcionalidad completa**

---

## 🐛 Si algo falla

### Backend no construye en Render
**Revisa los logs** - probablemente sea:
- Falta `npx prisma generate` en Build Command
- Problema con DATABASE_URL
- Error de TypeScript

### CORS Error
**Verifica**:
- `FRONTEND_URL` en Render sea EXACTAMENTE tu URL de Vercel
- Sin `/` al final
- Con `https://` al inicio

### Backend responde lento
**Normal** en Free Tier:
- Primera request tarda 30-60s (cold start)
- Render pone el backend a dormir después de 15min
- Siguiente request lo despierta

---

## 💡 TIPS

1. **Guarda las URLs**: Anótalas en un lugar seguro
2. **No apagues local**: Puedes seguir desarrollando local y hacer push
3. **Auto-deploy**: Cada push a `main` redespliega automáticamente
4. **Logs**: Útiles para debugging - míralos en Render Dashboard

---

## 🎯 ¿Listo?

Dame tu **URL de Vercel** y te ayudo con el resto del proceso paso a paso.

Ejemplo: `https://ai-python-tutor-xyz123.vercel.app`
