FROM node:20-alpine AS builder

WORKDIR /app/client

COPY client/package*.json ./

RUN npm ci

COPY client/ .

RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY server/package*.json ./

RUN npm ci --omit=dev

COPY server/ .

COPY --from=builder /app/client/.next/standalone ./public

COPY --from=builder /app/client/.next/static ./public/.next/static

COPY --from=builder /app/client/public ./public/public

EXPOSE 3000

CMD ["node", "index.js"]