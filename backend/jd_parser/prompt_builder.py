def build_jd_prompt(jd_text):
    return f"""
Extract information from the job description and return JSON.

Example:

Job Description:
We are hiring a Software Engineer with 2 years experience.
Skills: Python, Java.
Location: Hyderabad.
Nice to have: AWS.

Output:
{{
  "role": "Software Engineer",
  "skills_required": ["Python", "Java"],
  "experience_required": "2 years",
  "location": "Hyderabad",
  "nice_to_have_skills": ["AWS"]
}}

Now extract from this:

Job Description:
{jd_text}

Output:
"""