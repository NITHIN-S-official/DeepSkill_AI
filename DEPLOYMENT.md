# 🚀 Deployment Guide

## Production Build

### Frontend Build

```bash
cd frontend
npm run build
```

This creates an optimized production build in `frontend/dist/`

### Backend Production

The backend runs the same in production, but ensure:
- `NODE_ENV=production` in `.env`
- MongoDB connection is secure
- Proper error logging is enabled

## Deployment Options

### Option 1: Single Server (Recommended for Demo)

Deploy both frontend and backend on the same server:

```bash
# Frontend as static files
cd frontend
npm run build

# Serve static files from backend
# Add this to backend/server.js:
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files (add after other routes)
app.use(express.static(path.join(__dirname, '../frontend/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});
```

### Option 2: Separate Deployment

**Frontend:** Deploy to Vercel, Netlify, or any static host
**Backend:** Deploy to Heroku, Railway, Render, or DigitalOcean

Update frontend API base URL:
```javascript
// frontend/src/api/config.js
const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:5000';
```

## Environment Variables

### Backend (.env)
```bash
PORT=5000
MONGODB_URI=mongodb://your-production-uri
NODE_ENV=production
```

### Frontend (.env.production)
```bash
VITE_API_URL=https://your-backend-url.com
```

## MongoDB Production

### Option 1: MongoDB Atlas (Recommended)
1. Create free cluster at https://mongodb.com/cloud/atlas
2. Whitelist IP addresses
3. Create database user
4. Get connection string
5. Update `MONGODB_URI` in backend `.env`

### Option 2: Self-hosted MongoDB
1. Install MongoDB on server
2. Enable authentication
3. Configure firewall rules
4. Use connection string with auth

## Security Checklist

- [ ] Environment variables not exposed
- [ ] MongoDB authentication enabled
- [ ] CORS configured for production domains
- [ ] File upload size limits enforced
- [ ] Rate limiting added (optional)
- [ ] HTTPS enabled
- [ ] Error messages don't expose sensitive info

## Performance Optimization

### Frontend
- [x] Vite build optimization
- [x] Code splitting
- [x] Lazy loading routes (optional)
- [x] Image optimization
- [x] Minification

### Backend
- [ ] Enable gzip compression
- [ ] Add caching headers
- [ ] MongoDB indexing
- [ ] Connection pooling

## Monitoring

Consider adding:
- Error tracking (Sentry)
- Performance monitoring
- Uptime monitoring
- Log aggregation

## Backup Strategy

### MongoDB Backup
```bash
# Manual backup
mongodump --uri="mongodb://..." --out=/backup/path

# Restore
mongorestore --uri="mongodb://..." /backup/path
```

### Automated Backups
- Use MongoDB Atlas automated backups
- Schedule daily dumps
- Store in cloud storage (S3, etc.)

## Scaling Considerations

### Horizontal Scaling
- Add more backend instances
- Use load balancer
- Session management (if added)

### Database Scaling
- MongoDB replica sets
- Sharding for large datasets
- Read replicas

## Docker Deployment (Optional)

### Dockerfile - Backend
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
```

### Dockerfile - Frontend
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### docker-compose.yml
```yaml
version: '3.8'
services:
  mongodb:
    image: mongo:5
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    depends_on:
      - mongodb
    environment:
      MONGODB_URI: mongodb://admin:password@mongodb:27017/deepskill?authSource=admin
      PORT: 5000
      NODE_ENV: production

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  mongodb_data:
```

## Quick Deploy Commands

```bash
# Pull latest code
git pull origin main

# Backend
cd backend
npm install
pm2 restart deepskill-backend

# Frontend
cd frontend
npm install
npm run build
# Copy dist/ to web server
```

## Post-Deployment Verification

- [ ] Health check endpoint responds
- [ ] All pages load
- [ ] Resume upload works
- [ ] Analysis completes successfully
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Performance acceptable

---

**Note:** For Safe Tech Day demo, local deployment is recommended. Production deployment is optional.
