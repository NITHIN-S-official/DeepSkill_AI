FROM node:18-alpine

WORKDIR /app

# Copy package descriptors first for layer caching
COPY package*.json ./

# Install dependencies (ignoring devDependencies for production)
RUN npm ci --omit=dev || npm install --omit=dev

# Copy application files
COPY . .

EXPOSE 5000

CMD ["npm", "start"]
