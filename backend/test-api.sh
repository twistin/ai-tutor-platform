#!/bin/bash

echo "🧪 Probando el endpoint POST /api/progress/complete"
echo ""

# Test 1: Marcar lección como completada (crear nuevo progreso)
echo "📝 Test 1: Crear nuevo progreso para userId=1, lessonId=4"
curl -X POST http://localhost:8080/api/progress/complete \
  -H "Content-Type: application/json" \
  -d '{"userId":1,"lessonId":4,"lastSubmittedCode":"print(\"Mi primer test\")"}' \
  | json_pp
echo ""
echo ""

# Test 2: Actualizar progreso existente
echo "📝 Test 2: Actualizar progreso existente para userId=1, lessonId=1"
curl -X POST http://localhost:8080/api/progress/complete \
  -H "Content-Type: application/json" \
  -d '{"userId":1,"lessonId":1,"lastSubmittedCode":"print(\"Código actualizado\")"}' \
  | json_pp
echo ""
echo ""

# Test 3: Error - missing userId
echo "📝 Test 3: Error - falta userId"
curl -X POST http://localhost:8080/api/progress/complete \
  -H "Content-Type: application/json" \
  -d '{"lessonId":1}' \
  | json_pp
echo ""
echo ""

# Test 4: Health check
echo "📝 Test 4: Health check"
curl http://localhost:8080/health | json_pp
echo ""

echo "✅ Tests completados"
