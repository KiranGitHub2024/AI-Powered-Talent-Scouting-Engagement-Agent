from fastapi import FastAPI, UploadFile, File, Form
from typing import List, Optional
from pydantic import BaseModel
import json
import os
import urllib.error
import urllib.request

from backend.jd_parser.file_handler import extract_text
from backend.jd_parser.prompt_builder import build_jd_prompt
from backend.jd_parser.llm_client import call_llm
from backend.jd_parser.parser import parse_llm_output
from backend.jd_parser.resume_parser import parse_resume
from backend.jd_parser.ranking import rank_candidates

from fastapi.middleware.cors import CORSMiddleware


# =========================================================
# MODELS
# =========================================================

class JarvisMessage(BaseModel):
    role: str
    content: str


class JarvisChatRequest(BaseModel):
    candidate_name: str
    candidate_skills: List[str] = []
    candidate_experience: Optional[str] = None

    job_title: str
    job_description: str
    required_skills: List[str] = []

    question_index: int = 0
    messages: List[JarvisMessage] = []


# =========================================================
# OLLAMA CHAT
# =========================================================


def call_ollama_chat(messages, model=None):
    ollama_url = os.getenv(
        "OLLAMA_URL",
        "http://127.0.0.1:11434/api/chat"
    )

    ollama_model = model or os.getenv(
        "OLLAMA_MODEL",
        "llama3.2"
    )

    payload = {
        "model": ollama_model,
        "messages": messages,
        "stream": False,
        "keep_alive": os.getenv(
            "OLLAMA_KEEP_ALIVE",
            "15m"
        ),
        "options": {
            "temperature": 0.1,
            "num_ctx": 2048,
            "num_predict": 80,
            "top_p": 0.8,
        },
    }

    request = urllib.request.Request(
        ollama_url,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Content-Type": "application/json"
        },
        method="POST",
    )

    with urllib.request.urlopen(
        request,
        timeout=180
    ) as response:

        data = json.loads(
            response.read().decode("utf-8")
        )

        return (
            data.get("message", {})
            .get("content", "")
            .strip()
        )


# =========================================================
# FASTAPI
# =========================================================

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# UPLOAD + RANK
# =========================================================

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

            jd_content = extract_text(
                jd_file.file,
                jd_file.filename
            )

        elif jd_text:
            jd_content = jd_text

        else:
            return {
                "error": "Provide jd_file or jd_text"
            }

        prompt = build_jd_prompt(jd_content)

        raw_output = call_llm(prompt)

        parsed_jd = parse_llm_output(
            raw_output,
            jd_content
        )

        # ---------------- RESUMES ----------------

        parsed_resumes = []

        if resume_files:
            for file in resume_files:

                file.file.seek(0)

                text = extract_text(
                    file.file,
                    file.filename
                )

                parsed_resumes.append(
                    parse_resume(text)
                )

        if not parsed_resumes:
            return {
                "error": "Upload at least one resume"
            }

        # ---------------- RANK ----------------

        ranked = rank_candidates(
            parsed_jd,
            parsed_resumes
        )

        return {
            "parsed_jd": parsed_jd,
            "ranked_candidates": ranked
        }

    except Exception as e:
        print("API ERROR:", str(e))

        return {
            "error": "Internal Server Error"
        }


# =========================================================
# RESUME PROFILE
# =========================================================

@app.post("/parse-resume-profile")
async def parse_resume_profile(
    resume_file: UploadFile = File(...)
):
    try:

        resume_file.file.seek(0)

        text = extract_text(
            resume_file.file,
            resume_file.filename
        )

        parsed_resume = parse_resume(text)

        return {
            "name": parsed_resume.get("name"),
            "skills": parsed_resume.get("skills", []),
            "experience": parsed_resume.get("experience"),
            "resume_text": text[:8000],
        }

    except Exception as e:
        print("RESUME PARSE ERROR:", str(e))

        return {
            "error": "Unable to parse resume"
        }


# =========================================================
# JARVIS CHAT
# =========================================================

@app.post("/jarvis-chat")
async def jarvis_chat(request: JarvisChatRequest):

    candidate_name = (
        request.candidate_name.strip()
        if request.candidate_name
        else "Candidate"
    )

    # ==========================================
    # FIXED SCREENING QUESTIONS
    # ==========================================

    questions = [

        f"Hello {candidate_name}, I am JARVIS, the AI recruitment assistant. Are you genuinely interested in the {request.job_title} role?",

        f"Do you feel your technical skills and experience align with the {request.job_title} position? Please share a short reason.",

        f"How soon would you be available to join the company?",

        f"Thank you {candidate_name}. Your application has been successfully submitted and forwarded to the HR team for further review."
    ]

    # ==========================================
    # SAFE QUESTION INDEX
    # ==========================================

    question_index = min(
        request.question_index,
        len(questions) - 1
    )

    # ==========================================
    # OPTIONAL OLLAMA MEMORY
    # ==========================================

    system_prompt = """
You are JARVIS.

You are an AI recruitment screening assistant.

STRICT RULES:
- Never repeat previous messages
- Never print instructions
- Never explain tasks
- Never repeat candidate answers
- Never act like ChatGPT
- Never say 'How can I help you today?'
- Keep responses short and professional
- Behave only like a recruiter
- Ask one question at a time
"""

    ollama_messages = [
        {
            "role": "system",
            "content": system_prompt
        }
    ]

    for message in request.messages[-6:]:

        role = (
            "assistant"
            if message.role.lower() == "jarvis"
            else "user"
        )

        ollama_messages.append({
            "role": role,
            "content": message.content
        })

    # ==========================================
    # RETURN FIXED QUESTION
    # ==========================================

    try:

        return {
            "reply": questions[question_index]
        }

    except Exception as e:

        print("JARVIS ERROR:", str(e))

        return {
            "error": "Unable to generate response",
            "details": str(e)
        }