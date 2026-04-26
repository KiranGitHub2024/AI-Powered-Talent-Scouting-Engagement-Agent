from backend.jd_parser.llm_client import call_llm
from backend.jd_parser.prompt_builder import build_jd_prompt
from backend.jd_parser.parser import parse_llm_output
from backend.jd_parser.resume_parser import parse_resume
from backend.jd_parser.ranking import rank_candidates


# -----------------------------
# 🔹 JOB DESCRIPTION
# -----------------------------
jd_text = """
We are hiring a Data Scientist with 3+ years of experience.
Required skills: Python, Machine Learning, SQL.
Location: Bangalore.
Nice to have: AWS, Deep Learning.
"""

prompt = build_jd_prompt(jd_text)
raw_output = call_llm(prompt)

parsed_jd = parse_llm_output(raw_output, jd_text)

print("\nParsed JD:")
print(parsed_jd)


# -----------------------------
# 🔹 MULTIPLE RESUMES
# -----------------------------
resumes_raw = [
    """
    Name: Ravi Kiran
    Skills: Python, Machine Learning, Pandas
    Experience: 3 years
    """,
    """
    Name: Arjun
    Skills: Python, SQL, Machine Learning, Deep Learning
    Experience: 4 years
    """,
    """
    Name: Sneha
    Skills: Excel, Power BI
    Experience: 2 years
    """
]

parsed_resumes = [parse_resume(r) for r in resumes_raw]

print("\nParsed Resumes:")
for r in parsed_resumes:
    print(r)


# -----------------------------
# 🔹 RANKING
# -----------------------------
ranked = rank_candidates(parsed_jd, parsed_resumes)

print("\n🏆 Ranked Candidates:")
for i, candidate in enumerate(ranked, start=1):
    print(f"{i}. {candidate['name']} → {candidate['match_score']}% ({candidate['decision']})")