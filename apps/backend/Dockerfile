FROM oven/bun:1.1.34 as builder

WORKDIR /app

COPY package.json bun.lockb ./
COPY apps ./apps
COPY packages ./packages

RUN bun install --frozen-lockfile

WORKDIR /app/apps/backend

RUN bun install --frozen-lockfile && \
  bun run build src/index.ts

FROM oven/bun:1.1.34 as runtime

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/apps/backend /app

EXPOSE 3000

CMD ["bun", "run", "dev"]

