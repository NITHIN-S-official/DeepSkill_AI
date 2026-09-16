import sys
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Centralized configuration (handles all dotenv loading)
from config import PythonConfig
from routes import router

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format=f"[v{PythonConfig.RUNTIME_VERSION}] %(levelname)s: %(message)s",
)
logger = logging.getLogger("deepskill")

# Startup validation
validation = PythonConfig.validate()
for msg in validation["fatal"]:
    logger.critical(f"FATAL: {msg}")
for msg in validation["warnings"]:
    logger.warning(f"WARNING: {msg}")
for msg in validation["info"]:
    logger.info(msg)

if validation["fatal"]:
    logger.critical("Fatal configuration errors detected. Exiting.")
    sys.exit(1)

PythonConfig.print_banner()

app = FastAPI(
    title="DeepSkill AI microservice",
    description="Python FastAPI service for hybrid resume analysis (Gemini, Vector, Offline)",
    version="1.0.0",
)

# CORS Setup — use configured origin
cors_origins = [PythonConfig.CORS_ORIGIN]
# Also allow the backend to reach us in Docker
if PythonConfig.DEPLOYMENT_MODE == "docker":
    cors_origins.append("http://backend:5000")

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include router
app.include_router(router)


@app.get("/")
def read_root():
    return {
        "status": "healthy",
        "service": "DeepSkill AI Service",
        "version": PythonConfig.RUNTIME_VERSION,
        "deployment_mode": PythonConfig.DEPLOYMENT_MODE,
        "ai_mode": PythonConfig.AI_MODE,
        "engines": {
            "gemini": "ENABLED" if PythonConfig.GEMINI_API_KEY else "DISABLED (API key missing)",
            "vector": "ENABLED",
            "offline_fallback": "ENABLED",
        },
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "runtime_version": PythonConfig.RUNTIME_VERSION,
        "deployment_mode": PythonConfig.DEPLOYMENT_MODE,
        "ai_mode": PythonConfig.AI_MODE,
        "provider": PythonConfig.AI_PROVIDER,
        "gemini_available": bool(PythonConfig.GEMINI_API_KEY),
        "offline_available": True,
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host=PythonConfig.HOST,
        port=PythonConfig.PORT,
        reload=True,
    )
