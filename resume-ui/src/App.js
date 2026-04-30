import React, { useState } from "react";

function App() {
  const [jdFile, setJdFile] = useState(null);
  const [jdText, setJdText] = useState("");

  const [resumeInputs, setResumeInputs] = useState([
    { file: null, answers: {} }
  ]);

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const [activeChat, setActiveChat] = useState(null);
  const [chatStep, setChatStep] = useState(-1);
  const [chatHistory, setChatHistory] = useState([]);

  const questions = [
    "Are you interested in this job opportunity?",
    "Do you feel your experience matches this role?",
    "What is your availability?"
  ];

  const options = [
    ["Yes", "No", "Maybe"],
    ["Yes", "No", "Maybe"],
    ["Immediate", "1-2 Weeks", "1+ Month"]
  ];

  const handleResumeChange = (index, file) => {
    const updated = [...resumeInputs];
    updated[index].file = file;
    setResumeInputs(updated);
  };

  const addResumeInput = () => {
    setResumeInputs([...resumeInputs, { file: null, answers: {} }]);
  };

  const removeResumeInput = (index) => {
    const updated = resumeInputs.filter((_, i) => i !== index);
    setResumeInputs(updated);
  };

  const startChat = (index) => {
    const name = results?.[index]?.name || "Candidate";

    setActiveChat(index);
    setChatStep(-1);

    setChatHistory([
      {
        sender: "ai",
        text: `Hi ${name}, are you ready to answer the questions?`
      }
    ]);
  };

  const handleAnswer = (answer) => {
    let history = [...chatHistory, { sender: "user", text: answer }];

    if (chatStep === -1) {
      if (answer === "No") {
        setActiveChat(null);
        return;
      }

      history.push({ sender: "ai", text: questions[0] });
      setChatStep(0);
      setChatHistory(history);
      return;
    }

    const next = chatStep + 1;

    const updated = [...resumeInputs];
    updated[activeChat].answers[chatStep] = answer;
    setResumeInputs(updated);

    if (next < questions.length) {
      history.push({ sender: "ai", text: questions[next] });
      setChatStep(next);
    } else {
      setActiveChat(null);
    }

    setChatHistory(history);
  };

  const calculateInterest = (answers) => {
    let score = 0;

    if (answers[0] === "Yes") score += 40;
    if (answers[0] === "Maybe") score += 20;

    if (answers[1] === "Yes") score += 30;
    if (answers[1] === "Maybe") score += 15;

    if (answers[2] === "Immediate") score += 30;
    if (answers[2] === "1-2 Weeks") score += 20;

    return score;
  };

  const handleSubmit = async () => {
    const formData = new FormData();

    if (jdFile) formData.append("jd_file", jdFile);
    else if (jdText) formData.append("jd_text", jdText);

    resumeInputs.forEach((r) => {
      if (r.file) formData.append("resume_files", r.file);
    });

    try {
      setLoading(true);

      const response = await fetch("http://127.0.0.1:8000/upload-and-rank", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("API Error");

      const data = await response.json();

      const updatedResults = data.ranked_candidates.map((c, i) => {
        const interest = calculateInterest(resumeInputs[i]?.answers || {});

        return {
          ...c,
          interest_score: interest,
          final_score: (c.match_score * 0.7 + interest * 0.3).toFixed(2)
        };
      });

      setResults(updatedResults);

    } catch {
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageStyle}>
      <header style={headerStyle}>
        <div>
          <div style={eyebrow}>AI Recruitment Intelligence</div>
          <h1 style={title}>Talent Scouting System</h1>
        </div>
        <div style={headerBadge}>Candidate Ranking</div>
      </header>

      <main style={mainStyle}>
        <section style={gridStyle}>
          <div style={cardStyle}>
            <div style={sectionHeader}>
              <div>
                <h2 style={sectionTitle}>Job Description</h2>
                <p style={sectionText}>Upload a JD file or paste the role details manually.</p>
              </div>
              <span style={stepBadge}>01</span>
            </div>

            <label style={fieldLabel}>JD File</label>
            <input
              type="file"
              onChange={(e) => setJdFile(e.target.files[0])}
              style={fileInputStyle}
            />

            <label style={fieldLabel}>Job Description Text</label>
            <textarea
              rows="6"
              placeholder="Paste the job description here..."
              style={textareaStyle}
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
            />
          </div>

          <div style={cardStyle}>
            <div style={sectionHeader}>
              <div>
                <h2 style={sectionTitle}>Candidate Resumes</h2>
                <p style={sectionText}>Add resumes and collect candidate responses.</p>
              </div>
              <span style={stepBadge}>02</span>
            </div>

            {resumeInputs.map((r, index) => (
              <div key={index} style={resumeRow}>
                <div style={{ flex: 1 }}>
                  <label style={fieldLabel}>Resume {index + 1}</label>
                  <input
                    type="file"
                    onChange={(e) => handleResumeChange(index, e.target.files[0])}
                    style={fileInputStyle}
                  />
                </div>

                <div style={resumeActions}>
                  {r.file && (
                    <button onClick={() => startChat(index)} style={ghostBtn}>
                      Answer Questions
                    </button>
                  )}

                  {resumeInputs.length > 1 && (
                    <button onClick={() => removeResumeInput(index)} style={removeBtn}>
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}

            <button style={secondaryBtn} onClick={addResumeInput}>
              Add Another Resume
            </button>
          </div>
        </section>

        <div style={submitWrap}>
          <button style={loading ? disabledBtn : primaryBtn} onClick={handleSubmit} disabled={loading}>
            {loading ? "Processing Candidates..." : "Upload & Rank Candidates"}
          </button>
        </div>

        {results && (
          <section style={resultsSection}>
            <div style={resultsHeader}>
              <div>
                <h2 style={resultsTitle}>Ranked Candidates</h2>
                <p style={sectionText}>Sorted by match quality, interest, and final score.</p>
              </div>
            </div>

            {results.map((c, i) => (
              <div key={i} style={resultCard}>
                <div style={candidateTop}>
                  <div>
                    <div style={rankBadge}>Rank #{i + 1}</div>
                    <h3 style={candidateName}>{c.name}</h3>
                  </div>
                  <div style={finalScoreBox}>
                    <span style={scoreLabel}>Final Score</span>
                    <strong style={scoreValue}>{c.final_score}%</strong>
                  </div>
                </div>

                <div style={scoreGrid}>
                  <div style={scoreItem}>
                    <span>Match Score</span>
                    <strong>{c.match_score}%</strong>
                  </div>
                  <div style={scoreItem}>
                    <span>Interest Score</span>
                    <strong>{c.interest_score}%</strong>
                  </div>
                  <div style={scoreItem}>
                    <span>Decision</span>
                    <strong>{c.decision}</strong>
                  </div>
                </div>

                <p style={skillTitle}>Matched Skills</p>
                <div style={tagContainer}>
                  {c.matched_skills.map((s, idx) => (
                    <span key={idx} style={greenTag}>{s}</span>
                  ))}
                </div>

                <p style={skillTitle}>Missing Skills</p>
                <div style={tagContainer}>
                  {c.missing_skills.map((s, idx) => (
                    <span key={idx} style={redTag}>{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </section>
        )}
      </main>

      {activeChat !== null && (
        <div style={modalStyle}>
          <div style={chatBox}>
            <div style={chatHeader}>
              <h3 style={chatTitle}>AI Screening Questions</h3>
              <span style={chatPill}>Live</span>
            </div>

            <div style={chatMessages}>
              {chatHistory.map((msg, i) => (
                <div
                  key={i}
                  style={msg.sender === "ai" ? aiMessage : userMessage}
                >
                  <strong>{msg.sender === "ai" ? "AI" : "You"}</strong>
                  <p>{msg.text}</p>
                </div>
              ))}
            </div>

            <div style={chatActions}>
              {(chatStep === -1 ? ["Yes", "No"] : options[chatStep])?.map((opt, i) => (
                <button key={i} onClick={() => handleAnswer(opt)} style={chatBtn}>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const pageStyle = {
  fontFamily: "Inter, Arial, sans-serif",
  background: "linear-gradient(180deg, #f7f9fc 0%, #eef2f7 100%)",
  minHeight: "100vh",
  color: "#172033"
};

const headerStyle = {
  background: "linear-gradient(135deg, #071629 0%, #123a63 58%, #0f766e 100%)",
  color: "#fff",
  padding: "34px 48px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  boxShadow: "0 20px 50px rgba(7, 22, 41, 0.24)"
};

const eyebrow = {
  fontSize: "12px",
  textTransform: "uppercase",
  letterSpacing: "1.8px",
  color: "#9dd8d2",
  fontWeight: 700,
  marginBottom: "8px"
};

const title = {
  margin: 0,
  fontSize: "32px",
  fontWeight: 800
};

const headerBadge = {
  background: "rgba(255,255,255,0.12)",
  border: "1px solid rgba(255,255,255,0.22)",
  padding: "10px 16px",
  borderRadius: "999px",
  fontSize: "13px",
  fontWeight: 700
};

const mainStyle = {
  maxWidth: "1120px",
  margin: "34px auto",
  padding: "0 22px"
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  gap: "24px"
};

const cardStyle = {
  background: "rgba(255,255,255,0.92)",
  padding: "26px",
  borderRadius: "14px",
  boxShadow: "0 18px 45px rgba(23, 32, 51, 0.08)",
  border: "1px solid rgba(216, 226, 239, 0.9)"
};

const sectionHeader = {
  display: "flex",
  justifyContent: "space-between",
  gap: "18px",
  marginBottom: "22px"
};

const sectionTitle = {
  margin: 0,
  color: "#172033",
  fontSize: "21px",
  fontWeight: 800
};

const sectionText = {
  margin: "6px 0 0",
  color: "#64748b",
  fontSize: "14px",
  lineHeight: 1.5
};

const stepBadge = {
  width: "38px",
  height: "38px",
  borderRadius: "12px",
  background: "#ecfeff",
  color: "#0f766e",
  display: "grid",
  placeItems: "center",
  fontWeight: 800
};

const fieldLabel = {
  display: "block",
  fontSize: "13px",
  fontWeight: 700,
  color: "#334155",
  marginBottom: "8px",
  marginTop: "14px"
};

const fileInputStyle = {
  width: "100%",
  padding: "11px",
  borderRadius: "10px",
  border: "1px solid #d8e2ef",
  background: "#f8fafc",
  color: "#334155"
};

const textareaStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "14px",
  borderRadius: "12px",
  border: "1px solid #d8e2ef",
  outline: "none",
  fontSize: "14px",
  resize: "vertical",
  background: "#fbfdff",
  color: "#172033",
  lineHeight: 1.6
};

const resumeRow = {
  padding: "16px",
  border: "1px solid #e2e8f0",
  borderRadius: "12px",
  marginBottom: "14px",
  background: "#fbfdff"
};

const resumeActions = {
  display: "flex",
  gap: "10px",
  marginTop: "12px",
  flexWrap: "wrap"
};

const submitWrap = {
  textAlign: "center",
  margin: "30px 0 36px"
};

const primaryBtn = {
  background: "linear-gradient(135deg, #0f766e, #123a63)",
  color: "#fff",
  padding: "14px 32px",
  border: "none",
  borderRadius: "12px",
  fontSize: "15px",
  fontWeight: 800,
  cursor: "pointer",
  boxShadow: "0 14px 30px rgba(15, 118, 110, 0.28)"
};

const disabledBtn = {
  ...primaryBtn,
  opacity: 0.7,
  cursor: "not-allowed"
};

const secondaryBtn = {
  background: "#172033",
  color: "#fff",
  padding: "11px 18px",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: 800,
  marginTop: "8px"
};

const ghostBtn = {
  background: "#ecfeff",
  color: "#0f766e",
  border: "1px solid #b6ece8",
  padding: "9px 13px",
  borderRadius: "9px",
  cursor: "pointer",
  fontWeight: 800
};

const removeBtn = {
  background: "#fff1f2",
  color: "#be123c",
  border: "1px solid #fecdd3",
  padding: "9px 13px",
  borderRadius: "9px",
  cursor: "pointer",
  fontWeight: 800
};

const resultsSection = {
  marginTop: "20px"
};

const resultsHeader = {
  marginBottom: "18px"
};

const resultsTitle = {
  margin: 0,
  fontSize: "26px",
  color: "#172033"
};

const resultCard = {
  background: "#ffffff",
  padding: "22px",
  borderRadius: "14px",
  marginBottom: "18px",
  boxShadow: "0 16px 42px rgba(23, 32, 51, 0.08)",
  border: "1px solid #e2e8f0"
};

const candidateTop = {
  display: "flex",
  justifyContent: "space-between",
  gap: "18px",
  alignItems: "flex-start",
  marginBottom: "18px"
};

const rankBadge = {
  color: "#0f766e",
  fontWeight: 800,
  fontSize: "13px",
  marginBottom: "6px"
};

const candidateName = {
  margin: 0,
  fontSize: "22px",
  color: "#172033"
};

const finalScoreBox = {
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: "12px",
  padding: "12px 16px",
  textAlign: "right",
  minWidth: "130px"
};

const scoreLabel = {
  display: "block",
  fontSize: "12px",
  color: "#64748b",
  fontWeight: 700
};

const scoreValue = {
  fontSize: "24px",
  color: "#0f766e"
};

const scoreGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
  gap: "12px",
  marginBottom: "18px"
};

const scoreItem = {
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: "12px",
  padding: "13px"
};

const skillTitle = {
  margin: "14px 0 8px",
  fontWeight: 800,
  color: "#334155"
};

const tagContainer = {
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
  marginBottom: "10px"
};

const greenTag = {
  background: "#ecfdf5",
  color: "#047857",
  padding: "7px 11px",
  borderRadius: "999px",
  fontSize: "12px",
  fontWeight: 800,
  border: "1px solid #bbf7d0"
};

const redTag = {
  background: "#fff1f2",
  color: "#be123c",
  padding: "7px 11px",
  borderRadius: "999px",
  fontSize: "12px",
  fontWeight: 800,
  border: "1px solid #fecdd3"
};

const modalStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(15, 23, 42, 0.68)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backdropFilter: "blur(8px)",
  padding: "20px"
};

const chatBox = {
  background: "#ffffff",
  padding: "22px",
  width: "430px",
  maxWidth: "100%",
  maxHeight: "85vh",
  borderRadius: "16px",
  boxShadow: "0 30px 80px rgba(0,0,0,0.28)",
  display: "flex",
  flexDirection: "column"
};

const chatHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "16px"
};

const chatTitle = {
  margin: 0,
  fontSize: "20px",
  color: "#172033"
};

const chatPill = {
  background: "#ecfdf5",
  color: "#047857",
  padding: "5px 10px",
  borderRadius: "999px",
  fontSize: "12px",
  fontWeight: 800
};

const chatMessages = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  marginBottom: "18px",
  overflowY: "auto",
  maxHeight: "52vh",
  paddingRight: "6px"
};

const aiMessage = {
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: "12px",
  padding: "11px 13px",
  color: "#334155"
};

const userMessage = {
  background: "#ecfeff",
  border: "1px solid #b6ece8",
  borderRadius: "12px",
  padding: "11px 13px",
  color: "#0f766e"
};

const chatActions = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap"
};

const chatBtn = {
  flex: 1,
  minWidth: "110px",
  background: "#172033",
  color: "#fff",
  border: "none",
  borderRadius: "10px",
  padding: "11px 14px",
  cursor: "pointer",
  fontWeight: 800
};

export default App;
