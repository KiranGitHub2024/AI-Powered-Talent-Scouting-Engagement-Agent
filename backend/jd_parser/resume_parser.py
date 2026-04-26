from backend.jd_parser.llm_client import call_llm
import re


def build_resume_prompt(resume_text):
    return f"""
You are a strict JSON generator.

Extract information from the resume.

Return ONLY valid JSON.

Format:
{{
  "name": "",
  "skills": [],
  "experience": ""
}}

Resume:
{resume_text}

JSON:
"""


# ✅ MAIN FUNCTION (this is what your project expects)
def parse_resume(resume_text):
    prompt = build_resume_prompt(resume_text)

    response = call_llm(prompt)

    # 🔹 Normalize inputs
    llm_text = response.lower() if response else ""
    resume_lower = resume_text.lower()

    # 🔹 SKILLS LIST (extended for better coverage)
    skills_list = [
        "python", "sql", "machine learning", "deep learning",
        "aws", "docker", "tensorflow", "pandas",
        "excel", "power bi"
    ]

    extracted_skills = []

    for skill in skills_list:
        if skill in llm_text or skill in resume_lower:
            extracted_skills.append(skill.title())

    # 🔹 EXPERIENCE
    exp_match = re.search(r"(\d+\+?\s*years?)", llm_text)
    if not exp_match:
        exp_match = re.search(r"(\d+\+?\s*years?)", resume_lower)

    experience = exp_match.group(1) if exp_match else None

    # 🔹 NAME (improved logic)
    name = None

    # Try structured format first
    name_match = re.search(r"name\s*:\s*(.+)", resume_text, re.IGNORECASE)
    if name_match:
        name = name_match.group(1).strip()
    else:
        # fallback → first non-empty line
        lines = [line.strip() for line in resume_text.split("\n") if line.strip()]
        name = lines[0] if lines else None

    return {
        "name": name,
        "skills": list(set(extracted_skills)),
        "experience": experience
    }