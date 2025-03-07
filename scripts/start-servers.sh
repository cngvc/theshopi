#!/bin/bash

# Move to the project root directory (if running from a different location)
cd "$(dirname "$0")"

# Start all services using concurrently
npx concurrently --names "G,A,U,P,O,C" --prefix-colors "blue,green,magenta,yellow,white,cyan" \
  "cd ../servers/gateway-service && npm run dev" \
  "cd ../servers/auth-service && npm run dev" \
  "cd ../servers/users-service && npm run dev" \
  "cd ../servers/products-service && npm run dev" \
  "cd ../servers/online-status-service && npm run dev" \
  "cd ../servers/chat-service && npm run dev" \
  "cd ../servers/socket-service && npm run dev" \
  "cd ../servers/cart-service && npm run dev" \
  # "cd ../servers/review-service && npm run dev" \
  # "cd ../servers/order-service && npm run dev" \

