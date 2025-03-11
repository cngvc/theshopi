#!/bin/bash

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

echo "🔄 Install packages in all services..."

for SERVICE in "${SERVICES[@]}"; do
  echo "📦 Install packages in $SERVICE..."
  cd "./servers/$SERVICE" || continue
  npm install
  cd - > /dev/null
done

echo "🔄 Install packages in all client..."
cd "../client" || continue
bun install

echo "✅ Done! All services have the node_modules"