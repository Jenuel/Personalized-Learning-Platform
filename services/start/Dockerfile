FROM node:20-alpine AS deps

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production && cp -r node_modules /prod_node_modules
RUN npm ci

FROM node:20-alpine AS production

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 appuser

WORKDIR /app

COPY --from=deps /prod_node_modules ./node_modules
COPY --chown=appuser:nodejs . .

USER appuser

EXPOSE 6060

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -qO- http://localhost:6060/health || exit 1

CMD ["node", "index.js"]