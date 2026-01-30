FROM oven/bun:1-alpine

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install

COPY src ./src
COPY drizzle.config.ts .
# COPY .env . # We will pass env vars via docker-compose

EXPOSE 3000

CMD ["bun", "run", "src/index.ts"]
