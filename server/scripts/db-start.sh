#!/bin/bash

# Database management script for Elza
# This script starts only the database services using Docker Compose

echo "🚀 Starting Elza Database Services..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Start database services
echo "📦 Starting PostgreSQL database..."
docker-compose -f docker-compose.db-only.yml up -d

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 5

# Check if database is healthy
if docker-compose -f docker-compose.db-only.yml ps | grep -q "healthy"; then
    echo "✅ Database is ready!"
    echo ""
    echo "📊 Database Information:"
    echo "   Host: localhost"
    echo "   Port: 5433"
    echo "   Database: elza_db"
    echo "   Username: elza_user"
    echo "   Password: elza_password"
    echo ""
    echo "🔧 pgAdmin (Optional):"
    echo "   URL: http://localhost:8080"
    echo "   Email: admin@elza.fun"
    echo "   Password: admin123"
    echo ""
    echo "💡 To stop the database: ./scripts/db-stop.sh"
    echo "💡 To view logs: ./scripts/db-logs.sh"
else
    echo "❌ Database failed to start. Check logs with: ./scripts/db-logs.sh"
    exit 1
fi
