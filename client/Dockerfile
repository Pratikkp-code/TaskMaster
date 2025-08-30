# --- Stage 1: Install Dependencies ---
# Use the same Node.js version you use elsewhere
FROM node:20-alpine AS deps
# Install libc6-compat for Next.js aarch64/Apple Silicon support
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy dependency files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# --- Stage 2: Build the Application ---
# This is where we will inject the production URLs
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# --- THIS IS THE KEY CHANGE ---
# 1. Define the build arguments that Render will pass in.
# These MUST match the names in your render.yaml's `dockerBuildCommand`.
ARG NEXT_PUBLIC_AUTH_API_URL
ARG NEXT_PUBLIC_TASK_API_URL
ARG NEXT_PUBLIC_REALTIME_API_URL
ARG NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

# 2. Expose them as environment variables ONLY during the build process.
# This makes them available to `process.env` during `npm run build`.
ENV NEXT_PUBLIC_AUTH_API_URL=$NEXT_PUBLIC_AUTH_API_URL
ENV NEXT_PUBLIC_TASK_API_URL=$NEXT_PUBLIC_TASK_API_URL
ENV NEXT_PUBLIC_REALTIME_API_URL=$NEXT_PUBLIC_REALTIME_API_URL
ENV NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=$NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
# -----------------------------

# We no longer need `touch .env` because the variables are now real environment variables
RUN npm run build

# --- Stage 3: Run the Application ---
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy only the necessary files from the builder stage
COPY --from=builder /app/public ./public
# The standalone output is smaller and more optimized for production
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

# Set the PORT environment variable for Render
ENV PORT 3000

# The new, optimized way to run a Next.js app in production
CMD ["node", "server.js"]