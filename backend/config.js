import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// ── Selective Environment Loading ──────────────────────────
// Step 1: Load root .env (generic defaults, always loaded)
dotenv.config({ path: path.join(rootDir, '.env') });

// Step 2: Load ONLY the mode-specific override file
const deploymentMode = process.env.DEPLOYMENT_MODE || 'local';
if (deploymentMode === 'docker') {
  dotenv.config({ path: path.join(rootDir, '.env.docker'), override: true });
} else {
  dotenv.config({ path: path.join(rootDir, '.env.local'), override: true });
}

// ── Version Resolver ───────────────────────────────────────
function resolveVersion(depMode, aiMode) {
  const map = {
    'local:offline': '1.1',
    'local:online': '1.2',
    'docker:offline': '2.1',
    'docker:online': '2.2',
  };
  return map[`${depMode}:${aiMode}`] || 'unknown';
}

const aiMode = process.env.AI_MODE || 'online';

export const BackendConfig = {
  // Runtime
  DEPLOYMENT_MODE: deploymentMode,
  AI_MODE: aiMode,
  AI_PROVIDER: process.env.AI_PROVIDER || 'gemini',
  RUNTIME_VERSION: resolveVersion(deploymentMode, aiMode),
  NODE_ENV: process.env.NODE_ENV || 'development',

  // Network
  PORT: parseInt(process.env.PORT || '5000', 10),
  PYTHON_SERVICE_URL: process.env.PYTHON_SERVICE_URL || 'http://localhost:8000',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/deepskill',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',

  // Feature flags
  USE_HYBRID_AI: (process.env.USE_HYBRID_AI || 'true').toLowerCase() === 'true',
};

// ── Three-Tier Startup Validation ──────────────────────────
export function validateConfig() {
  const fatal = [];
  const warnings = [];
  const info = [];

  // FATAL checks
  if (!['local', 'docker'].includes(BackendConfig.DEPLOYMENT_MODE)) {
    fatal.push(`Invalid DEPLOYMENT_MODE: "${BackendConfig.DEPLOYMENT_MODE}". Must be "local" or "docker".`);
  }
  if (!['offline', 'online'].includes(BackendConfig.AI_MODE)) {
    fatal.push(`Invalid AI_MODE: "${BackendConfig.AI_MODE}". Must be "offline" or "online".`);
  }
  if (!BackendConfig.MONGODB_URI) {
    fatal.push('MONGODB_URI is required.');
  }
  if (!BackendConfig.PYTHON_SERVICE_URL) {
    fatal.push('PYTHON_SERVICE_URL is required.');
  }
  if (!BackendConfig.CORS_ORIGIN) {
    fatal.push('CORS_ORIGIN is required.');
  }

  // WARNING checks (non-blocking)
  if (BackendConfig.AI_MODE === 'online' && !process.env.GEMINI_API_KEY) {
    warnings.push('GEMINI_API_KEY not set. Online AI unavailable - Offline fallback will be used.');
  }
  if (BackendConfig.DEPLOYMENT_MODE === 'docker' && BackendConfig.PYTHON_SERVICE_URL.includes('localhost')) {
    warnings.push('PYTHON_SERVICE_URL uses localhost but DEPLOYMENT_MODE=docker. Expected Docker service name.');
  }
  if (BackendConfig.DEPLOYMENT_MODE === 'local' && BackendConfig.PYTHON_SERVICE_URL.includes('ai_service')) {
    warnings.push('PYTHON_SERVICE_URL uses Docker hostname but DEPLOYMENT_MODE=local. Expected localhost.');
  }

  // INFO
  info.push(`Runtime Version: ${BackendConfig.RUNTIME_VERSION}`);
  info.push(`Deployment: ${BackendConfig.DEPLOYMENT_MODE} | AI: ${BackendConfig.AI_MODE} | Provider: ${BackendConfig.AI_PROVIDER}`);

  return { fatal, warnings, info };
}

// -- Startup Banner -----------------------------------------
export function printStartupBanner() {
  const c = BackendConfig;
  console.log(`
+----------------------------------------------+
|           DeepSkill AI - Backend             |
+----------------------------------------------+
|  Runtime Version : ${c.RUNTIME_VERSION.padEnd(25)}|
|  Deployment Mode : ${c.DEPLOYMENT_MODE.padEnd(25)}|
|  AI Mode         : ${c.AI_MODE.padEnd(25)}|
|  AI Provider     : ${c.AI_PROVIDER.padEnd(25)}|
|  Backend Port    : ${String(c.PORT).padEnd(25)}|
|  Python Service  : ${c.PYTHON_SERVICE_URL.padEnd(25)}|
|  CORS Origin     : ${c.CORS_ORIGIN.padEnd(25)}|
|  Environment     : ${c.NODE_ENV.padEnd(25)}|
+----------------------------------------------+
`);
}
