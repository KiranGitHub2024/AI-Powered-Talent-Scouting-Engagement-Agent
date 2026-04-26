from backend.jd_parser.matcher import calculate_match
from backend.jd_parser.engagement import simulate_conversation


def rank_candidates(jd, resumes):
    ranked_results = []

    for resume in resumes:
        match_result = calculate_match(jd, resume)

        engagement = simulate_conversation(
            jd,
            resume,
            match_result["match_score"]
        )

        # 🔥 FINAL SCORE (weighted)
        final_score = (
            match_result["match_score"] * 0.7 +
            engagement["interest_score"] * 0.3
        )

        ranked_results.append({
            "name": resume.get("name", "Unknown"),

            "match_score": match_result["match_score"],
            "interest_score": engagement["interest_score"],
            "final_score": round(final_score, 2),

            "decision": match_result["decision"],
            "matched_skills": match_result["matched_skills"],
            "missing_skills": match_result["missing_skills"],

            "conversation": engagement["conversation"]
        })

    # Sort by final score
    ranked_results = sorted(
        ranked_results,
        key=lambda x: x["final_score"],
        reverse=True
    )

    return ranked_results