from models import StudentProfileFeatures, EligibilityPredictionResponse, ExplainableFeature

def predict_eligibility_and_explain(features: StudentProfileFeatures) -> EligibilityPredictionResponse:
    cgpa_contrib = (features.cgpa / 10.0) * 25.0
    project_contrib = min(features.project_count * 7.5, 25.0)
    cert_contrib = min(features.certification_count * 5.0, 15.0)
    leetcode_contrib = min((features.leetcode_solved / 200.0) * 20.0, 20.0)
    github_contrib = min((features.github_commits / 400.0) * 15.0, 15.0)
    comm_contrib = (features.communication_rating / 10.0) * 10.0

    raw_total = cgpa_contrib + project_contrib + cert_contrib + leetcode_contrib + github_contrib + comm_contrib
    overall_score = int(min(max(raw_total, 40), 98))

    tech_readiness = int(min(cgpa_contrib + cert_contrib + 40, 95))
    project_strength = int(min(project_contrib * 3.5 + 20, 96))
    coding_readiness = int(min(leetcode_contrib * 4.0 + github_contrib * 2.0 + 15, 94))
    comm_readiness = int(features.communication_rating * 10.0)
    placement_prob = int(min(overall_score + 3, 97))

    explainability = []

    if features.project_count >= 2:
        explainability.append(ExplainableFeature(
            feature="Strong Project Portfolio",
            impact=f"+{int(project_contrib)}%",
            type="positive",
            description=f"{features.project_count} verified projects demonstrating full stack architecture."
        ))

    if features.github_commits > 150:
        explainability.append(ExplainableFeature(
            feature="Active GitHub Contributions",
            impact=f"+{int(github_contrib)}%",
            type="positive",
            description=f"{features.github_commits}+ git commits showing active coding discipline."
        ))

    if features.certification_count >= 1:
        explainability.append(ExplainableFeature(
            feature="Naan Mudhalvan Certifications",
            impact=f"+{int(cert_contrib)}%",
            type="positive",
            description="Verified state skill initiative badges."
        ))

    if features.cgpa >= 8.0:
        explainability.append(ExplainableFeature(
            feature="Solid Academic Foundation",
            impact=f"+{int(cgpa_contrib)}%",
            type="positive",
            description=f"{features.cgpa} CGPA meeting tier-1 corporate criteria."
        ))
    else:
        explainability.append(ExplainableFeature(
            feature="Academic CGPA Gap",
            impact="-8%",
            type="negative",
            description="CGPA is slightly below optimal 8.0 threshold."
        ))

    if features.leetcode_solved < 150:
        explainability.append(ExplainableFeature(
            feature="Data Structures & Problem Solving",
            impact="-10%",
            type="negative",
            description="Problem solving count is below competitive benchmark (150+)."
        ))

    return EligibilityPredictionResponse(
        overall_score=overall_score,
        technical_readiness=tech_readiness,
        project_strength=project_strength,
        coding_readiness=coding_readiness,
        communication_readiness=comm_readiness,
        placement_probability=placement_prob,
        explainability=explainability
    )
