#!/bin/bash

# Relaunch Script - Tears down and rebuilds everything from scratch
# Usage: ./scripts/relaunch.sh

set -e

echo "🔄 Relaunching project..."
echo ""

# Stop and remove containers, networks, volumes
echo "📦 Stopping and removing containers..."
docker compose down -v --remove-orphans 2>/dev/null || true

# Remove any dangling images for this project
echo "🧹 Cleaning up old images..."
docker image prune -f 2>/dev/null || true

# Rebuild and start
echo "🔨 Building and starting containers..."
docker compose up --build -d

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 5

# Setup database
echo "📊 Setting up database schema..."
docker compose exec -T app npx prisma db push

# Seed database
echo "🌱 Seeding database..."
docker compose exec -T app npx prisma db seed

echo ""
echo "✅ Relaunch complete!"
echo ""
echo "🌐 App running at: http://localhost:3000"
echo ""
echo "📝 Demo credentials:"
echo "   Email: alice@student.edu"
echo "   Password: password123"
echo ""
