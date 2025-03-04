#!/bin/bash

# Move to the project root directory (if running from a different location)
cd "$(dirname "$0")"

# Start all services using concurrently
npx concurrently --names "GATEWAY,AUTH,USERS,PRODUCTS,CHAT" --prefix-colors "blue,green,magenta,white,cyan" \
  "cd ../servers/gateway-service && npm run dev" \
  "cd ../servers/auth-service && npm run dev" \
  "cd ../servers/users-service && npm run dev" \
  "cd ../servers/products-service && npm run dev" \
  "cd ../servers/chat-service && npm run dev" 
