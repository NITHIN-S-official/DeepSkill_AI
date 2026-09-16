# 🚀 Quick Setup Guide - DeepSkill AI

## Step-by-Step Installation

### Prerequisites Check

Before starting, verify you have:
- [ ] Node.js v16+ installed (`node --version`)
- [ ] MongoDB installed and running
- [ ] Terminal/Command Prompt access

### Step 1: MongoDB Setup

#### Option A: Local MongoDB (Recommended for Tech Day Demo)

**Windows:**
```powershell
# Check if MongoDB is running
net start MongoDB

# If not running, start it
net start MongoDB
```

**macOS:**
```bash
# Using Homebrew
brew services start mongodb-community

# Or manually
mongod --config /usr/local/etc/mongod.conf
```

**Linux:**
```bash
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### Option B: MongoDB Atlas (Cloud)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string
4. Update `.env` with connection string

### Step 2: Backend Setup

```bash
# Navigate to backend folder
cd backend

# Install dependencies (this may take 2-3 minutes)
npm install

# Create environment file
cp .env.example .env

# The default .env should work for local MongoDB:
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/deepskill
# NODE_ENV=development

# Start the backend
npm start
```

**Expected Output:**
```
🚀 DeepSkill AI Backend running on port 5000
✓ Connected to MongoDB
✓ Initialized 100+ roles in database
📊 Offline Analysis Engine: ACTIVE
```

### Step 3: Frontend Setup

**Open a NEW terminal window** (keep backend running):

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies (this may take 2-3 minutes)
npm install

# Start the development server
npm run dev
```

**Expected Output:**
```
  VITE v5.0.8  ready in 1234 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

### Step 4: Access Application

Open your browser and go to:
```
http://localhost:3000
```

You should see the DeepSkill AI landing page!

## 🧪 Quick Test

### Test the Complete Flow:

1. **Landing Page**: Click "Analyze Your Resume"
2. **Upload Page**: 
   - Click "Paste Resume" tab
   - Paste this sample text:
   ```
   John Doe
   Full Stack Developer
   john@example.com | +1234567890
   
   SKILLS
   JavaScript, React, Node.js, MongoDB, Express, HTML, CSS, Git
   
   EXPERIENCE
   Software Developer at Tech Company
   - Developed web applications using React and Node.js
   - Built RESTful APIs with Express
   - Worked with MongoDB databases
   
   PROJECTS
   E-commerce Platform
   - Built using MERN stack
   - Implemented authentication and payment integration
   
   EDUCATION
   Bachelor of Technology in Computer Science
   ```
   - Click "Process Resume Text"
   - Click "Select Roles"

3. **Role Selection**:
   - Search for "React Developer"
   - Click on the card to select
   - Select 1-2 more roles (e.g., "Full Stack Developer")
   - Click "Analyze" button at bottom

4. **Analysis Results**:
   - Wait 1-2 seconds
   - See compatibility scores with circular progress
   - Review matching/missing skills
   - Click "View Detailed Suggestions"

5. **Improvement Guide**:
   - Expand/collapse sections
   - Review all suggestions
   - Navigate back if needed

## 🔧 Common Issues & Fixes

### Issue: MongoDB Connection Error

**Error:** `MongoServerError: connect ECONNREFUSED`

**Fix:**
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

### Issue: Port Already in Use

**Error:** `Port 5000 is already in use`

**Fix:**
```bash
# Find and kill the process
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -ti:5000 | xargs kill -9

# Or change port in backend/.env
PORT=5001
```

### Issue: Frontend Won't Start

**Error:** `Failed to resolve entry`

**Fix:**
```bash
# Delete node_modules and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Issue: PDF Upload Not Working

**Solution:** Use the "Paste Resume" option instead. This is more reliable for text extraction.

### Issue: Roles Not Loading

**Fix:**
1. Check if backend is running on port 5000
2. Check browser console for errors
3. Verify MongoDB is running
4. Restart backend server

## 📊 Verify Installation

### Backend Health Check

Open browser or use curl:
```bash
curl http://localhost:5000/api/health
```

Should return:
```json
{
  "status": "ok",
  "message": "DeepSkill AI Backend is running"
}
```

### Check Roles Available

```bash
curl http://localhost:5000/api/roles
```

Should return JSON with 100+ roles.

## 🎯 Demo Day Checklist

Before presenting:

- [ ] Backend server is running (port 5000)
- [ ] Frontend server is running (port 3000)
- [ ] MongoDB is connected and roles are loaded
- [ ] Browser has http://localhost:3000 open
- [ ] Sample resume text ready to paste
- [ ] Internet connection NOT required (verify by disconnecting)
- [ ] All pages navigate smoothly
- [ ] Analysis completes in < 2 seconds

## 📱 Browser Compatibility

Tested and working on:
- ✅ Chrome/Edge (v100+)
- ✅ Firefox (v100+)
- ✅ Safari (v15+)

## 💡 Pro Tips

1. **Use Paste Resume** for demos - more reliable than file upload
2. **Select 3-4 roles** for best demo - shows diversity
3. **Keep sample resume ready** - saves time during demo
4. **Open browser console** - helpful for debugging
5. **Test before demo** - run through complete flow once

## 🆘 Emergency Restart

If anything breaks during demo:

```bash
# Terminal 1 - Backend
cd backend
Ctrl+C  # Stop server
npm start  # Restart

# Terminal 2 - Frontend  
cd frontend
Ctrl+C  # Stop server
npm run dev  # Restart

# Browser
Hard refresh: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
```

## ✅ Installation Complete!

You're all set! The application should now be fully functional and ready for demo or evaluation.

**Next Steps:**
- Review the main README.md for detailed documentation
- Check TECH_DAY_CHECKLIST.md for validation
- Test with your own resume

---

**Need help?** Check the Troubleshooting section in README.md
