FROM node:22-alpine as builder

WORKDIR /app
COPY package*.json ./
COPY tsconfig.json ./
COPY src ./src
RUN npm i -g npm@latest
RUN npm ci && npm run build

FROM node:22-alpine

WORKDIR /app
RUN apk add --no-cache curl
COPY package*.json ./
COPY tsconfig.json ./
RUN npm i -g pm2 npm@latest
RUN npm ci --production
COPY --from=builder /app/build ./build
EXPOSE 4011
CMD [ "npm", "run", "start" ]
