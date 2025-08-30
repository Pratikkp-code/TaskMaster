# --- Stage 1: Install Dependencies ---
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install

# --- Stage 2: Build the Application ---
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# IMPORTANT: Define the build arguments
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

# --- Stage 3: Run the Application ---
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

# The ARG variables must be re-declared in the final stage to be available at RUNTIME
ARG NEXT_PUBLIC_AUTH_API_URL
ARG NEXT_PUBLIC_TASK_API_URL
ARG NEXT_PUBLIC_REALTIME_API_URL
ARG NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

# And then re-exposed as environment variables
ENV NEXT_PUBLIC_AUTH_API_URL=$NEXT_PUBLIC_AUTH_API_URL
ENV NEXT_PUBLIC_TASK_API_URL=$NEXT_PUBLIC_TASK_API_URL
ENV NEXT_PUBLIC_REALTIME_API_URL=$NEXT_PUBLIC_REALTIME_API_URL
ENV NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=$NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

CMD ["node", "server.js"]