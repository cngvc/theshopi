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

echo "🔄 Run test in all services..."

for SERVICE in "${SERVICES[@]}"; do
  echo "📦 Install packages in $SERVICE..."
  cd "../servers/$SERVICE" || continue
  npm run test
  cd - > /dev/null
done

echo "✅ Done! All services have been tested"