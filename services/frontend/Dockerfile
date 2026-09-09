FROM node:20-alpine AS deps

WORKDIR /app

COPY package*.json ./
RUN npm ci

FROM node:20-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_AUTH_URL=http://localhost:4000
ARG NEXT_PUBLIC_CARDS_URL=http://localhost:5000
ARG NEXT_PUBLIC_AUTOMATION_URL=http://localhost:7000
ARG NEXT_PUBLIC_ASSESSMENT_URL=http://localhost:6060

ENV NEXT_PUBLIC_AUTH_URL=$NEXT_PUBLIC_AUTH_URL
ENV NEXT_PUBLIC_CARDS_URL=$NEXT_PUBLIC_CARDS_URL
ENV NEXT_PUBLIC_AUTOMATION_URL=$NEXT_PUBLIC_AUTOMATION_URL
ENV NEXT_PUBLIC_ASSESSMENT_URL=$NEXT_PUBLIC_ASSESSMENT_URL

RUN npm run build

FROM node:20-alpine AS production

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

WORKDIR /app

COPY --from=builder /app/public ./public

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
    CMD wget -qO- http://localhost:3000/api/health || exit 1

CMD ["node", "server.js"]
