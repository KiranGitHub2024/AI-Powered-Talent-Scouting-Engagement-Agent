# 🤖 AI-Powered Talent Scouting & Engagement Agent

An intelligent AI system that automates **candidate screening, ranking, and engagement** — helping recruiters save hours of manual effort.

---

## 🚀 Problem Statement

Recruiters spend significant time:

* Reviewing resumes manually
* Matching candidates with job descriptions
* Following up to check candidate interest

This project solves all of that using AI.

---

## 💡 Solution Overview

This system:

1. 📄 Parses Job Descriptions (JD)
2. 📂 Extracts data from resumes (PDF, TXT, CSV, Excel, DOCX)
3. 🧠 Matches candidates using skill-based scoring
4. 💬 Runs AI-driven candidate interaction through local Ollama
5. 🏆 Produces a ranked shortlist based on:

   * Match Score
   * Interest Score

---

## 🧠 Key Features

### ✅ JD Parsing

* Extracts role, skills, experience, and location using LLM + rules

### ✅ Resume Parsing

* Supports:

  * PDF
  * TXT
  * CSV
  * Excel
  * DOCX
* Extracts:

  * Name
  * Skills
  * Experience

### ✅ Candidate Matching Engine

* Compares JD skills with candidate skills
* Outputs:

  * Match Score (%)
  * Matched Skills
  * Missing Skills
  * Decision (Strong / Moderate / Low)

### ✅ Interest Score Engine (Ollama JARVIS Chat)

* Real local LLM chat UI per candidate using Ollama
* JARVIS asks:

  * Interest in role
  * Experience confidence
  * Availability
* Calculates Interest Score

### ✅ Ranking System

Final ranking based on:

* Match Score
* Interest Score

---

## 🖥️ Tech Stack

### Backend

* Python
* FastAPI
* Ollama local LLM integration
* pdfplumber
* pandas

### Frontend

* React.js
* Modern UI (LinkedIn-style design)

---


## ⚙️ How to Run

### 1. Clone Repo

```bash
git clone https://github.com/YOUR_USERNAME/AI-Powered-Talent-Scouting-Engagement-Agent.git
cd AI-Powered-Talent-Scouting-Engagement-Agent
```

---

### 2. Backend Setup

```bash
python -m venv venv
venv\Scripts\activate   # Windows

pip install -r requirements.txt
uvicorn main:app --reload
```

---

### 2.1 Ollama Setup

Install Ollama, then pull a free local model:

```bash
ollama pull llama3.2
ollama serve
```

By default the backend calls:

```bash
http://127.0.0.1:11434/api/chat
```

You can change the model with the `OLLAMA_MODEL` environment variable.

---

### 3. Frontend Setup

```bash
cd resume-ui
npm install
npm start
```

---

### 4. Open App

```
http://localhost:3000
```

---

## 🔥 Future Improvements

* Real candidate sourcing (LinkedIn API / scraping)
* Email / WhatsApp automated outreach
* Resume semantic matching (embeddings)
* Database integration

---

## 👨‍💻 Author

**Ravi Kiran Kothapalli**
Data Scientist | Full Stack Developer | AI Enthusiast

---

## ⭐ If you like this project

Give it a star ⭐ on GitHub!
