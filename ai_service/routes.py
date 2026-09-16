import logging
from typing import List, Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from config import PythonConfig
from gemini_analyzer import analyze_gemini
from offline_engine import analyze_offline

logger = logging.getLogger("deepskill.routes")

# Lazy load VectorEngine to prevent startup failures if model files aren't cached yet
vector_engine_instance = None
try:
    from vector_engine import VectorEngine
    vector_engine_instance = VectorEngine()
    logger.info("VectorEngine initialized successfully.")
except Exception as e:
    logger.warning(f"Could not initialize VectorEngine on startup. Fallback to offline will be used: {e}")

router = APIRouter(prefix="/api/v1")


# ── Schemas ─────────────────────────────────────────────────
class AnalysisRequest(BaseModel):
    resume_text: str = Field(..., description="The full plain text of the resume")
    target_roles: List[str] = Field(..., description="List of target role IDs to analyze against")


class ATSKeyword(BaseModel):
    keyword: str
    frequency: int


class BulletTransformation(BaseModel):
    before: str
    after: str


class RoleAnalysisResult(BaseModel):
    role: str
    compatibility_score: int
    matching_skills: List[str]
    missing_skills: List[str]
    ats_keywords: List[ATSKeyword]
    suggestions: List[str]
    bullet_transformations: List[BulletTransformation]


class AnalysisResponse(BaseModel):
    status: str
    mode_used: str
    provider: str = "offline_engine"
    fallback_used: bool = False
    fallback_reason: str = ""
    runtime_version: str = ""
    results: List[RoleAnalysisResult]


# ── Analyze Endpoint ────────────────────────────────────────
@router.post("/analyze", response_model=AnalysisResponse)
def analyze(payload: AnalysisRequest):
    config = PythonConfig
    fallback_reason = ""

    # ── Online Mode: attempt configured provider exactly once ──
    if config.AI_MODE == "online":
        if config.GEMINI_API_KEY:
            try:
                logger.info(f"Attempting {config.AI_PROVIDER} analysis...")
                results = analyze_gemini(
                    payload.resume_text, payload.target_roles, config.GEMINI_API_KEY
                )
                return AnalysisResponse(
                    status="success",
                    mode_used=config.AI_PROVIDER,
                    provider=config.AI_PROVIDER,
                    fallback_used=False,
                    fallback_reason="",
                    runtime_version=config.RUNTIME_VERSION,
                    results=results,
                )
            except Exception as e:
                fallback_reason = str(e)
                logger.warning(
                    f"{config.AI_PROVIDER} analysis failed: {e}. Falling back to offline."
                )
        else:
            fallback_reason = "API key not configured"
            logger.warning("Online AI requested but GEMINI_API_KEY not set. Using offline.")

    # ── Vector Engine (Mode B) ──────────────────────────────
    global vector_engine_instance
    if vector_engine_instance is None:
        try:
            logger.info("Attempting lazy initialization of VectorEngine...")
            from vector_engine import VectorEngine
            vector_engine_instance = VectorEngine()
        except Exception as e:
            logger.warning(f"Lazy initialization of VectorEngine failed: {e}")

    if vector_engine_instance and vector_engine_instance.collection:
        try:
            logger.info("Attempting Vector Similarity Matching...")
            results = vector_engine_instance.analyze_vector(
                payload.resume_text, payload.target_roles
            )
            return AnalysisResponse(
                status="success",
                mode_used="vector",
                provider="vector_engine",
                fallback_used=(config.AI_MODE == "online"),
                fallback_reason=fallback_reason,
                runtime_version=config.RUNTIME_VERSION,
                results=results,
            )
        except Exception as e:
            logger.warning(f"Vector similarity analysis failed: {e}. Falling back to Offline.")
            if not fallback_reason:
                fallback_reason = str(e)

    # ── Offline Deterministic Fallback (Mode C) ─────────────
    try:
        logger.info("Attempting Offline Deterministic analysis...")
        results = analyze_offline(payload.resume_text, payload.target_roles)
        return AnalysisResponse(
            status="success",
            mode_used="offline",
            provider="offline_engine",
            fallback_used=(config.AI_MODE == "online"),
            fallback_reason=fallback_reason,
            runtime_version=config.RUNTIME_VERSION,
            results=results,
        )
    except Exception as e:
        logger.error(f"Offline engine failed: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"All analysis engines failed. Last error: {str(e)}",
        )
