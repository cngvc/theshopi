#!/bin/bash

SOURCE_FILE=".env.dev"
TARGET_FILE=".env"


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
  "payment-service"
)

echo "🔄 Install packages in all services..."

for SERVICE in "${SERVICES[@]}"; do
  cd "./servers/$SERVICE" || continue
  cp "$SOURCE_FILE" "$TARGET_FILE"
  cd - > /dev/null
done


echo "✅ File $TARGET_FILE was created from $SOURCE_FILE!"