#!/bin/bash

echo "🚀 Starting required services with Docker Compose..."

docker-compose up -d mongodb mysql_auth mysql_balance redis rabbitmq elasticsearch

echo "✅ All services are up and running!"