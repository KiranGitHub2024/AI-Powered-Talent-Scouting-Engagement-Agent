import React, { useMemo, useState } from "react";
import "./App.css";

const jobs = [
  {
    id: "full-stack-developer",
    title: "Full Stack Developer",
    team: "Product Engineering",
    location: "Bengaluru / Remote",
    type: "Full-time",
    level: "Mid-Senior",
    salary: "18-30 LPA",
    summary:
      "Build customer-facing SaaS workflows across React, Node.js, APIs, and cloud services.",
    skills: ["React", "Node.js", "TypeScript", "PostgreSQL", "REST APIs", "AWS"],
    nice: ["GraphQL", "Docker", "CI/CD"],
    description:
      "You will own features from architecture to release, collaborate with product teams, design clean APIs, and keep the user experience fast, accessible, and reliable.",
  },
  {
    id: "backend-developer",
    title: "Backend Developer",
    team: "Core Platform",
    location: "Hyderabad",
    type: "Full-time",
    level: "Mid",
    salary: "16-26 LPA",
    summary:
      "Design resilient services, event pipelines, and data models for high-volume systems.",
    skills: ["Node.js", "Python", "Microservices", "PostgreSQL", "Redis", "Kafka"],
    nice: ["Kubernetes", "gRPC", "System Design"],
    description:
      "You will build scalable backend services, improve observability, review architecture decisions, and partner with frontend and data teams.",
  },
  {
    id: "frontend-developer",
    title: "Front-End Developer",
    team: "Experience Design",
    location: "Pune / Remote",
    type: "Full-time",
    level: "Mid",
    salary: "14-24 LPA",
    summary:
      "Create polished interfaces with React, design systems, performance tuning, and thoughtful interaction states.",
    skills: ["React", "JavaScript", "CSS", "TypeScript", "Accessibility", "Redux"],
    nice: ["Figma", "Testing Library", "Animation"],
    description:
      "You will translate product flows into production UI, build reusable components, and keep pages crisp across desktop and mobile.",
  },
  {
    id: "cloud-engineer",
    title: "Cloud Engineer",
    team: "Infrastructure",
    location: "Chennai",
    type: "Full-time",
    level: "Senior",
    salary: "20-34 LPA",
    summary:
      "Operate secure AWS infrastructure with Terraform, Kubernetes, networking, and deployment automation.",
    skills: ["AWS", "Terraform", "Kubernetes", "Docker", "Linux", "CI/CD"],
    nice: ["Azure", "Security", "Cost Optimization"],
    description:
      "You will provision cloud systems, automate releases, harden environments, and help engineering teams ship safely.",
  },
  {
    id: "prompt-engineer",
    title: "Prompt Engineer",
    team: "Applied AI",
    location: "Remote",
    type: "Full-time",
    level: "Mid-Senior",
    salary: "18-32 LPA",
    summary:
      "Design, evaluate, and improve LLM workflows for enterprise assistants and AI agents.",
    skills: ["Prompt Engineering", "LLMs", "Python", "RAG", "Evaluation", "OpenAI API"],
    nice: ["LangChain", "Vector Databases", "Agent Design"],
    description:
      "You will craft prompts, create evaluation sets, tune retrieval workflows, and partner with product teams to turn ambiguous tasks into dependable AI experiences.",
  },
  {
    id: "machine-learning-engineer",
    title: "Machine Learning Engineer",
    team: "Data Science",
    location: "Bengaluru",
    type: "Full-time",
    level: "Senior",
    salary: "24-42 LPA",
    summary:
      "Productionize ML models with Python, feature pipelines, model monitoring, and robust experimentation.",
    skills: ["Python", "Machine Learning", "TensorFlow", "PyTorch", "MLOps", "SQL"],
    nice: ["Airflow", "Databricks", "Model Monitoring"],
    description:
      "You will build training pipelines, deploy models, monitor quality drift, and make ML systems easier for teams to trust.",
  },
  {
    id: "data-engineer",
    title: "Data Engineer",
    team: "Analytics Platform",
    location: "Gurugram",
    type: "Full-time",
    level: "Mid",
    salary: "15-27 LPA",
    summary:
      "Own lakehouse pipelines, warehouse models, and reliable data products for business teams.",
    skills: ["SQL", "Python", "Spark", "Airflow", "ETL", "Data Modeling"],
    nice: ["Snowflake", "dbt", "Kafka"],
    description:
      "You will design batch and streaming pipelines, improve data quality, and build datasets that power dashboards and AI features.",
  },
  {
    id: "data-analyst",
    title: "Data Analyst",
    team: "Business Intelligence",
    location: "Bengaluru / Hybrid",
    type: "Full-time",
    level: "Mid",
    salary: "10-18 LPA",
    summary:
      "Turn product, sales, and operational data into clear insights, dashboards, and decision-ready analysis.",
    skills: ["SQL", "Excel", "Power BI", "Python", "Data Visualization", "Statistics"],
    nice: ["Tableau", "A/B Testing", "Business Intelligence"],
    description:
      "You will build dashboards, analyze trends, define metrics, prepare stakeholder reports, and help teams make confident data-backed decisions.",
  },
  {
    id: "devops-engineer",
    title: "DevOps Engineer",
    team: "Developer Platform",
    location: "Noida / Hybrid",
    type: "Full-time",
    level: "Mid-Senior",
    salary: "17-30 LPA",
    summary:
      "Improve build pipelines, release automation, observability, and incident response practices.",
    skills: ["CI/CD", "Docker", "Kubernetes", "Jenkins", "AWS", "Monitoring"],
    nice: ["Terraform", "SRE", "GitOps"],
    description:
      "You will streamline delivery workflows, maintain runtime platforms, and partner with teams on uptime and reliability goals.",
  },
  {
    id: "cybersecurity-analyst",
    title: "Cybersecurity Analyst",
    team: "Security Operations",
    location: "Mumbai",
    type: "Full-time",
    level: "Mid",
    salary: "13-23 LPA",
    summary:
      "Monitor threats, investigate alerts, improve controls, and guide secure engineering decisions.",
    skills: ["SIEM", "Incident Response", "Network Security", "Vulnerability Assessment", "Linux", "Cloud Security"],
    nice: ["SOC", "Forensics", "ISO 27001"],
    description:
      "You will analyze security events, document incidents, coordinate remediation, and improve detection coverage.",
  },
  {
    id: "qa-automation-engineer",
    title: "QA Automation Engineer",
    team: "Quality Engineering",
    location: "Remote",
    type: "Full-time",
    level: "Mid",
    salary: "12-22 LPA",
    summary:
      "Create dependable automated tests for web apps, APIs, releases, and regression suites.",
    skills: ["Selenium", "Playwright", "JavaScript", "API Testing", "Jest", "CI/CD"],
    nice: ["Performance Testing", "Cypress", "Test Strategy"],
    description:
      "You will build automation coverage, prevent regressions, and improve release confidence with practical test design.",
  },
  {
    id: "mobile-app-developer",
    title: "Mobile App Developer",
    team: "Mobile Experience",
    location: "Bengaluru / Hybrid",
    type: "Full-time",
    level: "Mid",
    salary: "15-28 LPA",
    summary:
      "Ship high-quality mobile experiences with React Native, API integration, and performance care.",
    skills: ["React Native", "JavaScript", "TypeScript", "REST APIs", "Android", "iOS"],
    nice: ["Expo", "Firebase", "Mobile Analytics"],
    description:
      "You will build mobile features, integrate native capabilities, profile performance, and collaborate with design and backend teams.",
  },
  {
    id: "ui-ux-designer",
    title: "UI/UX Designer",
    team: "Design Studio",
    location: "Pune",
    type: "Full-time",
    level: "Mid-Senior",
    salary: "14-26 LPA",
    summary:
      "Design thoughtful enterprise workflows using research, systems thinking, and polished visual craft.",
    skills: ["Figma", "User Research", "Design Systems", "Prototyping", "Interaction Design", "Usability Testing"],
    nice: ["Analytics", "Accessibility", "Product Strategy"],
    description:
      "You will map journeys, prototype workflows, run usability reviews, and raise the quality of production experiences.",
  },
  {
    id: "database-administrator",
    title: "Database Administrator",
    team: "Data Reliability",
    location: "Hyderabad",
    type: "Full-time",
    level: "Senior",
    salary: "18-31 LPA",
    summary:
      "Keep relational databases secure, performant, backed up, and ready for growth.",
    skills: ["PostgreSQL", "MySQL", "Performance Tuning", "Backup Recovery", "SQL", "Linux"],
    nice: ["Replication", "Cloud Databases", "Automation"],
    description:
      "You will tune queries, manage backups, plan capacity, and partner with engineering on schema and reliability decisions.",
  },
  {
    id: "ai-product-manager",
    title: "AI Product Manager",
    team: "AI Products",
    location: "Gurugram / Remote",
    type: "Full-time",
    level: "Senior",
    salary: "26-45 LPA",
    summary:
      "Lead AI products from discovery to launch, balancing user value, model quality, and business outcomes.",
    skills: ["Product Strategy", "AI", "Analytics", "Roadmapping", "User Research", "Experimentation"],
    nice: ["LLMs", "RAG", "Enterprise SaaS"],
    description:
      "You will define AI workflows, prioritize releases, track adoption, and align design, engineering, and stakeholders.",
  },
  {
    id: "solutions-architect",
    title: "Solutions Architect",
    team: "Customer Engineering",
    location: "Mumbai / Remote",
    type: "Full-time",
    level: "Senior",
    salary: "28-48 LPA",
    summary:
      "Design technical solutions for enterprise customers across cloud, integrations, APIs, and AI capabilities.",
    skills: ["System Design", "Cloud Architecture", "APIs", "Security", "Stakeholder Management", "AWS"],
    nice: ["Pre-Sales", "Kubernetes", "Data Architecture"],
    description:
      "You will turn customer needs into technical plans, guide implementation teams, and present clear architecture tradeoffs.",
  },
  {
    id: "genai-engineer",
    title: "Generative AI Engineer",
    team: "Innovation Lab",
    location: "Remote",
    type: "Full-time",
    level: "Senior",
    salary: "24-44 LPA",
    summary:
      "Build RAG apps, AI agents, model evaluations, and production-ready generative AI services.",
    skills: ["Python", "LLMs", "RAG", "Vector Databases", "LangChain", "OpenAI API"],
    nice: ["Fine-Tuning", "Guardrails", "Azure AI"],
    description:
      "You will build intelligent workflows, connect retrieval systems, evaluate model behavior, and bring AI prototypes into production.",
  },
];

const screeningQuestions = [
  {
    key: "interest",
    question: "Are you interested in this job?",
  },
  {
    key: "skillFit",
    question: "Do you feel your skills match this role?",
  },
  {
    key: "availability",
    question: "How quickly can you join the company?",
  },
];

const knownSkills = [...new Set(jobs.flatMap((job) => [...job.skills, ...job.nice]))];

function titleCaseName(name) {
  return name
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

function cleanNameCandidate(value) {
  if (!value) return "";
  return value
    .replace(/name|candidate|applicant|resume|curriculum vitae|cv/gi, "")
    .replace(/[:\-|•]/g, " ")
    .replace(/[^a-zA-Z\s.'-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function looksLikePersonName(value) {
  const words = cleanNameCandidate(value).split(/\s+/).filter(Boolean);
  const blocked = /resume|curriculum|vitae|email|phone|mobile|linkedin|github|portfolio|address|experience|education|skills|objective|summary|developer|engineer/i;
  return words.length >= 2 && words.length <= 4 && !blocked.test(value) && words.every((word) => /^[A-Za-z][A-Za-z.'-]{1,}$/.test(word));
}

function inferNameFromResumeText(resumeText) {
  if (!resumeText) return "";
  const normalized = resumeText.replace(/\r/g, "\n");
  const explicitName = normalized.match(/(?:^|\n)\s*(?:candidate\s+name|applicant\s+name|name)\s*[:-]\s*([A-Za-z][A-Za-z\s.'-]{2,60})/i);

  if (explicitName && looksLikePersonName(explicitName[1])) {
    return titleCaseName(cleanNameCandidate(explicitName[1]));
  }

  const lines = normalized
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 12);
  const nameLine = lines.find(looksLikePersonName);

  return nameLine ? titleCaseName(cleanNameCandidate(nameLine)) : "";
}

function extractSkillsFromText(resumeText, job) {
  const lowerText = (resumeText || "").toLowerCase();
  const profileSkills = knownSkills.filter((skill) => lowerText.includes(skill.toLowerCase()));
  const jobMatchedSkills = job.skills.filter((skill) => lowerText.includes(skill.toLowerCase()));
  return [...new Set([...profileSkills, ...jobMatchedSkills])];
}

function readResumeTextInBrowser(file) {
  return new Promise((resolve) => {
    if (!file) {
      resolve("");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        resolve(result);
        return;
      }

      const bytes = new Uint8Array(result || []);
      const decoded = new TextDecoder("utf-8", { fatal: false }).decode(bytes);
      resolve(
        [...decoded]
          .map((char) => {
            const code = char.charCodeAt(0);
            return code === 9 || code === 10 || code === 13 || (code >= 32 && code <= 126) ? char : " ";
          })
          .join("")
      );
    };
    reader.onerror = () => resolve("");

    if (/\.(txt|csv)$/i.test(file.name)) {
      reader.readAsText(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  });
}

async function parseResumeProfile(file) {
  const formData = new FormData();
  formData.append("resume_file", file);

  try {
    const response = await fetch("http://127.0.0.1:8000/parse-resume-profile", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      if (!data.error) {
        return {
          name: data.name || "",
          skills: data.skills || [],
          experience: data.experience || "",
          resumeText: data.resume_text || "",
        };
      }
    }
  } catch {
    // Local backend may not be running during UI-only demos.
  }

  const resumeText = await readResumeTextInBrowser(file);
  return {
    name: inferNameFromResumeText(resumeText),
    skills: extractSkillsFromText(resumeText, jobs[0]),
    experience: "",
    resumeText,
  };
}

async function callJarvisChat({
  profile,
  job,
  messages,
  questionIndex,
}) {

  let response;

  const formattedMessages = messages.map(
    (message) => ({
      role:
        message.sender === "jarvis"
          ? "assistant"
          : "user",

      content: message.text,
    })
  );

  try {

    response = await fetch(
      "http://127.0.0.1:8000/jarvis-chat",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          candidate_name:
            profile.name || "Candidate",

          candidate_skills:
            profile.skills || [],

          candidate_experience:
            profile.experience || "",

          job_title: job.title,

          job_description:
            job.description,

          required_skills:
            job.skills,

          question_index:
            questionIndex,

          messages:
            formattedMessages,
        }),
      }
    );

  } catch {

    throw new Error(
      "Backend is not reachable. Start FastAPI with: uvicorn main:app --reload"
    );
  }

  const data = await response.json();

  if (!response.ok || data.error) {

    throw new Error(
      data.error ||
      "Unable to connect to JARVIS"
    );
  }

  return data.reply;
}
function buildProfileFromResume(parsedResume, job) {
  const name = inferNameFromResumeText(parsedResume.resumeText) || cleanNameCandidate(parsedResume.name) || "Candidate";
  const nameScore = [...name].reduce((total, char) => total + char.charCodeAt(0), 0);
  const extractedSkills = [
    ...new Set([
      ...extractSkillsFromText(parsedResume.resumeText, job),
      ...(parsedResume.skills || []),
    ]),
  ];
  const required = extractedSkills.length ? job.skills.filter((skill) => extractedSkills.includes(skill)) : job.skills.filter((_, index) => (index + nameScore) % 3 !== 0);
  const bonus = job.nice.filter((_, index) => (index + nameScore) % 2 === 0);
  const fallback = required.length ? required : job.skills.slice(0, 4);

  return {
    name: titleCaseName(cleanNameCandidate(name)) || "Candidate",
    skills: [...new Set([...fallback, ...bonus, ...extractedSkills])],
    experience: parsedResume.experience || `${3 + (nameScore % 5)} years`,
    location: ["Bengaluru", "Hyderabad", "Pune", "Remote", "Chennai"][nameScore % 5],
  };
}

function normalizeAnswer(text) {
  return (text || "").trim().toLowerCase();
}

function deriveScreeningAnswers(messages = []) {
  const candidateReplies = messages
    .filter((message) => message.sender === "candidate")
    .map((message) => message.text);
  const interestText = normalizeAnswer(candidateReplies[0]);
  const skillText = normalizeAnswer(candidateReplies[1]);
  const availabilityText = normalizeAnswer(candidateReplies[2]);

  let interest = "Maybe";
  if (/\b(yes|interested|excited|definitely|sure|absolutely)\b/.test(interestText)) interest = "Yes";
  if (/\b(no|not interested|not now|decline)\b/.test(interestText)) interest = "No";

  let skillFit = "Partially";
  if (/\b(yes|match|strong|confident|definitely|most|all)\b/.test(skillText)) skillFit = "Yes";
  if (/\b(no|not match|don't|do not|lack|missing)\b/.test(skillText)) skillFit = "No";

  let availability = "1+ Month";
  if (/\b(immediate|immediately|now|today|tomorrow|asap)\b/.test(availabilityText)) availability = "Immediate";
  if (/\b(1-2|one to two|two weeks|2 weeks|one week|1 week|15 days)\b/.test(availabilityText)) availability = "1-2 Weeks";

  return [interest, skillFit, availability];
}

function calculateInterestScore(answers = []) {
  let score = 0;
  if (answers[0] === "Yes") score += 42;
  if (answers[0] === "Maybe") score += 22;
  if (answers[1] === "Yes") score += 34;
  if (answers[1] === "Partially") score += 18;
  if (answers[2] === "Immediate") score += 24;
  if (answers[2] === "1-2 Weeks") score += 17;
  if (answers[2] === "1+ Month") score += 8;
  return Math.min(score, 100);
}

function createApplication(profile, job, answers, resumeName, seed = Date.now()) {
  const matchedSkills = job.skills.filter((skill) => profile.skills.includes(skill));
  const missingSkills = job.skills.filter((skill) => !profile.skills.includes(skill));
  const niceMatches = job.nice.filter((skill) => profile.skills.includes(skill));
  const matchScore = Math.min(
    100,
    Math.round((matchedSkills.length / job.skills.length) * 82 + (niceMatches.length / Math.max(job.nice.length, 1)) * 18)
  );
  const interestScore = calculateInterestScore(answers);
  const combinedScore = Math.round(matchScore * 0.65 + interestScore * 0.35);

  return {
    id: `${job.id}-${profile.name.replace(/\s+/g, "-").toLowerCase()}-${seed}`,
    jobId: job.id,
    jobTitle: job.title,
    candidateName: profile.name,
    resumeName,
    location: profile.location,
    experience: profile.experience,
    skills: profile.skills,
    matchedSkills,
    missingSkills,
    answers,
    matchScore,
    interestScore,
    combinedScore,
    appliedAt: "Today",
    explanation:
      matchedSkills.length > 0
        ? `${profile.name} covers ${matchedSkills.length} of ${job.skills.length} required skills for ${job.title}.`
        : `${profile.name} has adjacent experience, but the required stack needs deeper validation.`,
  };
}

function App() {
  const [view, setView] = useState("home");
  const [selectedJobId, setSelectedJobId] = useState(jobs[0].id);
  const [applications, setApplications] = useState([]);
  const [resumeFile, setResumeFile] = useState(null);
  const [screening, setScreening] = useState(null);
  const [chatMessage, setChatMessage] = useState("");
  const [isParsingResume, setIsParsingResume] = useState(false);
  const [isJarvisThinking, setIsJarvisThinking] = useState(false);
  const [startupStatus, setStartupStatus] = useState("");
  const [candidateReply, setCandidateReply] = useState("");
  const [filterJob, setFilterJob] = useState("all");
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);

  const selectedJob = jobs.find((job) => job.id === selectedJobId) || jobs[0];

  const groupedApplications = useMemo(() => {
    const filtered =
      filterJob === "all" ? applications : applications.filter((application) => application.jobId === filterJob);
    return [...filtered].sort((a, b) => b.combinedScore - a.combinedScore);
  }, [applications, filterJob]);

  const selectedApplication =
    applications.find((application) => application.id === selectedApplicationId) || groupedApplications[0];

  const jobCounts = useMemo(
    () =>
      jobs.reduce((acc, job) => {
        acc[job.id] = applications.filter((application) => application.jobId === job.id).length;
        return acc;
      }, {}),
    [applications]
  );

  const startApplication = async () => {
    if (!resumeFile) return;
    setIsParsingResume(true);
    setChatMessage("");
    setStartupStatus("Reading resume content and extracting candidate details...");

    try {
      const parsedResume = await parseResumeProfile(resumeFile);
      const profile = buildProfileFromResume(parsedResume, selectedJob);
      setStartupStatus("Connecting to local Ollama JARVIS...");
      const reply = await callJarvisChat({
        profile,
        job: selectedJob,
        messages: [],
        questionIndex: 0,
      });

      setScreening({
        profile,
        step: 0,
        answers: [],
        messages: [
          { sender: "jarvis", text: reply },
        ],
      });
      setStartupStatus("");
    } catch (error) {
      setChatMessage(error.message);
      setStartupStatus("");
    } finally {
      setIsParsingResume(false);
    }
  };

const sendCandidateReply = async (event) => {

  event.preventDefault();

  if (
    !screening ||
    !candidateReply.trim() ||
    isJarvisThinking
  ) {
    return;
  }

  const trimmedReply =
    candidateReply.trim();

  setCandidateReply("");

  setIsJarvisThinking(true);

  const userMessage = {
    sender: "candidate",
    text: trimmedReply,
  };

  const updatedMessages = [
    ...screening.messages,
    userMessage,
  ];

  const nextQuestionIndex =
    screening.step + 1;

  try {

    const reply =
      await callJarvisChat({
        profile: screening.profile,

        job: selectedJob,

        messages: updatedMessages,

        questionIndex:
          nextQuestionIndex,
      });

    const assistantMessage = {
      sender: "jarvis",
      text: reply,
    };

    const finalMessages = [
      ...updatedMessages,
      assistantMessage,
    ];

    // SCREENING COMPLETE

    if (
      nextQuestionIndex >=
      screeningQuestions.length
    ) {

      const answers =
        deriveScreeningAnswers(
          finalMessages
        );

      const application =
        createApplication(
          screening.profile,

          selectedJob,

          answers,

          resumeFile?.name ||
            `${screening.profile.name}.pdf`
        );

      setApplications((current) => [
        application,
        ...current,
      ]);

      setSelectedApplicationId(
        application.id
      );

      setScreening({
        profile:
          screening.profile,

        step:
          nextQuestionIndex,

        answers,

        messages:
          finalMessages,

        completed: true,
      });

      setChatMessage(
        "Application submitted and ranked for the recruiter."
      );

    } else {

      // CONTINUE SCREENING

      setScreening({
        profile:
          screening.profile,

        step:
          nextQuestionIndex,

        answers:
          screening.answers,

        messages:
          finalMessages,

        completed: false,
      });
    }

  } catch (error) {

    console.error(error);

    setChatMessage(error.message);

  } finally {

    setIsJarvisThinking(false);
  }
};
  const resetApplyFlow = () => {
    setResumeFile(null);
    setScreening(null);
    setChatMessage("");
    setIsParsingResume(false);
    setIsJarvisThinking(false);
    setStartupStatus("");
    setCandidateReply("");
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => setView("home")}>
          <span className="brand-mark">TS</span>
          <span>
            <strong>Talent Scout 2.0</strong>
            <small>AI scouting and engagement agent</small>
          </span>
        </button>
        <nav className="nav-actions" aria-label="Dashboard navigation">
          <button className={view === "candidate" ? "nav-button active" : "nav-button"} onClick={() => setView("candidate")}>
            Candidate
          </button>
          <button className={view === "recruiter" ? "nav-button active" : "nav-button"} onClick={() => setView("recruiter")}>
            Recruiter
          </button>
        </nav>
      </header>

      {view === "home" && (
        <main className="home-view">
          <section className="hero-panel">
            <div className="hero-copy">
              <p className="eyebrow">AI-Powered Talent Scouting & Engagement Agent</p>
              <h1>Rank candidates by fit and genuine interest before HR spends an hour chasing replies.</h1>
              <p>
                Choose a dashboard to experience the full flow: job discovery, resume upload, JARVIS screening,
                explainable matching, interest scoring, and recruiter-ready ranking.
              </p>
            </div>
            <div className="hero-metrics" aria-label="Platform metrics">
              <div>
                <strong>{jobs.length}</strong>
                <span>IT openings</span>
              </div>
              <div>
                <strong>{applications.length}</strong>
                <span>Applications</span>
              </div>
              <div>
                <strong>2D</strong>
                <span>Match + interest</span>
              </div>
            </div>
          </section>

          <section className="role-grid" aria-label="Choose dashboard">
            <button className="role-card candidate-card" onClick={() => setView("candidate")}>
              <span className="role-icon">C</span>
              <span className="role-title">Candidate Dashboard</span>
              <span className="role-copy">Browse {jobs.length} IT roles, inspect job details, upload a resume, and complete JARVIS screening.</span>
            </button>
            <button className="role-card recruiter-card" onClick={() => setView("recruiter")}>
              <span className="role-icon">R</span>
              <span className="role-title">Recruiter Dashboard</span>
              <span className="role-copy">Review applications grouped by job, filter openings, and inspect skill fit with match and interest scores.</span>
            </button>
          </section>
        </main>
      )}

      {view === "candidate" && (
        <main className="dashboard-layout">
          <aside className="job-sidebar">
            <div className="panel-heading">
              <p className="eyebrow">Open roles</p>
              <h2>Candidate Dashboard</h2>
            </div>
            <div className="job-list">
              {jobs.map((job) => (
                <button
                  key={job.id}
                  className={selectedJobId === job.id ? "job-row selected" : "job-row"}
                  onClick={() => {
                    setSelectedJobId(job.id);
                    resetApplyFlow();
                  }}
                >
                  <span>
                    <strong>{job.title}</strong>
                    <small>{job.location}</small>
                  </span>
                  <em>{jobCounts[job.id] || 0}</em>
                </button>
              ))}
            </div>
          </aside>

          <section className="job-detail">
            <div className="detail-header">
              <div>
                <p className="eyebrow">{selectedJob.team}</p>
                <h1>{selectedJob.title}</h1>
                <p>{selectedJob.summary}</p>
              </div>
              <div className="salary-badge">{selectedJob.salary}</div>
            </div>

            <div className="job-facts">
              <span>{selectedJob.location}</span>
              <span>{selectedJob.type}</span>
              <span>{selectedJob.level}</span>
            </div>

            <div className="detail-grid">
              <section>
                <h3>Role Details</h3>
                <p>{selectedJob.description}</p>
              </section>
              <section>
                <h3>Required Skills</h3>
                <div className="skill-cloud">
                  {selectedJob.skills.map((skill) => (
                    <span key={skill}>{skill}</span>
                  ))}
                </div>
              </section>
              <section>
                <h3>Good To Have</h3>
                <div className="skill-cloud soft">
                  {selectedJob.nice.map((skill) => (
                    <span key={skill}>{skill}</span>
                  ))}
                </div>
              </section>
            </div>

            <section className="apply-panel">
              <div>
                <h3>Apply For This Role</h3>
                <p>Upload PDF, Excel, CSV, or Word resume. JARVIS will extract your profile and begin live AI screening.</p>
              </div>
              <div className="upload-row">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.csv,.xls,.xlsx"
                  onChange={(event) => {
                    setResumeFile(event.target.files?.[0] || null);
                    setScreening(null);
                    setChatMessage("");
                    setStartupStatus("");
                  }}
                />
                <button className="primary-button" disabled={!resumeFile || isParsingResume} onClick={startApplication}>
                  {isParsingResume ? "Reading Resume..." : "Apply"}
                </button>
              </div>
              {startupStatus && <p className="parse-note">{startupStatus}</p>}
              {chatMessage && !screening && <p className="error-note">{chatMessage}</p>}
            </section>

            {screening && (
              <section className="chat-panel">
                <div className="chat-header">
                  <div>
                    <p className="eyebrow">Live AI Screening</p>
                    <h3>JARVIS</h3>
                  </div>
                  <span className={screening.completed ? "status-pill done" : "status-pill"}>{screening.completed ? "Complete" : "Live"}</span>
                </div>
                <div className="chat-stream">
                  {screening.messages.map((message, index) => (
                    <div key={`${message.text}-${index}`} className={message.sender === "jarvis" ? "bubble jarvis" : "bubble candidate"}>
                      <strong>{message.sender === "jarvis" ? "JARVIS" : screening.profile.name}</strong>
                      <p>{message.text}</p>
                    </div>
                  ))}
                  {isJarvisThinking && (
                    <div className="bubble jarvis thinking">
                      <strong>JARVIS</strong>
                      <p>Thinking...</p>
                    </div>
                  )}
                </div>
                {!screening.completed && (
                  <form className="chat-input-row" onSubmit={sendCandidateReply}>
                    <input
                      value={candidateReply}
                      onChange={(event) => setCandidateReply(event.target.value)}
                      placeholder="Type your answer to JARVIS..."
                      disabled={isJarvisThinking}
                    />
                    <button type="submit" disabled={!candidateReply.trim() || isJarvisThinking}>
                      Send
                    </button>
                  </form>
                )}
                {chatMessage && <p className="success-note">{chatMessage}</p>}
              </section>
            )}
          </section>
        </main>
      )}

      {view === "recruiter" && (
        <main className="recruiter-view">
          <section className="recruiter-header">
            <div>
              <p className="eyebrow">Ranked shortlist</p>
              <h1>Recruiter Dashboard</h1>
              <p>Applications are ordered by combined score, with skill evidence and JARVIS interest signals visible at a glance.</p>
            </div>
            <select value={filterJob} onChange={(event) => setFilterJob(event.target.value)} aria-label="Filter applications by job">
              <option value="all">All job applications</option>
              {jobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.title}
                </option>
              ))}
            </select>
          </section>

          <section className="recruiter-grid">
            <div className="applications-panel">
              {groupedApplications.length > 0 ? (
                groupedApplications.map((application, index) => (
                  <button
                    key={application.id}
                    className={selectedApplication?.id === application.id ? "application-row active" : "application-row"}
                    onClick={() => setSelectedApplicationId(application.id)}
                  >
                    <span className="rank">#{index + 1}</span>
                    <span className="applicant-main">
                      <strong>{application.candidateName}</strong>
                      <small>{application.jobTitle}</small>
                    </span>
                    <span className="combined-score">{application.combinedScore}</span>
                  </button>
                ))
              ) : (
                <div className="empty-state">
                  <strong>No applications yet</strong>
                  <p>Candidate applications will appear here after someone applies and completes the JARVIS screening.</p>
                </div>
              )}
            </div>

            {selectedApplication ? (
              <article className="candidate-insight">
                <div className="candidate-heading">
                  <div>
                    <p className="eyebrow">{selectedApplication.jobTitle}</p>
                    <h2>{selectedApplication.candidateName}</h2>
                    <p>{selectedApplication.experience} · {selectedApplication.location} · {selectedApplication.resumeName}</p>
                  </div>
                  <div className="score-orb">
                    <strong>{selectedApplication.combinedScore}</strong>
                    <span>Rank score</span>
                  </div>
                </div>

                <div className="score-cards">
                  <div>
                    <span>Match Score</span>
                    <strong>{selectedApplication.matchScore}%</strong>
                  </div>
                  <div>
                    <span>Interest Score</span>
                    <strong>{selectedApplication.interestScore}%</strong>
                  </div>
                  <div>
                    <span>Application</span>
                    <strong>{selectedApplication.appliedAt}</strong>
                  </div>
                </div>

                <section className="insight-section">
                  <h3>Explainability</h3>
                  <p>{selectedApplication.explanation}</p>
                </section>

                <section className="insight-section">
                  <h3>Skills</h3>
                  <div className="skill-columns">
                    <div>
                      <h4>Matched Skills</h4>
                      <div className="skill-cloud matched">
                        {selectedApplication.matchedSkills.map((skill) => (
                          <span key={skill}>{skill}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4>Missing Skills</h4>
                      <div className="skill-cloud missing">
                        {selectedApplication.missingSkills.map((skill) => (
                          <span key={skill}>{skill}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

                <section className="insight-section">
                  <h3>JARVIS Screening</h3>
                  <div className="screening-table">
                    {screeningQuestions.map((question, index) => (
                      <div key={question.key}>
                        <span>{question.question}</span>
                        <strong>{selectedApplication.answers[index]}</strong>
                      </div>
                    ))}
                  </div>
                </section>
              </article>
            ) : (
              <article className="candidate-insight empty-detail">
                <p className="eyebrow">Awaiting applications</p>
                <h2>Recruiter shortlist is empty</h2>
                <p>
                  Once a candidate applies from the Candidate Dashboard, their match score, interest score,
                  matched skills, missing skills, and JARVIS answers will be ranked here automatically.
                </p>
              </article>
            )}
          </section>
        </main>
      )}
    </div>
  );
}

export default App;
