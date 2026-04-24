def build_jd_prompt(jd_text):
    """
    Builds a structured prompt for extracting job details from a JD.
    """

    prompt = f"""
You are an expert recruiter assistant.

Your task is to extract structured information from the given Job Description.

Extract the following fields:
- role (string)
- skills_required (list of skills)
- experience_required (string)
- location (string, if available)
- nice_to_have_skills (list, if available)

Rules:
- Return ONLY valid JSON
- Do NOT include explanations or extra text
- If a field is missing, return empty string "" or empty list []

Job Description:
{jd_text}
"""

    return prompt