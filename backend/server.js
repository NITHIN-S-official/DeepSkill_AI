import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import multer from 'multer';
import pdfParse from 'pdf-parse';
import { analyzeResume, generateProjectIdeas, generateBulletTransformations } from './utils/analysisEngine.js';
import { ROLES_DATABASE, searchRoles, getAllCategories } from './utils/roleDatabase.js';
import Role from './models/Role.js';
import mammoth from "mammoth";
import { BackendConfig, validateConfig, printStartupBanner } from './config.js';

// Startup validation
const validation = validateConfig();
validation.fatal.forEach(msg => console.error(`FATAL: ${msg}`));
validation.warnings.forEach(msg => console.warn(`WARNING: ${msg}`));
validation.info.forEach(msg => console.log(`INFO: ${msg}`));

if (validation.fatal.length > 0) {
  console.error('Fatal configuration errors detected. Exiting.');
  process.exit(1);
}

printStartupBanner();

const app = express();
const PORT = BackendConfig.PORT;

// Middleware
app.use(cors({ origin: BackendConfig.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, DOCX, and TXT allowed.'));
    }
  }
});

// MongoDB connection
mongoose.connect(BackendConfig.MONGODB_URI)
  .then(async () => {
    console.log('✓ Connected to MongoDB');
    // Initialize roles database
    await initializeRoles();
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Initialize roles in database
async function initializeRoles() {
  try {
    const count = await Role.countDocuments();
    if (count === 0) {
      await Role.insertMany(ROLES_DATABASE);
      console.log(`✓ Initialized ${ROLES_DATABASE.length} roles in database`);
    }
  } catch (error) {
    console.error('Error initializing roles:', error);
  }
}

// Routes

// Health check (enhanced)
app.get('/api/health', async (req, res) => {
  const health = {
    status: 'ok',
    version: BackendConfig.RUNTIME_VERSION,
    deployment_mode: BackendConfig.DEPLOYMENT_MODE,
    ai_mode: BackendConfig.AI_MODE,
    provider: BackendConfig.AI_PROVIDER,
    services: {
      mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      python: 'unknown',
    },
    timestamp: new Date().toISOString(),
  };
  try {
    const resp = await fetch(`${BackendConfig.PYTHON_SERVICE_URL}/health`);
    health.services.python = resp.ok ? 'connected' : 'disconnected';
  } catch {
    health.services.python = 'disconnected';
  }
  res.json(health);
});

// Version endpoint
app.get('/api/version', (req, res) => {
  res.json({
    version: BackendConfig.RUNTIME_VERSION,
    deployment_mode: BackendConfig.DEPLOYMENT_MODE,
    ai_mode: BackendConfig.AI_MODE,
    provider: BackendConfig.AI_PROVIDER,
  });
});

// AI health
app.get('/api/health/ai', async (req, res) => {
  const status = {
    ai_mode: BackendConfig.AI_MODE,
    provider: BackendConfig.AI_PROVIDER,
    online_status: 'unknown',
    offline_status: 'available',
  };
  try {
    const resp = await fetch(`${BackendConfig.PYTHON_SERVICE_URL}/health`);
    const data = await resp.json();
    status.online_status = data.gemini_available ? 'available' : 'unavailable';
  } catch {
    status.online_status = 'unreachable';
  }
  res.json(status);
});

// Database health
app.get('/api/health/database', (req, res) => {
  res.json({
    status: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    deployment_mode: BackendConfig.DEPLOYMENT_MODE,
  });
});

// Get all roles
app.get('/api/roles', async (req, res) => {
  try {
    const { search, category } = req.query;
    
    let roles = ROLES_DATABASE;
    
    if (search) {
      roles = searchRoles(search);
    }
    
    if (category && category !== 'All') {
      roles = roles.filter(role => role.category === category);
    }
    
    res.json({ roles });
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({ error: 'Failed to fetch roles' });
  }
});

// Get all categories
app.get('/api/categories', (req, res) => {
  try {
    const categories = getAllCategories();
    res.json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Parse resume file
app.post('/api/parse-resume', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    let text = '';
    
    if (req.file.mimetype === "application/pdf") {
        const pdfData = await pdfParse(req.file.buffer);
        text = pdfData.text;
    } else if (
        req.file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) { 
        const result = await mammoth.extractRawText({
        buffer: req.file.buffer
    });

    text = result.value;

    } else if (req.file.mimetype === "text/plain") {
        text = req.file.buffer.toString("utf8");
    } else if (req.file.mimetype === "application/msword") {
        return res.status(400).json({
            success: false,
            error: "Legacy .doc files are not supported. Please upload a .docx, PDF, or TXT file."
    });

} else {

    return res.status(400).json({
        success: false,
        error: "Unsupported file format."
    });

}
    const cleanedText = text.replace(/\s+/g, " ").trim();

    if (cleanedText.length < 50) {
        return res.status(400).json({
            success: false,
            error: "Unable to extract readable text from the uploaded resume."
        });
}

    res.json({
      success: true,
      text: cleanedText,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      wordCount: cleanedText.split(/\s+/).length
    });
  } catch (error) {
    console.error('Error parsing resume:', error);
    res.status(500).json({ error: 'Failed to parse resume file' });
  }
});

// Analyze resume
app.post('/api/analyze', async (req, res) => {
  try {
    const { resumeText, selectedRoles } = req.body;

    if (!resumeText || !resumeText.trim()) {
      return res.status(400).json({ error: 'Resume text is required' });
    }

    if (!selectedRoles || !Array.isArray(selectedRoles) || selectedRoles.length === 0) {
      return res.status(400).json({ error: 'At least one role must be selected' });
    }

    if (selectedRoles.length > 5) {
      return res.status(400).json({ error: 'Maximum 5 roles can be analyzed at once' });
    }

    const pythonServiceUrl = BackendConfig.PYTHON_SERVICE_URL;
    const analysisStartTime = Date.now();

    // Call Python FastAPI microservice using native fetch (Node 18+)
    const response = await fetch(`${pythonServiceUrl}/api/v1/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        resume_text: resumeText,
        target_roles: selectedRoles
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Python service responded with status ${response.status}: ${errText}`);
    }

    const pyData = await response.json();
    const analysisTime = Date.now() - analysisStartTime;

    // Map Python response format to React frontend expectations
    const mappedResults = pyData.results.map(result => {
      // Find role info from local DB
      const role = ROLES_DATABASE.find(r => r.id === result.role) || {
        id: result.role,
        title: result.role,
        skills: [],
        keywords: []
      };

      // Re-structure suggestions from flat array back to UI categories
      const suggestionsObj = {
        summary: [],
        skills: [],
        experience: [],
        projects: [],
        ats: [],
        learning: []
      };

      if (Array.isArray(result.suggestions)) {
        result.suggestions.forEach(s => {
          if (s.startsWith('Summary: ')) suggestionsObj.summary.push(s.substring(9));
          else if (s.startsWith('Skills: ')) suggestionsObj.skills.push(s.substring(8));
          else if (s.startsWith('Experience: ')) suggestionsObj.experience.push(s.substring(12));
          else if (s.startsWith('Projects: ')) suggestionsObj.projects.push(s.substring(10));
          else if (s.startsWith('ATS: ')) suggestionsObj.ats.push(s.substring(5));
          else if (s.startsWith('Learning: ')) suggestionsObj.learning.push(s.substring(10));
          else suggestionsObj.skills.push(s); // fallback
        });
      }

      // Generate descriptive analysis text suitable for CircularProgress score header
      const matchingStr = result.matching_skills.length > 0 
        ? `You show proficiency in key skills including: ${result.matching_skills.slice(0, 3).join(', ')}.` 
        : 'No matches found for required skills.';
      const missingStr = result.missing_skills.length > 0 
        ? `To improve compatibility, consider developing: ${result.missing_skills.slice(0, 3).join(', ')}.` 
        : 'No key skills are missing.';
      const analysisText = `Based on your resume, your profile shows compatibility with the ${role.title} role. ${matchingStr} ${missingStr}`;

      return {
        roleId: role.id,
        roleTitle: role.title,
        compatibilityScore: result.compatibility_score,
        matchingSkills: result.matching_skills,
        missingSkills: result.missing_skills,
        skillsToImprove: result.missing_skills.slice(0, 3), // present in missing or low density
        toolsToLearn: result.missing_skills.slice(0, 5),
        atsKeywords: result.ats_keywords.map(kw => ({ keyword: kw.keyword, count: kw.frequency })),
        analysis: analysisText,
        suggestions: suggestionsObj
      };
    });

    console.log(`[v${BackendConfig.RUNTIME_VERSION}] ✓ Analysis completed via ${pyData.mode_used} (fallback: ${pyData.fallback_used || false}) in ${analysisTime}ms for ${selectedRoles.length} roles`);

    res.json({ 
      success: true,
      results: mappedResults,
      analysisTime,
      mode_used: pyData.mode_used || 'unknown',
      provider: pyData.provider || 'unknown',
      fallback_used: pyData.fallback_used || false,
      fallback_reason: pyData.fallback_reason || '',
      runtime_version: pyData.runtime_version || BackendConfig.RUNTIME_VERSION,
    });
  } catch (error) {
    console.error(`[v${BackendConfig.RUNTIME_VERSION}] Error analyzing resume:`, error.message);
    res.status(503).json({
      success: false,
      error_code: 'AI_SERVICE_UNAVAILABLE',
      message: 'Analysis service could not be reached. Please ensure the Python AI service is running.',
      fallback_used: false,
    });
  }
});

// Get detailed suggestions
app.post('/api/suggestions', async (req, res) => {
  try {
    const { roleId, resumeText, analysisResult } = req.body;

    if (!roleId) {
      return res.status(400).json({ error: 'Role ID is required' });
    }

    const role = ROLES_DATABASE.find(r => r.id === roleId);
    if (!role) {
      return res.status(404).json({ error: 'Role not found' });
    }

    // Generate project ideas and bullet transformations
    const projectIdeas = generateProjectIdeas(role, analysisResult?.matchingSkills || []);
    const bulletTransformations = generateBulletTransformations(role);

    res.json({
      success: true,
      projectIdeas,
      bulletTransformations,
      learningResources: [
        {
          title: `Master ${role.skills[0]}`,
          description: `Complete comprehensive tutorials and build real-world projects`,
          type: 'Tutorial',
          skills: [role.skills[0]]
        },
        {
          title: `${role.title} Bootcamp`,
          description: `Structured learning path covering all essential skills`,
          type: 'Course',
          skills: role.skills.slice(0, 3)
        },
        {
          title: `Open Source Contributions`,
          description: `Contribute to projects using ${role.skills[0]} and ${role.skills[1]}`,
          type: 'Practice',
          skills: role.skills.slice(0, 2)
        },
        {
          title: `Build Portfolio Projects`,
          description: `Create 3-5 projects showcasing ${role.title} skills`,
          type: 'Project',
          skills: role.skills
        }
      ]
    });
  } catch (error) {
    console.error('Error generating suggestions:', error);
    res.status(500).json({ error: 'Failed to generate suggestions' });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ 
    error: error.message || 'Internal server error' 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 DeepSkill AI Backend v${BackendConfig.RUNTIME_VERSION} running on port ${PORT}`);
  console.log(`📊 AI Mode: ${BackendConfig.AI_MODE} | Provider: ${BackendConfig.AI_PROVIDER}`);
  console.log(`🎯 ${ROLES_DATABASE.length} roles available\n`);
});

export default app;
