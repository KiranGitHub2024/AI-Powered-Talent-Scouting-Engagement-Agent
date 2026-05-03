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


def call_ollama_chat(messages, model=None):
    ollama_url = os.getenv("OLLAMA_URL", "http://127.0.0.1:11434/api/chat")
    ollama_model = model or os.getenv("OLLAMA_MODEL", "llama3.2")
    payload = {
        "model": ollama_model,
        "messages": messages,
        "stream": False,
        "keep_alive": os.getenv("OLLAMA_KEEP_ALIVE", "15m"),
        "options": {
            "temperature": 0.2,
            "num_ctx": int(os.getenv("OLLAMA_NUM_CTX", "1024")),
            "num_predict": int(os.getenv("OLLAMA_NUM_PREDICT", "70")),
            "top_p": 0.8,
        },
    }

    request = urllib.request.Request(
        ollama_url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    with urllib.request.urlopen(request, timeout=180) as response:
        data = json.loads(response.read().decode("utf-8"))
        return data.get("message", {}).get("content", "").strip()

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


@app.post("/parse-resume-profile")
async def parse_resume_profile(resume_file: UploadFile = File(...)):
    try:
        resume_file.file.seek(0)
        text = extract_text(resume_file.file, resume_file.filename)
        parsed_resume = parse_resume(text)

        return {
            "name": parsed_resume.get("name"),
            "skills": parsed_resume.get("skills", []),
            "experience": parsed_resume.get("experience"),
            "resume_text": text[:8000],
        }

    except Exception as e:
        print("RESUME PARSE ERROR:", str(e))
        return {"error": "Unable to parse resume"}


@app.post("/jarvis-chat")
async def jarvis_chat(request: JarvisChatRequest):
    questions = [
        "Ask whether the candidate is genuinely interested in this job.",
        "Ask whether the candidate feels their skills match this role, and invite one short reason.",
        "Ask how quickly the candidate can join the company.",
    ]

    if request.question_index >= len(questions):
        current_task = (
            "End the screening warmly. Say that all details have been sent to HR and that he or she will contact the candidate. "
            "Do not ask another question."
        )
    else:
        current_task = questions[request.question_index]

    system_prompt = f"""
You are JARVIS, a concise AI screening chatbot.
Candidate: {request.candidate_name or "Candidate"}; skills: {", ".join(request.candidate_skills[:8]) or "NA"}; experience: {request.candidate_experience or "NA"}.
Job: {request.job_title}; required skills: {", ".join(request.required_skills)}.
Task: {current_task}
Rules: ask one question only, max 45 words, friendly, no scores, no implementation details. First reply must introduce JARVIS.
"""

    ollama_messages = [{"role": "system", "content": system_prompt}]
    for message in request.messages[-10:]:
        role = "assistant" if message.role == "jarvis" else "user"
        ollama_messages.append({"role": role, "content": message.content})

    if not request.messages:
        ollama_messages.append({
            "role": "user",
            "content": (
                "Start the screening now. Introduce yourself as JARVIS, greet the candidate by name, "
                "and ask the first screening question about genuine interest in the job. Keep it under 45 words."
            ),
        })
    else:
        ollama_messages.append({
            "role": "user",
            "content": "Continue the screening by following the current task exactly. Keep it under 45 words.",
        })

    try:
        reply = call_ollama_chat(ollama_messages)
        if not reply:
            return {"error": "Ollama returned an empty response"}
        return {"reply": reply}

    except (urllib.error.URLError, TimeoutError) as e:
        print("OLLAMA CONNECTION ERROR:", str(e))
        return {
            "error": "Ollama is not running. Start Ollama locally and pull a model such as llama3.2.",
            "details": str(e),
        }
    except Exception as e:
        print("JARVIS OLLAMA ERROR:", str(e))
        return {"error": "Unable to generate JARVIS response", "details": str(e)}
