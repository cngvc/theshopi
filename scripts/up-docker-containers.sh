#!/bin/bash

echo "🚀 Starting required services with Docker Compose..."

docker-compose up -d mongodb mysql redis rabbitmq elasticsearch

echo "✅ All services are up and running!"