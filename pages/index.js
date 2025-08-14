import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [loadingParse, setLoadingParse] = useState(false);
  const [loadingGenerate, setLoadingGenerate] = useState(false);
  const [error, setError] = useState("");
  const [theme, setTheme] = useState("blue");
  // Upload and parse PDF to get text
  async function handleParsePdf() {
    if (!file) {
      alert("Please select a PDF file first.");
      return;
    }
    setLoadingParse(true);
    setError("");
    setGeneratedCode("");
    setResumeText("");

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await fetch("/api/parseResume", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to parse PDF");
      }

      const data = await res.json();
      setResumeText(data.text);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingParse(false);
    }
  }

  // Send resume text to LLaMA 3 to generate portfolio code
  async function handleGeneratePortfolio() {
  if (!resumeText.trim()) {
    alert("Parse a resume first to get the text.");
    return;
  }
  setLoadingGenerate(true);
  setError("");
  setGeneratedCode("");

  try {
    const res = await fetch("/api/generatePortfolio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resumeText, theme }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to generate portfolio");
    }

    const data = await res.json();
    setGeneratedCode(data.html);

    // Open in new tab
    const blob = new Blob([data.html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  } catch (err) {
    setError(err.message);
  } finally {
    setLoadingGenerate(false);
  }
}


  return (
    <div style={{ padding: 20 }}>
      <h1>Portfolio Website Generator</h1>

      <input
        type="file"
        name="resume"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <br />
      <button
        onClick={handleParsePdf}
        disabled={loadingParse || !file}
        style={{ marginTop: 10 }}
      >
        {loadingParse ? "Parsing PDF..." : "Parse PDF Resume"}
      </button>
      
      {resumeText && (
        <>
          <h2 style={{ marginTop: 20 }}>Extracted Resume Text</h2>
          <textarea
            rows={10}
            cols={80}
            readOnly
            value={resumeText}
            style={{ fontFamily: "monospace" }}
          />
          <br />
          <h3 style={{ marginTop: 20 }}>Choose a Theme Color</h3>
<select
  value={theme}
  onChange={(e) => setTheme(e.target.value)}
  style={{ padding: "6px 10px", borderRadius: 4 }}
>
  <option value="blue">Blue</option>
  <option value="red">Red</option>
  <option value="green">Green</option>
  <option value="purple">Purple</option>
  <option value="pink">Pink</option>
  <option value="yellow">Yellow</option>
  <option value="gray">Gray</option>
  <option value="dark">Dark</option>
</select>
          <br></br>
          <button
            onClick={handleGeneratePortfolio}
            disabled={loadingGenerate}
            style={{ marginTop: 10 }}
          >
            {loadingGenerate ? "Generating Portfolio..." : "Generate Portfolio Code"}
          </button>
        </>
      )}
      

      {error && (
        <p style={{ color: "red", marginTop: 10 }}>
          <b>Error:</b> {error}
        </p>
      )}

      {generatedCode && (
  <>
    <h2 style={{ marginTop: 20 }}>Generated Portfolio Code</h2>
    <pre
      style={{
        backgroundColor: "#f0f0f0",
        padding: 10,
        whiteSpace: "pre-wrap",
        maxHeight: 400,
        overflow: "auto",
        borderRadius: 6,
      }}
    >
      {generatedCode}
    </pre>

    <a
      href={`/viewPortfolio?code=${encodeURIComponent(generatedCode)}`}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "inline-block",
        marginTop: 10,
        padding: "8px 14px",
        backgroundColor: "#0070f3",
        color: "white",
        borderRadius: 6,
        textDecoration: "none",
      }}
    >
      View Live Portfolio
    </a>
  </>
)}
      
    </div>
  );
}
