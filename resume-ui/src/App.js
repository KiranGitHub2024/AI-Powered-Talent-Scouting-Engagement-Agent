import React, { useState } from "react";

function App() {
  const [jdFile, setJdFile] = useState(null);
  const [jdText, setJdText] = useState("");

  // 🔥 keep structure but add answers storage
  const [resumeInputs, setResumeInputs] = useState([
    { file: null, answers: {} }
  ]);

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔥 CHAT STATES
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

  // 🔥 START CHAT (NO BLOCKING, NO UI CHANGE)
  const startChat = (index) => {
    // use backend name if available else fallback
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

  // 🔥 HANDLE ANSWERS
  const handleAnswer = (answer) => {
    let history = [...chatHistory, { sender: "user", text: answer }];

    // first question (ready?)
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

    // store answer per candidate
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

  // 🔥 INTEREST SCORE
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

      // inject interest score (WITHOUT breaking UI)
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
    <div style={{ fontFamily: "Arial, sans-serif", background: "#f3f2ef", minHeight: "100vh" }}>

      {/* HEADER */}
        <div style={{
          background: "linear-gradient(90deg, #0a66c2, #004182)",
          color: "#fff",
          padding: "18px 30px",
          borderBottom: "1px solid #ddd",
          fontSize: "22px",
          fontWeight: "600",
          letterSpacing: "0.5px"
        }}>
          🚀 AI Talent Scouting System
        </div>
      <div style={{ maxWidth: "900px", margin: "30px auto" }}>

        {/* JD */}
        <div style={cardStyle}>
          <h2 style={sectionTitle}>📄 Job Description</h2>
          <input type="file" onChange={(e) => setJdFile(e.target.files[0])} />
          <textarea rows="5" style={textareaStyle} value={jdText} onChange={(e) => setJdText(e.target.value)} />
        </div>

        {/* RESUMES */}
        <div style={cardStyle}>
          <h2 style={sectionTitle}>📂 Resumes</h2>

          {resumeInputs.map((r, index) => (
            <div key={index} style={{ marginBottom: "10px" }}>
              <input type="file" onChange={(e) => handleResumeChange(index, e.target.files[0])} />

              {r.file && (
                <button onClick={() => startChat(index)} style={{ marginLeft: "10px" }}>
                  💬 Answer AI Questions
                </button>
              )}

              {resumeInputs.length > 1 && (
                <button onClick={() => removeResumeInput(index)} style={removeBtn}>
                  Remove
                </button>
              )}
            </div>
          ))}

          <button style={secondaryBtn} onClick={addResumeInput}>
            ➕ Add Another Resume
          </button>
        </div>

        {/* BUTTON */}
        <div style={{ textAlign: "center" }}>
          <button style={primaryBtn} onClick={handleSubmit} disabled={loading}>
            {loading ? "Processing..." : "🚀 Upload & Rank"}
          </button>
        </div>

        {/* RESULTS (UNCHANGED STRUCTURE) */}
        {results && (
          <div style={{ marginTop: "30px" }}>
            <h2 style={{ marginBottom: "15px" }}>🏆 Ranked Candidates</h2>

            {results.map((c, i) => (
              <div key={i} style={resultCard}>
                <h3>{i + 1}. {c.name}</h3>

                <p><b>Match Score:</b> {c.match_score}%</p>
                <p><b>Interest Score:</b> {c.interest_score}%</p>
                <p><b>Final Score:</b> {c.final_score}%</p>

                <p><b>Decision:</b> {c.decision}</p>

                <p><b>Matched Skills:</b></p>
                <div style={tagContainer}>
                  {c.matched_skills.map((s, idx) => (
                    <span key={idx} style={greenTag}>{s}</span>
                  ))}
                </div>

                <p><b>Missing Skills:</b></p>
                <div style={tagContainer}>
                  {c.missing_skills.map((s, idx) => (
                    <span key={idx} style={redTag}>{s}</span>
                  ))}
                </div>

                </div>
            ))}
          </div>
        )}

      </div>

      {/* CHAT MODAL */}
      {activeChat !== null && (
        <div style={modalStyle}>
          <div style={chatBox}>
            {chatHistory.map((msg, i) => (
              <p key={i}><b>{msg.sender === "ai" ? "AI" : "You"}:</b> {msg.text}</p>
            ))}

            {(chatStep === -1 ? ["Yes","No"] : options[chatStep])?.map((opt, i) => (
              <button key={i} onClick={() => handleAnswer(opt)}>
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

// STYLES (UNCHANGED)
const cardStyle = {
  background: "rgba(255,255,255,0.9)",
  backdropFilter: "blur(10px)",
  padding: "24px",
  borderRadius: "16px",
  boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
  marginBottom: "24px",
  border: "1px solid rgba(255,255,255,0.3)"
};

const sectionTitle = {
  marginBottom: "18px",
  color: "#0a66c2",
  fontSize: "20px",
  fontWeight: "600"
};

const textareaStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #dcdcdc",
  outline: "none",
  fontSize: "14px"
};

const primaryBtn = {
  background: "linear-gradient(135deg, #0a66c2, #004182)",
  color: "#fff",
  padding: "12px 30px",
  border: "none",
  borderRadius: "30px",
  fontSize: "15px",
  fontWeight: "600",
  cursor: "pointer",
  boxShadow: "0 6px 15px rgba(10,102,194,0.3)",
  transition: "all 0.2s ease"
};

const secondaryBtn = {
  background: "#eef3f8",
  color: "#0a66c2",
  padding: "8px 18px",
  border: "none",
  borderRadius: "25px",
  cursor: "pointer",
  fontWeight: "500",
  marginTop: "10px"
};

const removeBtn = {
  marginLeft: "10px",
  background: "#ff4d4f",
  color: "#fff",
  border: "none",
  padding: "6px 12px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "500"
};

const resultCard = {
  background: "#ffffff",
  padding: "18px",
  borderRadius: "14px",
  marginBottom: "16px",
  boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
  borderLeft: "6px solid #0a66c2",
  transition: "transform 0.2s ease"
};

const tagContainer = {
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
  marginBottom: "10px"
};

const greenTag = {
  background: "linear-gradient(135deg, #d4f4dd, #b7ebc6)",
  color: "#1b5e20",
  padding: "6px 12px",
  borderRadius: "20px",
  fontSize: "12px",
  fontWeight: "600"
};

const redTag = {
  background: "linear-gradient(135deg, #fdecea, #f8c7c7)",
  color: "#b71c1c",
  padding: "6px 12px",
  borderRadius: "20px",
  fontSize: "12px",
  fontWeight: "600"
};

const conversationBox = {
  background: "#f4f6f8",
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #e0e0e0"
};

const modalStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backdropFilter: "blur(4px)"
};

const chatBox = {
  background: "#ffffff",
  padding: "22px",
  width: "400px",
  borderRadius: "16px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
};

export default App;
