# Build stage
FROM node:24-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --force

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Runtime stage - use nginx for proper SPA routing
FROM nginx:alpine

# Copy built application from builder stage
COPY --from=builder /app/dist/frontend/browser /usr/share/nginx/html

# Copy nginx config for SPA fallback
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 4200

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
