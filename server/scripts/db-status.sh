#!/bin/bash

# Database management script for Elza
# This script shows database status

echo "📊 Elza Database Status"
echo "======================="

# Check if containers are running
if docker-compose -f docker-compose.db-only.yml ps | grep -q "Up"; then
    echo "✅ Database services are running:"
    docker-compose -f docker-compose.db-only.yml ps
    echo ""
    
    # Check database health
    if docker-compose -f docker-compose.db-only.yml ps | grep -q "healthy"; then
        echo "✅ Database is healthy and ready to accept connections"
    else
        echo "⚠️  Database is starting up or has issues"
    fi
    
    echo ""
    echo "🔗 Connection Information:"
    echo "   Host: localhost"
    echo "   Port: 5433"
    echo "   Database: elza_db"
    echo "   Username: elza_user"
    echo "   Password: elza_password"
    echo ""
    echo "🔧 pgAdmin: http://localhost:8080"
else
    echo "❌ Database services are not running"
    echo ""
    echo "💡 To start: ./scripts/db-start.sh"
fi
