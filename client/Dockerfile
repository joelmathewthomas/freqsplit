FROM node:20 AS builder

WORKDIR /app

# Copy and install dependencies
COPY client/package.json client/package-lock.json* ./
RUN npm install

# Copy the source code
COPY client/ .

# Build the app using docker mode env
ENV NODE_ENV=production
RUN npm run build -- --mode docker

# Stage 2: Serve with nginx
FROM nginx:stable-alpine AS production

# Copy built frontend from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

