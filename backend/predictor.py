"""
JobGuard Predictor — RULE-COMPLIANT IMPLEMENTATION
The pre-trained ML model is sacred. This module loads it, calls it, and returns its output exactly.
"""

import re
import logging
import numpy as np
import pandas as pd
from typing import List, Dict, Tuple

from schemas import ShapFeature, RiskScores, PredictionResult
from explainer import generate_explanation

logger = logging.getLogger("jobguard.predictor")


def clean_text(text: str) -> str:
    if not text:
        return ""
    text = str(text).lower()
    text = re.sub(r'<[^>]+>', ' ', text)
    text = re.sub(r'http\S+', ' ', text)
    text = re.sub(r'[^a-z\s]', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text


def compute_risk_scores(
    fraud_probability: float,
    has_company_logo: bool,
    has_questions: bool,
    red_flags: List[str],
) -> Dict[str, int]:
    """Compute risk scores. Never hardcoded — always computed."""
    return {
        "text_quality": max(0, 100 - int(fraud_probability * 100)),
        "company_signals": 90 if (has_company_logo and has_questions) else 55 if (has_company_logo or has_questions) else 15,
        "offer_realism": max(0, 85 - len(red_flags) * 8),
        "red_flag_score": min(100, len(red_flags) * 10),
    }


FRAUD_KEYWORDS = [
    'work from home', 'no experience', 'earn money', 'weekly pay',
    'unlimited earning', 'be your own boss', 'entry level', 'easy money'
]


def run_prediction(
    pipeline,
    shap_explainer,
    feature_names: List[str],
    title: str,
    company_name: str,
    company_profile: str,
    description: str,
    requirements: str,
    benefits: str,
    salary_range: str,
    employment_type: str,
    required_experience: str,
    required_education: str,
    industry: str,
    function_field: str,
    has_company_logo: bool,
    has_questions: bool,
    telecommuting: bool,
    red_flags: List[str],
) -> PredictionResult:
    """
    RULE 5 — EXACT PREDICTION SEQUENCE
    Build DataFrame, get fraud probability, verdict, SHAP values, top 10 features.
    """

    # Build combined_text using the new clean_text function (no lemmatizer)
    combined_text = clean_text(
        (title or '') + " " + (company_profile or '') + " " +
        (description or '') + " " + (requirements or '') + " " + (benefits or '')
    )

    # Compute engineered features
    has_salary = 1 if salary_range and salary_range.strip() else 0
    desc_length = len(description or '')
    title_length = len(title or '')
    req_length = len(requirements or '')
    desc_has_html = int(bool(re.search(r'<[^>]+>', description or '')))
    fraud_keyword_count = sum(kw in combined_text for kw in FRAUD_KEYWORDS)

    # Step 1: Build DataFrame — exact column order matching feature_cols.pkl
    df = pd.DataFrame([{
        'combined_text':       combined_text,
        'has_salary':          has_salary,
        'has_company_logo':    int(has_company_logo),
        'has_questions':       int(has_questions),
        'telecommuting':       int(telecommuting),
        'desc_length':         desc_length,
        'title_length':        title_length,
        'req_length':          req_length,
        'desc_has_html':       desc_has_html,
        'fraud_keyword_count': fraud_keyword_count,
        'employment_type':     employment_type or 'Unknown',
        'required_experience': required_experience or 'Unknown',
        'required_education':  required_education or 'Unknown',
        'industry':            industry or 'Unknown',
        'function':            function_field or 'Unknown',
    }])

    # Step 2: Get fraud probability — model is the ONLY source
    fraud_probability = float(pipeline.predict_proba(df)[0][1])

    # Step 3: Verdict thresholds
    if fraud_probability < 0.35:
        verdict = "REAL"
    elif fraud_probability < 0.60:
        verdict = "SUSPICIOUS"
    else:
        verdict = "FAKE"

    # Step 4: SHAP values
    preprocessor = pipeline.named_steps["preprocessor"]
    X_transformed = preprocessor.transform(df)
    if hasattr(X_transformed, "toarray"):
        X_transformed = X_transformed.toarray()
    shap_values = shap_explainer.shap_values(X_transformed)

    # Handle all SHAP output formats
    if isinstance(shap_values, list):
        shap_fraud = shap_values[1][0]       # list format: index 1 = fraud class
    elif shap_values.ndim == 3:
        shap_fraud = shap_values[0, :, 1]    # 3D array: (samples, features, classes)
    else:
        shap_fraud = shap_values[0]          # 2D array fallback

    # Step 5: Top 10 features by absolute SHAP value
    top_indices = np.argsort(np.abs(shap_fraud))[-10:][::-1]
    top_shap_features = [
        ShapFeature(
            name=feature_names[i],
            value=float(shap_fraud[i]),
            direction="fraud" if shap_fraud[i] > 0 else "legitimate"
        )
        for i in top_indices
    ]

    # Compute risk scores
    risk_scores_dict = compute_risk_scores(
        fraud_probability, has_company_logo, has_questions, red_flags
    )
    risk_scores = RiskScores(**risk_scores_dict)

    # Generate explanation from templates (no AI)
    explanation = generate_explanation(
        verdict=verdict,
        fraud_probability=fraud_probability,
        risk_scores=risk_scores_dict,
        top_shap_features=[f.model_dump() for f in top_shap_features],
        red_flags=red_flags,
        job_title=title,
        company_name=company_name,
    )

    return PredictionResult(
        verdict=verdict,
        fraud_probability=fraud_probability,
        risk_scores=risk_scores,
        top_shap_features=top_shap_features,
        red_flags=red_flags,
        explanation=explanation,
        job_title=title,
        company_name=company_name,
    )
