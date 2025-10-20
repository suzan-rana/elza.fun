#!/bin/bash

# Database management script for Elza
# This script shows database logs

echo "📋 Showing Elza Database Logs..."
echo "Press Ctrl+C to exit"
echo ""

# Show logs with follow
docker-compose -f docker-compose.db-only.yml logs -f
