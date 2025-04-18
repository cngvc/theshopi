#!/bin/bash

echo "🛑 Stopping all running services and removing volumes..."

docker-compose down -v
cd ../ && rm -rf docker-volumes    

echo "✅ All services have been stopped and volumes removed!"