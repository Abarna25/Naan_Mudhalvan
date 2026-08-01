from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class ResumeParseRequest(BaseModel):
    resume_text: Optional[str] = None

class CertificateOCRRequest(BaseModel):
    image_text_raw: Optional[str] = None
    file_name: Optional[str] = None

class StudentProfileFeatures(BaseModel):
    cgpa: float
    project_count: int
    certification_count: int
    leetcode_solved: int
    github_commits: int
    communication_rating: Optional[float] = 7.5
    naan_mudhalvan_completed: Optional[int] = 2

class ExplainableFeature(BaseModel):
    feature: str
    impact: str
    type: str  # 'positive' | 'negative'
    description: str

class EligibilityPredictionResponse(BaseModel):
    overall_score: int
    technical_readiness: int
    project_strength: int
    coding_readiness: int
    communication_readiness: int
    placement_probability: int
    explainability: List[ExplainableFeature]

class SkillGapRequest(BaseModel):
    current_skills: List[str]
    target_role: str

class CareerRoadmapRequest(BaseModel):
    target_role: str
    timeline_months: Optional[int] = 3
