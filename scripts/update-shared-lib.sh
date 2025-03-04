#!/bin/bash

LIB_NAME="@cngvc/shopi-shared"
SERVICES=(
  "auth-service" 
  "chat-service" 
  "gateway-service" 
  "notification-service" 
  "orders-service" 
  "products-service" 
  "reviews-service" 
  "users-service"
)

echo "🔄 Updating $LIB_NAME in all services..."

for SERVICE in "${SERVICES[@]}"; do
  echo "📦 Updating $LIB_NAME in $SERVICE..."
  cd "../servers/$SERVICE" || continue
  npm install $LIB_NAME@latest
  cd - > /dev/null
done

echo "✅ Done! All services have the latest version of $LIB_NAME."