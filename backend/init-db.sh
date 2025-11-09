#!/bin/bash
set -e

echo "🔧 Inicializando base de datos PostgreSQL..."

# Generar Prisma Client
npx prisma generate

# Hacer push del schema (crea las tablas sin migraciones)
npx prisma db push --accept-data-loss

echo "✅ Base de datos inicializada correctamente"
echo "⚠️  Nota: Ejecuta 'npx prisma db seed' manualmente si necesitas datos de prueba"
