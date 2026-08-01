def generate_skill_gap_analysis(current_skills: list, target_role: str) -> dict:
    benchmarks = {
        "Software Engineer": ["Data Structures", "Algorithms", "System Design", "Docker", "REST API", "SQL"],
        "AI Engineer": ["Python", "PyTorch", "FastAPI", "NLP", "Machine Learning", "Scikit-Learn"],
        "Data Analyst": ["SQL", "Python", "Pandas", "Power BI", "Statistics", "Data Visualization"],
        "Frontend Developer": ["React", "TypeScript", "Tailwind CSS", "Next.js", "Redux", "Web Vitals"],
        "Backend Developer": ["Node.js", "Express", "PostgreSQL", "Redis", "Docker", "GraphQL"],
    }
    
    required = benchmarks.get(target_role, benchmarks["Software Engineer"])
    current_lower = [s.lower() for s in current_skills]
    missing = [req for req in required if req.lower() not in current_lower]
    
    return {
        "target_role": target_role,
        "match_percentage": int(((len(required) - len(missing)) / len(required)) * 100),
        "missing_skills": missing,
        "recommended_courses": [f"Naan Mudhalvan Masterclass on {skill}" for skill in missing[:3]],
        "recommended_projects": [
            f"Build a production {target_role} project featuring {missing[0] if missing else 'TypeScript'}"
        ],
        "timeline_months": 2 if len(missing) <= 2 else 3,
    }

def generate_career_roadmap(target_role: str, timeline_months: int = 3) -> dict:
    return {
        "target_role": target_role,
        "timeline_months": timeline_months,
        "weekly_plan": [
            {"week": 1, "task": "Core DSA & LeetCode array/string problems", "focus": "Problem Solving"},
            {"week": 2, "task": "System design fundamentals & API architecture", "focus": "Architecture"},
            {"week": 3, "task": "Full Stack Capstone project development", "focus": "Portfolio"},
            {"week": 4, "task": "Naan Mudhalvan industry certification assessment", "focus": "Certification"},
        ],
        "monthly_milestones": [
            {"month": "Month 1", "objective": "Complete 50 DSA problems & build 1 capstone project"},
            {"month": "Month 2", "objective": "Achieve 85%+ in Naan Mudhalvan Mock Technical Interviews"},
            {"month": "Month 3", "objective": "Final resume optimization & top corporate placement drives"},
        ]
    }
