import os
import logging
from pathlib import Path
from dotenv import load_dotenv

logger = logging.getLogger("deepskill.config")

_root = Path(__file__).parent.parent

# Step 1: Load root .env (generic defaults)
load_dotenv(_root / ".env")

# Step 2: Selectively load ONLY the matching env file
_deployment_mode = os.getenv("DEPLOYMENT_MODE", "local")
if _deployment_mode == "docker":
    load_dotenv(_root / ".env.docker", override=True)
else:
    load_dotenv(_root / ".env.local", override=True)

# Step 3: Load service-local defaults (last resort, no override)
load_dotenv(Path(__file__).parent / ".env")


def _resolve_version(dep, ai):
    return {
        "local:offline": "1.1",
        "local:online": "1.2",
        "docker:offline": "2.1",
        "docker:online": "2.2",
    }.get(f"{dep}:{ai}", "unknown")


class PythonConfig:
    DEPLOYMENT_MODE = os.getenv("DEPLOYMENT_MODE", "local")
    AI_MODE = os.getenv("AI_MODE", "online")
    AI_PROVIDER = os.getenv("AI_PROVIDER", "gemini")
    RUNTIME_VERSION = _resolve_version(
        os.getenv("DEPLOYMENT_MODE", "local"),
        os.getenv("AI_MODE", "online"),
    )

    PORT = int(os.getenv("PYTHON_PORT", os.getenv("PORT", "8000")))
    HOST = os.getenv("HOST", "0.0.0.0")

    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
    HF_TOKEN = os.getenv("HF_TOKEN", "")
    USE_HYBRID_AI = os.getenv("USE_HYBRID_AI", "true").lower() == "true"
    CORS_ORIGIN = os.getenv("CORS_ORIGIN", "http://localhost:3000")

    @classmethod
    def validate(cls):
        fatal = []
        warnings = []
        info = []

        if cls.DEPLOYMENT_MODE not in ("local", "docker"):
            fatal.append(f'Invalid DEPLOYMENT_MODE: "{cls.DEPLOYMENT_MODE}". Must be "local" or "docker".')
        if cls.AI_MODE not in ("offline", "online"):
            fatal.append(f'Invalid AI_MODE: "{cls.AI_MODE}". Must be "offline" or "online".')
        if cls.AI_MODE == "online" and not cls.GEMINI_API_KEY:
            warnings.append(
                "GEMINI_API_KEY not set. Online AI unavailable - Offline fallback will be used."
            )

        info.append(f"Runtime Version: {cls.RUNTIME_VERSION}")
        info.append(
            f"Deployment: {cls.DEPLOYMENT_MODE} | AI: {cls.AI_MODE} | Provider: {cls.AI_PROVIDER}"
        )
        return {"fatal": fatal, "warnings": warnings, "info": info}

    @classmethod
    def print_banner(cls):
        key_status = "configured" if cls.GEMINI_API_KEY else "NOT SET (offline only)"
        print(
            f"""
+----------------------------------------------+
|       DeepSkill AI - Python Service          |
+----------------------------------------------+
|  Runtime Version : {cls.RUNTIME_VERSION:<25}|
|  Deployment Mode : {cls.DEPLOYMENT_MODE:<25}|
|  AI Mode         : {cls.AI_MODE:<25}|
|  AI Provider     : {cls.AI_PROVIDER:<25}|
|  Service Port    : {str(cls.PORT):<25}|
|  Gemini Key      : {key_status:<25}|
+----------------------------------------------+
"""
        )

