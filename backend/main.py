"""
JobGuard FastAPI Backend
TECH: Python 3.11, FastAPI, Uvicorn
"""

import os
import sys
import time
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from dotenv import load_dotenv

import nltk

from schemas import JobPostingInput, PredictionResult, HealthResponse
from security import APIKeyMiddleware
from loader import load_all_models
from predictor import run_prediction

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("jobguard")

# Download NLTK data
try:
    nltk.data.find("corpora/wordnet")
except LookupError:
    nltk.download("wordnet", quiet=True)
try:
    nltk.data.find("corpora/omw-1.4")
except LookupError:
    nltk.download("omw-1.4", quiet=True)

# Global model state
pipeline = None
shap_explainer = None
feature_names = None
feature_cols = None
start_time = None

# Rate limiter
limiter = Limiter(key_func=get_remote_address)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load models at startup. If any fail, exit immediately."""
    global pipeline, shap_explainer, feature_names, feature_cols, start_time
    try:
        pipeline, shap_explainer, feature_names, feature_cols = load_all_models()
        start_time = time.time()
        logger.info("All models loaded successfully. Server is ready.")
    except RuntimeError as e:
        logger.error(f"FATAL: Cannot start server — {e}")
        sys.exit(1)
    yield
    logger.info("Shutting down JobGuard backend.")


app = FastAPI(
    title="JobGuard API",
    description="ML-Powered Fake Job Detector Backend",
    version="1.0.0",
    lifespan=lifespan,
)

# Rate limit error handler
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS: ALLOWED_ORIGIN env var only, never wildcard *
allowed_origin = os.environ.get("ALLOWED_ORIGIN", "https://jobguard.pages.dev")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[allowed_origin],
    allow_credentials=True,
    allow_methods=["POST", "GET", "OPTIONS"],
    allow_headers=["*"],
)

# API Key middleware
app.add_middleware(APIKeyMiddleware)


@app.post("/predict", response_model=PredictionResult)
@limiter.limit("30/minute")
async def predict(request: Request, job_input: JobPostingInput):
    """
    POST /predict — run_prediction, return full result.
    RULE 1: The model is the ONLY source of predictions.
    If model is unavailable, return HTTP 503.
    """
    global pipeline, shap_explainer, feature_names

    if pipeline is None or shap_explainer is None or feature_names is None:
        raise HTTPException(status_code=503, detail="Model unavailable. Server cannot produce predictions.")

    try:
        result = run_prediction(
            pipeline=pipeline,
            shap_explainer=shap_explainer,
            feature_names=feature_names,
            title=job_input.title,
            company_name=job_input.company_name,
            company_profile=job_input.company_profile,
            description=job_input.description,
            requirements=job_input.requirements,
            benefits=job_input.benefits,
            employment_type=job_input.employment_type,
            required_experience=job_input.required_experience,
            required_education=job_input.required_education,
            industry=job_input.industry,
            function_field=job_input.function_field,
            has_company_logo=job_input.has_company_logo,
            has_questions=job_input.has_questions,
            telecommuting=job_input.telecommuting,
            red_flags=job_input.red_flags,
        )
        return result
    except Exception as e:
        logger.error(f"Prediction failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal prediction error. Please try again.")


@app.get("/health", response_model=HealthResponse)
async def health():
    """GET /health — model_loaded status, sklearn version, uptime"""
    import sklearn
    global pipeline, start_time

    return HealthResponse(
        status="ok" if pipeline is not None else "error",
        model_loaded=pipeline is not None,
        sklearn_version=sklearn.__version__,
        uptime_seconds=round(time.time() - start_time, 2) if start_time else 0.0,
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=False)
