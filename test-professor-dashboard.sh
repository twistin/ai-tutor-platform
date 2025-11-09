#!/bin/bash

echo "🧪 ============================================"
echo "🧪 PRUEBA COMPLETA DEL SISTEMA"
echo "🧪 AI Python Tutor - Dashboard del Profesor"
echo "🧪 ============================================"
echo ""

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar que los servidores estén corriendo
echo -e "${BLUE}📡 Verificando servidores...${NC}"
echo ""

# Backend
echo -n "Backend (8080): "
if curl -s http://localhost:8080/health > /dev/null; then
    echo -e "${GREEN}✅ Corriendo${NC}"
else
    echo -e "❌ No disponible"
    exit 1
fi

# Frontend
echo -n "Frontend (3000): "
if curl -s http://localhost:3000 > /dev/null; then
    echo -e "${GREEN}✅ Corriendo${NC}"
else
    echo -e "❌ No disponible"
    exit 1
fi

echo ""
echo -e "${BLUE}📊 Obteniendo datos del dashboard...${NC}"
echo ""

# Llamada al endpoint
RESPONSE=$(curl -s http://localhost:8080/api/dashboard/overview)

# Mostrar respuesta formateada
echo "$RESPONSE" | python3 -m json.tool

echo ""
echo -e "${YELLOW}📋 Resumen:${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Extraer datos con jq o python
TOTAL=$(echo "$RESPONSE" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data['total'])")
EMAIL=$(echo "$RESPONSE" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data['data'][0]['userEmail'])")
LESSONS=$(echo "$RESPONSE" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data['data'][0]['lessonsCompleted'])")

echo "Total de estudiantes: $TOTAL"
echo "Estudiante: $EMAIL"
echo "Lecciones completadas: $LESSONS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo ""
echo -e "${GREEN}✅ Prueba completada exitosamente${NC}"
echo ""
echo -e "${YELLOW}🌐 Accede al dashboard del profesor:${NC}"
echo "   1. Abre: http://localhost:3000"
echo "   2. Click en 'Acceso Profesor'"
echo "   3. Verás la tabla de progreso en la parte superior"
echo ""
