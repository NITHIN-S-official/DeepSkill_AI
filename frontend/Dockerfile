# Stage 1: Build the React application
FROM node:18-alpine AS build

WORKDIR /app

# Receive the API URL from Docker Compose
ARG VITE_API_URL=http://localhost:5000
ENV VITE_API_URL=$VITE_API_URL

# Copy package lock and descriptor
COPY package*.json ./

# Install packages
RUN npm ci || npm install

# Copy frontend source files
COPY . .

# Build Vite app
RUN npm run build

# Stage 2: Serve the application using Nginx
FROM nginx:alpine

# Copy built assets from Stage 1 to Nginx default html path
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration to support port 3000
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]