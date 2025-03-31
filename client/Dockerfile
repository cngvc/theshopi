FROM oven/bun:canary-alpine AS builder

WORKDIR /app

ARG NEXT_PUBLIC_SERVER_URL
ARG NEXT_PUBLIC_GATEWAY_URL

ENV NEXT_PUBLIC_SERVER_URL=$NEXT_PUBLIC_SERVER_URL \
  NEXT_PUBLIC_GATEWAY_URL=$NEXT_PUBLIC_GATEWAY_URL


COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile --cache

COPY . .
RUN bun run build

FROM oven/bun:canary-alpine AS runner
WORKDIR /app

COPY --from=builder /app/ /app

ENV NEXT_PUBLIC_SERVER_URL=$NEXT_PUBLIC_SERVER_URL \
  NEXT_PUBLIC_GATEWAY_URL=$NEXT_PUBLIC_GATEWAY_URL

CMD ["bun", "run", "start"]
