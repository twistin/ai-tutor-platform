# 🐍 AI Python Tutor - Despliegue en Netlify

## 📋 Pasos para Desplegar en Netlify

### 1️⃣ Preparar el Repositorio

1. Asegúrate de que tu proyecto esté en un repositorio de Git (GitHub, GitLab, o Bitbucket)
2. Haz commit de todos los cambios:
   ```bash
   git add .
   git commit -m "Preparar para despliegue en Netlify"
   git push origin main
   ```

### 2️⃣ Configurar Variables de Entorno en Netlify

⚠️ **IMPORTANTE**: No subas tu API key al repositorio público

1. Ve a [Netlify](https://app.netlify.com/)
2. Inicia sesión o crea una cuenta
3. Click en "Add new site" → "Import an existing project"
4. Conecta tu repositorio de Git
5. **Antes de desplegar**, ve a "Site settings" → "Environment variables"
6. Agrega la variable:
   - Key: `VITE_GEMINI_API_KEY`
   - Value: Tu API key de Gemini

### 3️⃣ Configurar el Build

Netlify debería detectar automáticamente la configuración desde `netlify.toml`, pero verifica:

- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Node version**: 18 o superior

### 4️⃣ Desplegar

1. Click en "Deploy site"
2. Espera a que termine el build (2-3 minutos)
3. Tu sitio estará disponible en: `https://tu-sitio.netlify.app`

### 5️⃣ Personalizar el Dominio (Opcional)

1. En el dashboard de Netlify, ve a "Domain settings"
2. Click en "Add custom domain"
3. Sigue las instrucciones para configurar tu dominio

## 🎯 Usuarios de Demostración

La plataforma incluye dos usuarios de demostración:

### 👨‍🎓 Estudiante
- **Usuario**: `estudiante`
- **Funcionalidades**: 
  - Ver todas las lecciones
  - Ejecutar código en la consola Python
  - Usar el asistente de IA
  - Hacer preguntas sobre las lecciones

### 👨‍🏫 Profesor
- **Usuario**: `profesor`
- **Funcionalidades**:
  - Dashboard de gestión
  - Crear y editar cursos
  - Publicar anuncios
  - Ver módulos y lecciones

## 🔒 Seguridad

- El archivo `.env.local` está en `.gitignore` (no se sube al repositorio)
- La API key solo se configura en las variables de entorno de Netlify
- Los headers de seguridad están configurados en `netlify.toml`

## 🚀 Actualizaciones

Para actualizar el sitio después del despliegue:

```bash
git add .
git commit -m "Actualización de contenido"
git push origin main
```

Netlify automáticamente detectará los cambios y redesplegarán el sitio.

## 📝 Contenido del Curso

El curso incluye 7 módulos completos:

1. **Fundamentos de Python** - Variables, tipos de datos, operaciones
2. **Control de Flujo** - Condiciones, bucles, lógica
3. **Estructuras de Datos** - Listas, tuplas, diccionarios, sets
4. **Funciones** - Definición, parámetros, scope, lambdas
5. **POO** - Clases, objetos, herencia, encapsulamiento
6. **Archivos y Excepciones** - Lectura/escritura, try/except, JSON
7. **Proyecto Final** - Desarrollo de aplicación completa

## 🛠️ Stack Tecnológico

- ⚛️ React 19
- 📘 TypeScript 5.8
- 🎨 Tailwind CSS 3.4
- 🤖 Google Gemini AI
- ⚡ Vite 6.2

## 📞 Soporte

Para problemas o preguntas sobre el despliegue, consulta:
- [Documentación de Netlify](https://docs.netlify.com/)
- [Documentación de Vite](https://vitejs.dev/)
- [Documentación de Google Gemini AI](https://ai.google.dev/)

---

Desarrollado con ❤️ para estudiantes de 15 años que quieren aprender Python
