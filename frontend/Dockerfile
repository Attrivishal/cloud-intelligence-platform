# ---- Dependencies Stage ----
FROM node:20-alpine AS dependencies

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# ---- Build Stage ----
FROM dependencies AS builder

WORKDIR /app

# Copy the rest of the source code
COPY . .

# Build the Next.js application for production
RUN npm run build

# ---- Final / Production Stage ----
FROM node:20-alpine AS final

WORKDIR /app

ENV NODE_ENV=production

# Copy only what's needed to run the app
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Expose the port Next.js runs on
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start the server
CMD ["node", "server.js"]
