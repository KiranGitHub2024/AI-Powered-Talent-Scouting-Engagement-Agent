from fastapi import FastAPI, UploadFile, File, Form
from typing import List, Optional

from backend.jd_parser.file_handler import extract_text
from backend.jd_parser.prompt_builder import build_jd_prompt
from backend.jd_parser.llm_client import call_llm
from backend.jd_parser.parser import parse_llm_output
from backend.jd_parser.resume_parser import parse_resume
from backend.jd_parser.ranking import rank_candidates

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# 🔹 CORS FIX
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/upload-and-rank")
async def upload_and_rank(
    jd_file: Optional[UploadFile] = File(None),
    jd_text: Optional[str] = Form(None),
    resume_files: Optional[List[UploadFile]] = File(None),
):
    try:
        # ---------------- JD ----------------
        if jd_file:
            jd_file.file.seek(0)
            jd_content = extract_text(jd_file.file, jd_file.filename)
        elif jd_text:
            jd_content = jd_text
        else:
            return {"error": "Provide jd_file or jd_text"}

        prompt = build_jd_prompt(jd_content)
        raw_output = call_llm(prompt)
        parsed_jd = parse_llm_output(raw_output, jd_content)

        # ---------------- RESUMES ----------------
        parsed_resumes = []

        if resume_files:
            for file in resume_files:
                file.file.seek(0)
                text = extract_text(file.file, file.filename)
                parsed_resumes.append(parse_resume(text))

        if not parsed_resumes:
            return {"error": "Upload at least one resume"}

        # ---------------- RANK ----------------
        ranked = rank_candidates(parsed_jd, parsed_resumes)

        return {
            "parsed_jd": parsed_jd,
            "ranked_candidates": ranked
        }

    except Exception as e:
        print("API ERROR:", str(e))
        return {"error": "Internal Server Error"}