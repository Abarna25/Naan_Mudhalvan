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

app = FastAPI(
    title="Naan Mudhalvan AI Eligibility & Analytics Engine",
    version="1.0.0",
    description="Production-ready FastAPI service for OCR, NLP Resume Parsing, XGBoost Placement Prediction, and Explainable AI."
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
        "service": "Naan Mudhalvan AI Service",
        "version": "1.0.0"
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
