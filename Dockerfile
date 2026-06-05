# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Next.js NEXT_PUBLIC_* vars are resolved from .env.production at build
# time (next build reads .env.$NODE_ENV automatically). The previous
# ARG/ENV chain silently clobbered those values to "" when the image was
# built without --build-arg flags (which is the case for
# `gcloud run deploy --source=.`), producing a frontend that called
# relative URLs and 404'd. Keeping .env.production as the single source
# of truth removes that footgun. Override locally via .env.production.local
# if needed.

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 8080

ENV PORT=8080
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
