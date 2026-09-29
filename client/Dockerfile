FROM node:18-alpine AS builder
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules

CMD ["npm", "run", "start"]
