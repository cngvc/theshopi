#!/bin/bash

set -e

SERVICES=(
  "auth-service" 
  "chat-service" 
  "gateway-service" 
  "notification-service" 
  "users-service"
  "online-status-service"
  "socket-service"
  "products-service" 
  "orders-service"
  "reviews-service"
  "cart-service"
)

for SERVICE in "${SERVICES[@]}"; do
  echo "Building in $SERVICE..."
  cd "./servers/$SERVICE" || continue
  npm run build || { echo "Build failed in $dir"; exit 1; }
  cd - > /dev/null
done

echo "✅ Build completed successfully!"