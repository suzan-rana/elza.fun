#!/bin/bash

# Database management script for Elza
# This script stops the database services

echo "🛑 Stopping Elza Database Services..."

# Stop database services
docker-compose -f docker-compose.db-only.yml down

echo "✅ Database services stopped!"
echo ""
echo "💡 To start again: ./scripts/db-start.sh"
echo "💡 To remove all data: ./scripts/db-reset.sh"
