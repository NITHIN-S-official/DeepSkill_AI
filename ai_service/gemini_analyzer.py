import json
import os
import time
import logging
from typing import List
from pydantic import BaseModel, Field
from offline_engine import get_role_by_id

logger = logging.getLogger("deepskill.gemini")

# Define Pydantic models for structured output matching our API spec
class ATSKeyword(BaseModel):
    keyword: str
    frequency: int

class BulletTransformation(BaseModel):
    before: str
    after: str

class RoleAnalysisResult(BaseModel):
    role: str = Field(description="The exact role ID (e.g. 'frontend-developer')")
    compatibility_score: int = Field(description="Match score between 30 and 95")
    matching_skills: List[str] = Field(description="Skills found in resume")
    missing_skills: List[str] = Field(description="Skills missing from resume")
    ats_keywords: List[ATSKeyword] = Field(description="List of ATS keywords and their occurrence count")
    suggestions: List[str] = Field(description="List of suggestions, each prefixed with 'Summary: ', 'Skills: ', 'Experience: ', 'Projects: ', 'ATS: ', or 'Learning: '")
    bullet_transformations: List[BulletTransformation] = Field(description="Tailored before/after bullet points")

class GeminiAnalysisResponse(BaseModel):
    results: List[RoleAnalysisResult]

def analyze_gemini(resume_text: str, target_roles: List[str], api_key: str) -> List[dict]:
    start_time = time.time()
    # Lazy import to ensure system starts even if google-genai package is missing
    try:
        from google import genai
        from google.genai import types
    except ImportError as e:
        print("CRITICAL: google-genai package is not installed. Gemini mode disabled.")
        raise RuntimeError("google-genai package is not installed in the python environment.") from e

    # Gather role specifications for Gemini context
    roles_info = []
    for role_id in target_roles:
        role = get_role_by_id(role_id)
        if role:
            roles_info.append({
                "id": role["id"],
                "title": role["title"],
                "description": role.get("description", ""),
                "skills": role.get("skills", []),
                "keywords": role.get("keywords", [])
            })
            
    if not roles_info:
        raise ValueError("None of the target roles could be resolved in the database.")

    # Initialize standard google-genai client
    client = genai.Client(api_key=api_key)
    
    prompt = f"""
You are an expert ATS (Applicant Tracking System) parser and resume optimization engine.
Analyze the following resume text against the target job roles and provide a structured assessment.

Resume Text:
---
{resume_text}
---

Target Job Roles:
{json.dumps(roles_info, indent=2)}

For each target job role, you must output:
1. "role": The exact role ID (e.g., 'frontend-developer') from the target job roles list.
2. "compatibility_score": An integer match score from 30 to 95. Be objective.
3. "matching_skills": List of skills from the role's skills that are found in the resume.
4. "missing_skills": List of skills from the role's skills that NOT found in the resume.
5. "ats_keywords": List of objects with keys "keyword" and "frequency" representing the count of occurrences of each role keyword in the resume.
6. "suggestions": A list of at least 6 actionable, specific improvement suggestions.
   CRITICAL: Each suggestion MUST be prefixed with one of the following category tags based on what it refers to:
   - "Summary: " (for profile or summary changes)
   - "Skills: " (for technical skills additions or organization)
   - "Experience: " (for experience bullet improvements)
   - "Projects: " (for project suggestions)
   - "ATS: " (for general ATS styling, formatting, or keyword optimization)
   - "Learning: " (for courses, certifications, or tools to learn)
   Example: "Summary: Write a 3-line professional summary..."
7. "bullet_transformations": A list of 3 tailored "before" and "after" bullet point transformations.
   "before" should represent a weak or generic bullet point.
   "after" should represent a strong, quantified, action-oriented version using target skills.
"""

    try:
        # Call Gemini using standard structured JSON output config
        # We will use gemini-3.6-flash as default
        response = client.models.generate_content(
            model='gemini-3.6-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=GeminiAnalysisResponse,
                temperature=0.1
            )
        )
        
        # Parse the JSON response
        response_data = json.loads(response.text)
        results = response_data.get("results", [])
        elapsed = time.time() - start_time
        logger.info(f"Gemini analysis completed in {elapsed:.1f}s for {len(target_roles)} roles")
        return results
        
    except Exception as e:
        print(f"Error calling Gemini API: {e}")
        # Try fallback model if 2.5-flash is not available/failed for some reason
            # Current Gemini models to try.
    # You can override these with GEMINI_MODELS in .env
    models_env = os.getenv(
        "GEMINI_MODELS",
        "gemini-3.8-flash,gemini-3.6-flash,gemini-3.5-flash"
    )

    gemini_models = [
        model.strip()
        for model in models_env.split(",")
        if model.strip()
    ]

    last_error = None

    # Try each Gemini model
    for model_name in gemini_models:

        # Retry each model up to 3 times
        for attempt in range(3):

            try:
                logger.info(
                    f"Gemini online request: "
                    f"model={model_name}, "
                    f"attempt={attempt + 1}/3"
                )

                response = client.models.generate_content(
                    model=model_name,
                    contents=prompt,
                    config=types.GenerateContentConfig(
                        response_mime_type="application/json",
                        response_schema=GeminiAnalysisResponse,
                        temperature=0.1
                    )
                )

                # Make sure Gemini returned a response
                if not response.text:
                    raise RuntimeError(
                        f"Gemini returned an empty response "
                        f"for model {model_name}"
                    )

                # Parse Gemini JSON response
                response_data = json.loads(response.text)

                results = response_data.get("results", [])

                elapsed = time.time() - start_time

                logger.info(
                    f"Gemini ONLINE analysis completed: "
                    f"model={model_name}, "
                    f"time={elapsed:.1f}s, "
                    f"roles={len(target_roles)}"
                )

                # Return successful Gemini result
                return results

            except Exception as e:

                last_error = e

                logger.warning(
                    f"Gemini request failed: "
                    f"model={model_name}, "
                    f"attempt={attempt + 1}/3, "
                    f"error={e}"
                )

                # Wait before retrying
                if attempt < 2:

                    wait_time = 2 ** attempt

                    logger.info(
                        f"Retrying {model_name} in "
                        f"{wait_time} seconds..."
                    )

                    time.sleep(wait_time)

        # This model failed all 3 attempts
        logger.warning(
            f"Gemini model {model_name} "
            f"failed after 3 attempts. "
            f"Trying next model."
        )

    # All Gemini models failed
    elapsed = time.time() - start_time

    logger.error(
        f"All Gemini online models failed after "
        f"{elapsed:.1f}s. "
        f"Last error: {last_error}"
    )

    # Raise the error so the backend can use
    # its existing vector/offline fallback.
    raise RuntimeError(
        f"Gemini online analysis failed. "
        f"All configured models were unavailable. "
        f"Last error: {last_error}"
    )