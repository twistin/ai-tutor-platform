# 🚀 Guía Rápida de Despliegue en Netlify

## ✅ Todo Listo para Desplegar

Tu aplicación está completamente preparada para ser desplegada en Netlify como prototipo de demostración.

---

## 📝 Pasos Rápidos

### 1. Sube tu código a GitHub

```bash
# Si no tienes un repositorio remoto
git init
git add .
git commit -m "Primera versión: AI Python Tutor listo para Netlify"

# Crea un repositorio en GitHub y luego:
git remote add origin https://github.com/TU-USUARIO/ai-python-tutor.git
git branch -M main
git push -u origin main
```

### 2. Conecta con Netlify

1. Ve a: **https://app.netlify.com/**
2. Click en **"Add new site"** → **"Import an existing project"**
3. Selecciona **GitHub** y autoriza el acceso
4. Busca y selecciona tu repositorio **ai-python-tutor**

### 3. Configura el Despliegue

Netlify detectará automáticamente la configuración desde `netlify.toml`:
- ✅ Build command: `npm run build`
- ✅ Publish directory: `dist`
- ✅ Redirects configurados para React Router

### 4. ⚠️ IMPORTANTE: Configura la API Key

**ANTES de desplegar**, configura la variable de entorno:

1. En Netlify, ve a: **Site settings** → **Environment variables**
2. Click en **"Add a variable"**
3. Agrega:
   - **Key**: `VITE_GEMINI_API_KEY`
   - **Value**: `AIzaSyCUNZhG39XWev_COeT5YG8YmlkrJEfYEMY` (tu API key)

### 5. Despliega

1. Click en **"Deploy site"**
2. Espera 2-3 minutos mientras se construye
3. ¡Tu sitio estará en vivo! 🎉

---

## 🎯 Credenciales de Demostración

Una vez desplegado, los visitantes pueden probar la plataforma con:

### 👨‍🎓 Acceso Estudiante
```
Usuario: estudiante
```
**Funcionalidades:**
- ✅ Ver todas las 30+ lecciones
- ✅ Ejecutar código Python en el navegador
- ✅ Explicaciones de código con IA
- ✅ Preguntas y respuestas sobre las lecciones

### 👨‍🏫 Acceso Profesor
```
Usuario: profesor
```
**Funcionalidades:**
- ✅ Dashboard de gestión de cursos
- ✅ Crear y editar cursos
- ✅ Publicar anuncios
- ✅ Ver estructura completa del curso

---

## 🎨 Características del Landing Page

Tu landing page incluye:
- 🐍 Hero section con animación
- 💡 6 características destacadas
- 📖 Resumen del contenido del curso (7 módulos)
- 🚀 Tarjetas de acceso rápido para estudiante y profesor
- 🛠️ Stack tecnológico mostrado
- 📱 Diseño responsivo y moderno

---

## 🔧 Configuración Incluida

### ✅ netlify.toml
- Configuración de build
- Redirects para SPA
- Headers de seguridad
- Cache para assets

### ✅ .gitignore
- Protege `.env.local` (no se sube al repositorio)
- Excluye `node_modules` y `dist`

### ✅ DEPLOY.md
- Documentación completa de despliegue
- Instrucciones detalladas
- Información sobre usuarios demo

---

## 📊 Contenido del Curso

**7 Módulos Completos** (14 semanas):

1. 🎯 **Fundamentos de Python** - Semanas 1-2
2. 🔄 **Control de Flujo** - Semanas 3-4
3. 📦 **Estructuras de Datos** - Semanas 5-6
4. ⚡ **Funciones** - Semanas 7-8
5. 🏗️ **Programación Orientada a Objetos** - Semanas 9-10
6. 📁 **Archivos y Excepciones** - Semanas 11-12
7. 🎓 **Proyecto Final** - Semanas 13-14

**Total**: 30+ lecciones interactivas

---

## 🔒 Seguridad

✅ **Tu API key está protegida:**
- No se sube al repositorio (`.gitignore`)
- Solo existe en las variables de entorno de Netlify
- Headers de seguridad configurados

---

## 📱 Después del Despliegue

### Tu URL será algo como:
```
https://ai-python-tutor-123abc.netlify.app
```

### Puedes personalizarla:
1. Ve a **Domain settings** en Netlify
2. Click en **"Change site name"**
3. Elige algo como: `ai-python-tutor-demo`
4. Tu nueva URL: `https://ai-python-tutor-demo.netlify.app`

---

## 🔄 Actualizaciones Futuras

Para actualizar el sitio después del despliegue inicial:

```bash
# Hacer cambios en tu código
git add .
git commit -m "Descripción de los cambios"
git push origin main
```

Netlify automáticamente detectará el cambio y redespelagará. ⚡

---

## 🎉 ¡Listo para Impresionar!

Tu plataforma incluye:
- ✅ Landing page profesional
- ✅ Sistema de login con acceso rápido
- ✅ Dashboard de estudiante completo
- ✅ Dashboard de profesor funcional
- ✅ Integración con IA (Gemini)
- ✅ 30+ lecciones de Python
- ✅ Consola Python interactiva
- ✅ Sistema de preguntas y respuestas
- ✅ Diseño moderno y responsivo

---

## 💡 Tips para la Demostración

1. **Muestra primero el Landing Page** - Impacta visualmente
2. **Accede como Estudiante** - Demuestra las lecciones y la IA
3. **Prueba la Consola Python** - Ejecuta código en vivo
4. **Usa "Explicar Código"** - Muestra la IA en acción
5. **Accede como Profesor** - Muestra las herramientas de gestión
6. **Menciona la escalabilidad** - Fácil agregar más cursos/módulos

---

## 📞 Soporte

Si tienes algún problema durante el despliegue:
- 📚 [Documentación de Netlify](https://docs.netlify.com/)
- 🔧 [Troubleshooting Netlify](https://answers.netlify.com/)

---

**¡Buena suerte con tu demo! 🚀**
