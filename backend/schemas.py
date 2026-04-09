from pydantic import BaseModel, Field
from typing import List, Optional


class JobPostingInput(BaseModel):
    title: str = Field(..., min_length=1, max_length=500, description="Job title")
    company_name: str = Field(..., min_length=1, max_length=500, description="Company name")
    company_profile: str = Field("", max_length=10000, description="Company profile/about section")
    description: str = Field("", max_length=10000, description="Job description")
    requirements: str = Field("", max_length=5000, description="Job requirements")
    benefits: str = Field("", max_length=5000, description="Benefits listed")
    employment_type: str = Field("Full-time", description="Employment type")
    required_experience: str = Field("Not Applicable", description="Required experience level")
    required_education: str = Field("Unspecified", description="Required education level")
    industry: str = Field("Information Technology and Services", description="Industry")
    function_field: str = Field("Other", description="Job function")
    has_company_logo: bool = Field(True, description="Whether posting has a company logo")
    has_questions: bool = Field(True, description="Whether posting has screening questions")
    telecommuting: bool = Field(False, description="Whether the role is remote/telecommute")
    red_flags: List[str] = Field(default_factory=list, description="Red flags observed by user")
    salary_range: str = Field("", description="Salary range if listed (e.g. '$50,000-$70,000')")


class ShapFeature(BaseModel):
    name: str
    value: float
    direction: str


class RiskScores(BaseModel):
    text_quality: int
    company_signals: int
    offer_realism: int
    red_flag_score: int


class PredictionResult(BaseModel):
    verdict: str
    fraud_probability: float
    risk_scores: RiskScores
    top_shap_features: List[ShapFeature]
    red_flags: List[str]
    explanation: str
    job_title: str
    company_name: str


class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    sklearn_version: str
    uptime_seconds: float
