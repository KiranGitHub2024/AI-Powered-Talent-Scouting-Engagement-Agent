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


def _clean_name(value):
    value = re.sub(
        r"\b(name|candidate|applicant|resume|curriculum vitae|cv)\b",
        "",
        value or "",
        flags=re.IGNORECASE,
    )
    value = re.sub(r"[:\-|]", " ", value)
    value = re.sub(r"[^a-zA-Z\s.'-]", " ", value)
    value = re.sub(r"\s+", " ", value).strip()
    return value


def _looks_like_person_name(value):
    cleaned = _clean_name(value)
    words = cleaned.split()
    blocked = re.search(
        r"resume|curriculum|vitae|email|phone|mobile|linkedin|github|portfolio|"
        r"address|experience|education|skills|objective|summary|developer|engineer",
        value or "",
        re.IGNORECASE,
    )
    return (
        2 <= len(words) <= 4
        and not blocked
        and all(re.match(r"^[A-Za-z][A-Za-z.'-]{1,}$", word) for word in words)
    )


def _title_case_name(value):
    return " ".join(word[:1].upper() + word[1:].lower() for word in _clean_name(value).split())


def extract_candidate_name(resume_text):
    explicit = re.search(
        r"(?:^|\n)\s*(?:candidate\s+name|applicant\s+name|name)\s*[:\-]\s*([A-Za-z][A-Za-z\s.'-]{2,60})",
        resume_text or "",
        re.IGNORECASE,
    )

    if explicit and _looks_like_person_name(explicit.group(1)):
        return _title_case_name(explicit.group(1))

    lines = [
        line.strip()
        for line in (resume_text or "").replace("\r", "\n").split("\n")
        if line.strip()
    ][:12]

    for line in lines:
        if _looks_like_person_name(line):
            return _title_case_name(line)

    return None


def parse_resume(resume_text):
    resume_lower = (resume_text or "").lower()

    skills_list = [
        "python", "sql", "machine learning", "deep learning", "aws",
        "docker", "tensorflow", "pandas", "excel", "power bi", "react",
        "node.js", "javascript", "typescript", "postgresql", "rest apis",
        "microservices", "redis", "kafka", "kubernetes", "terraform",
        "linux", "ci/cd", "prompt engineering", "llms", "rag", "openai api",
        "langchain", "vector databases", "pytorch", "mlops", "spark",
        "airflow", "selenium", "playwright", "redux", "figma",
    ]

    extracted_skills = [
        skill.title()
        for skill in skills_list
        if skill in resume_lower
    ]

    exp_match = re.search(r"(\d+(?:\.\d+)?\+?\s*years?)", resume_lower)

    return {
        "name": extract_candidate_name(resume_text),
        "skills": list(set(extracted_skills)),
        "experience": exp_match.group(1) if exp_match else None,
    }
