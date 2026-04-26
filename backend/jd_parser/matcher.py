def calculate_match(jd, resume):
    jd_skills = set([s.lower() for s in jd.get("skills_required", [])])
    resume_skills = set([s.lower() for s in resume.get("skills", [])])

    if not jd_skills:
        return {
            "match_score": 0,
            "matched_skills": [],
            "missing_skills": [],
            "decision": "No JD skills"
        }

    matched = jd_skills.intersection(resume_skills)
    missing = jd_skills.difference(resume_skills)

    score = (len(matched) / len(jd_skills)) * 100

    if score >= 80:
        decision = "Strong Match"
    elif score >= 50:
        decision = "Moderate Match"
    else:
        decision = "Low Match"

    return {
        "match_score": round(score, 2),
        "matched_skills": list(matched),
        "missing_skills": list(missing),
        "decision": decision
    }