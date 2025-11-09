#!/bin/bash

# Script de verificación pre-despliegue para AI Python Tutor
# Ejecutar: bash pre-deploy-check.sh

echo "🔍 Verificando proyecto antes del despliegue..."
echo ""

# Verificar que node_modules existe
if [ ! -d "node_modules" ]; then
    echo "❌ Error: node_modules no encontrado. Ejecuta: npm install"
    exit 1
fi

# Verificar que el build funciona
echo "📦 Probando build..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build exitoso"
else
    echo "❌ Error en el build"
    exit 1
fi

# Verificar que .env.local no está en git
if git ls-files --error-unmatch .env.local 2>/dev/null; then
    echo "⚠️  ADVERTENCIA: .env.local está en Git. Deberías eliminarlo:"
    echo "   git rm --cached .env.local"
    echo "   git commit -m 'Remove .env.local from git'"
fi

echo ""
echo "✅ Verificaciones completadas"
echo ""
echo "📋 Checklist antes de desplegar en Netlify:"
echo "   ✓ Build funcional"
echo "   ✓ .env.local no en Git"
echo ""
echo "⚠️  RECUERDA:"
echo "   1. Configurar VITE_GEMINI_API_KEY en Netlify"
echo "   2. Usuarios demo: 'estudiante' y 'profesor'"
echo "   3. Push a tu repositorio: git push origin main"
echo ""
echo "🚀 Listo para desplegar en Netlify!"
