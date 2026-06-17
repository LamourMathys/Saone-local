FROM node:20-alpine AS builder

WORKDIR /app/client

COPY client/package*.json ./

RUN npm ci

COPY client/ .

RUN npm run build


FROM node:20-alpine AS frontend

WORKDIR /app

COPY --from=builder /app/client/.next/standalone ./

COPY --from=builder /app/client/.next/static ./.next/static

COPY --from=builder /app/client/public ./public

EXPOSE 3001

CMD ["node", "server.js"]


FROM node:20-alpine AS backend

WORKDIR /app

COPY server/package*.json ./

RUN npm ci --omit=dev

COPY server/ .

EXPOSE 3000

CMD ["node", "index.js"]