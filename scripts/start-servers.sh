#!/bin/bash

# Move to the project root directory (if running from a different location)
cd "$(dirname "$0")"

# Start all services using concurrently
npx concurrently \
--names "ga,au,us,pr,ca,or,no,so,on,ch,re" \
--prefix-colors "blue,green,magenta,yellow,white,cyan,brown,indigo,beige,magenta,orange" \
"cd ../servers/gateway-service && npm run dev" \
"cd ../servers/auth-service && npm run dev" \
"cd ../servers/users-service && npm run dev" \
"cd ../servers/products-service && npm run dev" \
"cd ../servers/cart-service && npm run dev" \
"cd ../servers/orders-service && npm run dev" \
"cd ../servers/notification-service && npm run dev" \
# "cd ../servers/socket-service && npm run dev" \
# "cd ../servers/online-status-service && npm run dev" \
# "cd ../servers/chat-service && npm run dev" \
# "cd ../servers/reviews-service && npm run dev" \

