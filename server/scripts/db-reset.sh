#!/bin/bash

# Database management script for Elza
# This script resets the database (removes all data)

echo "⚠️  WARNING: This will delete all database data!"
read -p "Are you sure you want to continue? (y/N): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Operation cancelled."
    exit 1
fi

echo "🗑️  Resetting Elza Database..."

# Stop and remove containers and volumes
docker-compose -f docker-compose.db-only.yml down -v

# Remove any orphaned containers
docker-compose -f docker-compose.db-only.yml down --remove-orphans

echo "✅ Database reset complete!"
echo ""
echo "💡 To start fresh: ./scripts/db-start.sh"
