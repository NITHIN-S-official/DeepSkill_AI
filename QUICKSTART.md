# ⚡ QuickStart - DeepSkill AI

Get up and running in **5 minutes**!

## Prerequisites

- ✅ Node.js v16+ installed
- ✅ MongoDB running
- ✅ Two terminal windows ready

---

## Step 1: Start MongoDB

**Windows:**
```powershell
net start MongoDB
```

**macOS:**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

---

## Step 2: Start Backend (Terminal 1)

```bash
cd backend
npm install
cp .env.example .env
npm start
```

**Wait for:**
```
✓ Connected to MongoDB
✓ Initialized 100+ roles in database
🚀 DeepSkill AI Backend running on port 5000
```

---

## Step 3: Start Frontend (Terminal 2)

```bash
cd frontend
npm install
npm run dev
```

**Wait for:**
```
➜  Local:   http://localhost:3000/
```

---

## Step 4: Open Application

Open browser: **http://localhost:3000**

---

## Quick Test (2 Minutes)

1. Click **"Analyze Your Resume"**
2. Click **"Paste Resume"** tab
3. Paste this sample:

```
John Doe
Full Stack Developer | john@email.com | +1234567890

SKILLS
JavaScript, React, Node.js, MongoDB, Express, HTML, CSS, Git, Python, SQL

EXPERIENCE
Software Developer at Tech Corp (2022 - Present)
- Developed responsive web applications using React and Node.js
- Built RESTful APIs with Express.js and MongoDB
- Collaborated with team of 5 developers
- Implemented authentication and authorization features

PROJECTS
E-Commerce Platform
- Built full-stack application using MERN stack
- Integrated payment gateway and user authentication
- Deployed on AWS with CI/CD pipeline

Task Management App
- Created React-based task manager with real-time updates
- Used Node.js backend with WebSocket connections

EDUCATION
Bachelor of Technology in Computer Science
University Name | 2018 - 2022 | GPA: 3.8/4.0
```

4. Click **"Process Resume Text"**
5. Click **"Select Roles"**
6. Select: **React Developer**, **Full Stack Developer**, **Node.js Developer**
7. Click **"Analyze (3 roles)"** at bottom
8. View results in 1-2 seconds! 🎉

---

## Verify Offline Mode

1. **Disconnect from internet** 
2. Try the flow again
3. It still works! ✅

---

## Troubleshooting

### MongoDB not starting?

**Windows:**
```powershell
# Check status
sc query MongoDB

# If not installed, download from mongodb.com
```

**macOS/Linux:**
```bash
# Check if running
mongod --version

# If error, reinstall MongoDB
```

### Port already in use?

Change in `backend/.env`:
```
PORT=5001
```

And in `frontend/vite.config.js`:
```javascript
server: { port: 3001 }
```

### npm install taking long?

This is normal - first time installation downloads all dependencies (~200MB total)

---

## What's Next?

✅ **Explore the UI** - Click through all pages
✅ **Read README.md** - Full documentation
✅ **Check TECH_DAY_CHECKLIST.md** - Validation
✅ **Try different roles** - 100+ available!

---

## Project Structure

```
📁 backend/          → Express API + MongoDB
📁 frontend/         → React UI + Tailwind
📄 README.md         → Full documentation
📄 SETUP_GUIDE.md    → Detailed setup
📄 TECH_DAY_CHECKLIST.md → Validation checklist
```

---

## Key Features to Demo

1. **Offline-capable** - No API keys needed
2. **Multi-Role Analysis** - 1-5 roles at once
3. **Smart Matching** - 200+ skills recognized
4. **ATS Optimization** - Keyword analysis
5. **Detailed Suggestions** - Section-by-section
6. **Beautiful UI** - Smooth animations

---

## Need Help?

- 📖 Full Setup: `SETUP_GUIDE.md`
- ✅ Validation: `TECH_DAY_CHECKLIST.md`
- 🚀 Deploy: `DEPLOYMENT.md`
- 📝 Summary: `PROJECT_SUMMARY.md`

---

**You're all set! Happy analyzing! 🎯**
