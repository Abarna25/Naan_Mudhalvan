import math

def analyze_project_evidence_ai(repo_url: str, description: str, tech_stack: str):
    """
    AI Service extension for project evidence pattern analysis and summary generation.
    """
    words = len(description.split()) if description else 0
    stack_items = [s.strip() for s in tech_stack.split(",")] if tech_stack else []
    
    score = min(95, max(30, words * 2 + len(stack_items) * 10))
    summary = f"Project analyzes {len(stack_items)} tech stack modules. High documentation clarity score."
    
    anomalies = []
    if words < 5:
        anomalies.append("DESCRIPTIVE_TEXT_TOO_SHORT")
    if "fake" in description.lower() or "test" in description.lower():
        anomalies.append("SUSPICIOUS_KEYWORDS_DETECTED")
        
    return {
        "repo_url": repo_url,
        "ai_evidence_score": score,
        "summary": summary,
        "anomalies": anomalies,
        "verified_tech_stack": stack_items
    }

def analyze_skill_evidence_ai(skill_name: str, claims_count: int, assessment_score: float = None):
    """
    AI Service extension for evaluating skill evidence confidence weightings.
    """
    base_confidence = 20
    if assessment_score is not None:
        base_confidence += int(assessment_score * 0.4)
    base_confidence += min(40, claims_count * 12)
    
    confidence_level = "VERY_HIGH" if base_confidence >= 80 else "HIGH" if base_confidence >= 60 else "MODERATE" if base_confidence >= 30 else "LOW"
    
    return {
        "skill_name": skill_name,
        "ai_confidence_score": min(100, base_confidence),
        "confidence_level": confidence_level,
        "recommendation": "Take skill MCQ assessment to boost trust level" if base_confidence < 60 else "Skill strongly supported by evidence"
    }

def detect_profile_anomalies_ai(profile_data: dict):
    """
    AI Service extension for multi-factor fraud & anomaly risk detection.
    """
    risk_flags = []
    projects = profile_data.get("projects", [])
    certs = profile_data.get("certifications", [])
    
    if len(projects) > 0 and all(p.get("commitCount", 0) <= 1 for p in projects):
        risk_flags.append("ALL_PROJECTS_SINGLE_COMMIT")
        
    if len(certs) > 0 and len(set(c.get("credentialId") for c in certs if c.get("credentialId"))) < len(certs):
        risk_flags.append("DUPLICATE_CREDENTIAL_IDS_FOUND")
        
    risk_level = "HIGH" if len(risk_flags) >= 2 else "MEDIUM" if len(risk_flags) == 1 else "LOW"
    
    return {
        "risk_level": risk_level,
        "anomaly_flags": risk_flags,
        "requires_manual_review": risk_level != "LOW"
    }
