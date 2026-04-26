import re


def parse_llm_output(llm_output, jd_text):
    jd_lower = jd_text.lower()

    # 🔹 SKILLS LIST (extendable)
    skills_list = [
        "python", "sql", "machine learning", "deep learning",
        "aws", "docker", "tensorflow", "pandas", "excel", "power bi"
    ]

    extracted_skills = []

    # 🔹 Try extracting from LLM first
    if llm_output:
        llm_text = llm_output.lower()
        for skill in skills_list:
            if skill in llm_text:
                extracted_skills.append(skill.title())

    # 🔹 FALLBACK → extract from JD text (IMPORTANT FIX)
    if not extracted_skills:
        for skill in skills_list:
            if skill in jd_lower:
                extracted_skills.append(skill.title())

    # 🔹 EXPERIENCE
    exp_match = re.search(r"(\d+\+?\s*years?)", jd_text, re.IGNORECASE)
    experience = exp_match.group(1) if exp_match else None

    # 🔹 LOCATION
    loc_match = re.search(r"location\s*:\s*(.+)", jd_text, re.IGNORECASE)
    location = loc_match.group(1).strip() if loc_match else None

    # 🔹 ROLE
    role_match = re.search(r"hiring a ([a-zA-Z ]+)", jd_text, re.IGNORECASE)
    role = role_match.group(1).strip().title() if role_match else None

    # 🔹 NICE TO HAVE
    nice_to_have = []
    if "nice to have" in jd_lower:
        for skill in skills_list:
            if skill in jd_lower and skill.title() not in extracted_skills:
                nice_to_have.append(skill.title())

    return {
        "role": role,
        "skills_required": list(set(extracted_skills)),
        "experience_required": experience,
        "location": location,
        "nice_to_have_skills": list(set(nice_to_have))
    }