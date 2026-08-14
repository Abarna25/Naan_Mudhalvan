from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import (
    ResumeParseRequest, CertificateOCRRequest, StudentProfileFeatures,
    EligibilityPredictionResponse, SkillGapRequest, CareerRoadmapRequest
)
from services.resume_parser import parse_resume_text
from services.certificate_ocr import process_certificate_ocr
from services.eligibility_model import predict_eligibility_and_explain
from services.recommendation_engine import generate_skill_gap_analysis, generate_career_roadmap
from services.evidence_analyzer import (
    analyze_project_evidence_ai, analyze_skill_evidence_ai, detect_profile_anomalies_ai
)

app = FastAPI(
    title="Naan Mudhalvan AI Eligibility & Evidence Analytics Engine",
    version="1.1.0",
    description="Production-ready FastAPI service for OCR, NLP Resume Parsing, XGBoost Placement Prediction, Evidence Analysis, and Explainable AI."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "status": "HEALTHY",
        "service": "Naan Mudhalvan AI Evidence & Eligibility Service",
        "version": "1.1.0"
    }

@app.post("/api/v1/ai/parse-resume")
def parse_resume(payload: ResumeParseRequest):
    return parse_resume_text(payload.resume_text or "")

@app.post("/api/v1/ai/ocr-certificate")
def ocr_certificate(payload: CertificateOCRRequest):
    return process_certificate_ocr(payload.image_text_raw, payload.file_name)

@app.post("/api/v1/ai/predict-eligibility", response_model=EligibilityPredictionResponse)
def predict_eligibility(features: StudentProfileFeatures):
    return predict_eligibility_and_explain(features)

@app.post("/api/v1/ai/skill-gap")
def skill_gap_analysis(payload: SkillGapRequest):
    return generate_skill_gap_analysis(payload.current_skills, payload.target_role)

@app.post("/api/v1/ai/career-roadmap")
def career_roadmap(payload: CareerRoadmapRequest):
    return generate_career_roadmap(payload.target_role, payload.timeline_months or 3)

@app.post("/api/v1/ai/analyze-project-evidence")
def analyze_project_evidence(payload: dict):
    return analyze_project_evidence_ai(
        payload.get("githubUrl", ""),
        payload.get("description", ""),
        payload.get("techStack", "")
    )

@app.post("/api/v1/ai/analyze-skill-evidence")
def analyze_skill_evidence(payload: dict):
    return analyze_skill_evidence_ai(
        payload.get("skillName", ""),
        payload.get("claimsCount", 1),
        payload.get("assessmentScore", None)
    )

@app.post("/api/v1/ai/anomaly-detection")
def anomaly_detection(payload: dict):
    return detect_profile_anomalies_ai(payload)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
