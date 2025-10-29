import React, { useState } from "react";
import "./index.css";

function App() {
  const [file, setFile] = useState(null);
  const [score, setScore] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) {
      alert("Please upload your resume first!");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://127.0.0.1:8000/analyze/", {

        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setScore(data.score);
      setFeedback(data.feedback);
    } catch (err) {
      console.error(err);
      alert("Error analyzing resume!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>AI Resume Analyzer</h1>
      <p>Get your ATS score and personalized feedback instantly!</p>

      <div className="upload-box">
        <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
        <button onClick={handleUpload} disabled={loading}>
          {loading ? "Analyzing..." : "Upload & Analyze"}
        </button>
      </div>

      {score !== null && (
        <div className="result-box">
          <h2>ATS Score: {score}/100</h2>
          <div className="progress-bar">
            <div className="progress" style={{ width: `${score}%` }}></div>
          </div>
          <p>{feedback}</p>
        </div>
      )}
    </div>
  );
}

export default App;
