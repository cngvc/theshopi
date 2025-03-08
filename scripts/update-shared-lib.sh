#!/bin/bash

LIB_TYPE="@cngvc/shopi-shared-types"
LIB_NAME="@cngvc/shopi-shared"

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


echo "🔄 Updating $LIB_TYPE in all services..."
for SERVICE in "${SERVICES[@]}"; do
  echo "📦 Updating $LIB_TYPE in $SERVICE..."
  cd "../servers/$SERVICE" || continue
  npm install $LIB_TYPE@latest
  cd - > /dev/null
done

echo "🔄 Updating $LIB_TYPE in all client..."


echo "🔄 Updating $LIB_NAME in all services..."
for SERVICE in "${SERVICES[@]}"; do
  echo "📦 Updating $LIB_NAME in $SERVICE..."
  cd "../servers/$SERVICE" || continue
  npm install $LIB_NAME@latest
  cd - > /dev/null
done

echo "🔄 Updating $LIB_NAME in all client..."

cd "../client" || continue
bun add $LIB_TYPE@latest

echo "✅ Done! All services have the latest version of $LIB_NAME & $LIB_TYPE."