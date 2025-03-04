#!/bin/bash

echo "🚀 Starting required services with Docker Compose..."

docker-compose up -d mongodb mysql redis rabbitmq elasticsearch kibana

echo "✅ All services are up and running!"