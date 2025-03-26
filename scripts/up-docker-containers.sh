#!/bin/bash

echo "🚀 Starting required services with Docker Compose..."

docker-compose up -d mongodb mysql-auth redis rabbitmq elasticsearch

echo "✅ All services are up and running!"