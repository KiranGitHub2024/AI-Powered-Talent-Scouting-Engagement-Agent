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
4. 💬 Simulates AI-driven candidate interaction
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

### ✅ Interest Score Engine (AI Chat Simulation)

* Interactive chat UI per candidate
* Asks:

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
* LLM Integration
* pdfplumber
* pandas

### Frontend

* React.js
* Modern UI (LinkedIn-style design)

---

## 📸 Screenshots

### 🔹 Main UI

(Add screenshot here)

### 🔹 Ranking Output

(Add screenshot here)

### 🔹 AI Chat Interaction

(Add screenshot here)

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
* Real LLM conversational agent (not simulated)
* Resume semantic matching (embeddings)
* Database integration

---

## 👨‍💻 Author

**Ravi Kiran Kothapalli**
Data Scientist | Full Stack Developer | AI Enthusiast

---

## ⭐ If you like this project

Give it a star ⭐ on GitHub!
