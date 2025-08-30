# --- Stage 1: Install Dependencies ---
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --frozen-lockfile

# --- Stage 2: Build the Application ---
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Pass in the production URLs as build arguments
ARG NEXT_PUBLIC_AUTH_API_URL
ARG NEXT_PUBLIC_TASK_API_URL
ARG NEXT_PUBLIC_REALTIME_API_URL
ARG NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

# Expose them as environment variables during the build
ENV NEXT_PUBLIC_AUTH_API_URL=$NEXT_PUBLIC_AUTH_API_URL
ENV NEXT_PUBLIC_TASK_API_URL=$NEXT_PUBLIC_TASK_API_URL
ENV NEXT_PUBLIC_REALTIME_API_URL=$NEXT_PUBLIC_REALTIME_API_URL
ENV NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=$NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

RUN npm run build

# --- Stage 3: Production Runner ---
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# --- THIS IS THE CRITICAL FIX ---
# 1. Copy the entire 'standalone' output directory
COPY --from=builder /app/.next/standalone ./
# 2. Copy the 'public' and '.next/static' folders into their correct
#    locations WITHIN the 'standalone' directory structure.
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static
# -----------------------------

USER nextjs

EXPOSE 3000
ENV PORT 3000

# This is the correct command to run a standalone server.
# The server.js file is located inside the 'standalone' directory.
CMD ["node", "server.js"]