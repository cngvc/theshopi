#!/bin/bash

set -e

SERVICES=(
  "auth-service" 
  "chat-service" 
  "gateway-service" 
  "notification-service" 
  "orders-service" 
  "products-service" 
  "reviews-service" 
  "users-service"
  "online-status-service"
)

for SERVICE in "${SERVICES[@]}"; do
  echo "Building in $SERVICE..."
  cd "../servers/$SERVICE" || continue
  npm run build || { echo "Build failed in $dir"; exit 1; }
  cd - > /dev/null
done

echo "✅ Build completed successfully!"