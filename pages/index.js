import { useState } from "react";
import { signIn, useSession, signOut} from "next-auth/react";

export default function Home() {
  const [file, setFile] = useState(null);
  const [generatedCode, setGeneratedCode] = useState("");
  const [loadingGenerate, setLoadingGenerate] = useState(false);
  const [error, setError] = useState("");
  const [theme, setTheme] = useState("blue"); // default theme
  const [customFeatures, setCustomFeatures] = useState("");
  const { data: session } = useSession();

  async function handleGeneratePortfolio() {
    if (!file) {
      alert("Please select a PDF file first.");
      return;
    }

    setLoadingGenerate(true);
    setError("");
    setGeneratedCode("");

    try {
      // Step 1: Parse the PDF (hidden from user)
      const formData = new FormData();
      formData.append("resume", file);

      const parseRes = await fetch("/api/parseResume", {
        method: "POST",
        body: formData,
      });

      if (!parseRes.ok) {
        const err = await parseRes.json();
        throw new Error(err.error || "Failed to parse PDF");
      }

      const parseData = await parseRes.json();
      const resumeText = parseData.text;

      // Step 2: Generate Portfolio
      const genRes = await fetch("/api/generatePortfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, theme, customFeatures })
      });

      if (!genRes.ok) {
        const err = await genRes.json();
        throw new Error(err.error || "Failed to generate portfolio");
      }

      const data = await genRes.json();
      setGeneratedCode(data.html);

      // Open directly in new tab
      const blob = new Blob([data.html], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingGenerate(false);
    }
  }

    async function handleDeployToGitHub() {
    if (!session) {
      alert("Please log in with GitHub first!");
      signIn("github");
      return;
    }

    try {
      const res = await fetch("/api/deployToGitHub", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html: generatedCode }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      alert(`✅ Portfolio live: ${data.url}`);
      window.open(data.url, "_blank");
    } catch (err) {
      alert("❌ Deployment failed: " + err.message);
    }
  }

  const styles = {
  container: {
    minHeight: '100vh',
    background: 'radial-gradient(ellipse at top, #1a0b3d 0%, #0a0118 50%, #000000 100%)',
    color: 'white',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    position: 'relative',
    overflow: 'hidden'
  },
  
  // Enhanced glowing orb background effect
  backgroundOrb: {
    position: 'absolute',
    top: '20%',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '600px',
    height: '300px',
    background: 'radial-gradient(ellipse, rgba(147, 51, 234, 0.4) 0%, rgba(147, 51, 234, 0.2) 30%, rgba(236, 72, 153, 0.15) 50%, rgba(245, 158, 11, 0.1) 70%, transparent 100%)',
    borderRadius: '50%',
    filter: 'blur(60px)',
    zIndex: 1,
    pointerEvents: 'none',
    animation: 'pulse 4s ease-in-out infinite'
  },
  
  // Secondary orb for more depth
  backgroundOrb2: {
    position: 'absolute',
    top: '40%',
    left: '30%',
    width: '400px',
    height: '200px',
    background: 'radial-gradient(ellipse, rgba(236, 72, 153, 0.3) 0%, rgba(147, 51, 234, 0.1) 50%, transparent 80%)',
    borderRadius: '50%',
    filter: 'blur(80px)',
    zIndex: 1,
    pointerEvents: 'none',
    animation: 'pulse 6s ease-in-out infinite reverse'
  },
  
  // Third orb for even more depth
  backgroundOrb3: {
    position: 'absolute',
    top: '60%',
    right: '20%',
    width: '300px',
    height: '150px',
    background: 'radial-gradient(ellipse, rgba(245, 158, 11, 0.2) 0%, rgba(147, 51, 234, 0.1) 60%, transparent 90%)',
    borderRadius: '50%',
    filter: 'blur(40px)',
    zIndex: 1,
    pointerEvents: 'none',
    animation: 'float 8s ease-in-out infinite'
  },
  
  main: {
    position: 'relative',
    zIndex: 2,
    padding: '80px 20px 40px',
    maxWidth: '800px',
    margin: '0 auto'
  },
  
  hero: {
    textAlign: 'center',
    marginBottom: '60px'
  },
  
  heroTitle: {
    fontSize: 'clamp(3rem, 8vw, 5rem)',
    fontWeight: '600',
    margin: '0 0 20px 0',
    background: 'linear-gradient(135deg, #ffffff 0%, #e5e7eb 50%, #9ca3af 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    lineHeight: '1.1'
  },
  
  heroSubtitle: {
    background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #f59e0b 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  
  heroDescription: {
    fontSize: '18px',
    color: '#9ca3af',
    fontWeight: '400',
    lineHeight: '1.6',
    maxWidth: '500px',
    margin: '0 auto'
  },
  
  mainCard: {
    background: 'rgba(17, 24, 39, 0.6)',
    backdropFilter: 'blur(20px)',
    borderRadius: '16px',
    padding: '40px',
    border: '1px solid rgba(75, 85, 99, 0.3)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
    position: 'relative'
  },
  
  sectionMargin: {
    marginBottom: '30px'
  },
  
  stepHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '20px',
    fontWeight: '600',
    color: 'white',
    marginBottom: '20px'
  },
  
  stepNumber: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: '700',
    color: 'white'
  },
  
  uploadArea: {
    border: '2px dashed #374151',
    borderRadius: '12px',
    padding: '40px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    background: 'rgba(31, 41, 55, 0.5)',
    ':hover': {
      borderColor: '#9333ea',
      background: 'rgba(147, 51, 234, 0.1)'
    }
  },
  
  themeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
    gap: '12px'
  },
  
  themeButton: {
    background: 'rgba(31, 41, 55, 0.8)',
    border: '1px solid rgba(75, 85, 99, 0.3)',
    borderRadius: '8px',
    padding: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)'
    }
  },
  
  themeButtonSelected: {
    border: '1px solid #9333ea',
    background: 'rgba(147, 51, 234, 0.2)',
    boxShadow: '0 0 20px rgba(147, 51, 234, 0.3)'
  },
  
  themeColor: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
  },
  
  primaryButton: {
    background: 'linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 14px rgba(147, 51, 234, 0.3)',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(147, 51, 234, 0.4)'
    }
  },
  
  primaryButtonLarge: {
    padding: '16px 32px',
    fontSize: '16px',
    width: '100%'
  },
  
  disabledButton: {
    opacity: 0.6,
    cursor: 'not-allowed',
    transform: 'none',
    ':hover': {
      transform: 'none'
    }
  },
  
  errorBox: {
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '8px',
    padding: '12px 16px',
    marginTop: '16px'
  },
  
  // Input and textarea styles
  inputLabel: {
    color: 'white',
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: '500'
  },
  
  textArea: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid rgba(75, 85, 99, 0.3)',
    background: 'rgba(31, 41, 55, 0.6)',
    backdropFilter: 'blur(10px)',
    color: 'white',
    fontSize: '14px',
    fontFamily: 'inherit',
    resize: 'vertical',
    transition: 'all 0.3s ease',
    outline: 'none',
    '::placeholder': {
      color: '#6b7280'
    },
    ':focus': {
      borderColor: '#9333ea',
      boxShadow: '0 0 0 3px rgba(147, 51, 234, 0.1)'
    }
  },
  
  deployButton: {
    background: 'linear-gradient(135deg, #24292f 0%, #32383f 100%)',
    color: 'white',
    border: '1px solid #444c56',
    borderRadius: '10px',
    padding: '14px 24px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 14px 0 rgba(36, 41, 47, 0.3)',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginTop: '20px'
  }
};

// Updated themes with more vibrant colors matching Reflect's aesthetic
const themes = [
  { value: "purple", color: "#a855f7", name: "Reflect" },
  { value: "blue", color: "#3b82f6", name: "Ocean" },
  { value: "pink", color: "#ec4899", name: "Sunset" },
  { value: "green", color: "#10b981", name: "Forest" },
  { value: "red", color: "#ef4444", name: "Crimson" },
  { value: "yellow", color: "#f59e0b", name: "Solar" },
  { value: "gray", color: "#6b7280", name: "Minimal" },
  { value: "dark", color: "#1f2937", name: "Night" }
];

// Updated JSX structure to include the glowing background effect
return (
  <>
    {/* GitHub Authentication Section */}
    <style jsx global>{`
      body {
        margin: 0;
        padding: 0;
        background: #000000; /* fallback background */
      }
      
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      @keyframes pulse {
        0%, 100% { 
          opacity: 0.4;
          transform: scale(1);
        }
        50% { 
          opacity: 0.8;
          transform: scale(1.1);
        }
      }
      
      @keyframes float {
        0%, 100% { 
          transform: translateY(0px);
          opacity: 0.3;
        }
        50% { 
          transform: translateY(-20px);
          opacity: 0.6;
        }
      }
    `}</style>
    
    <div style={styles.container}>
      {/* Enhanced glowing background orbs */}
      <div style={styles.backgroundOrb}></div>
      <div style={styles.backgroundOrb2}></div>
      <div style={styles.backgroundOrb3}></div>
      
      <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 1000,
      background: 'rgba(17, 24, 39, 0.9)',
      backdropFilter: 'blur(10px)',
      borderRadius: '12px',
      padding: '12px',
      border: '1px solid rgba(75, 85, 99, 0.3)',
    }}>
      {!session ? (
        <button 
          onClick={() => signIn("github")}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#24292f',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 16px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            ':hover': {
              background: '#32383f'
            }
          }}
          onMouseEnter={(e) => {
            e.target.style.background = '#32383f';
            e.target.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = '#24292f';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          {/* GitHub Logo SVG */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          Sign in with GitHub
        </button>
      ) : (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#e5e7eb',
            fontSize: '14px'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            <span>{session.user.name}</span>
          </div>
          <button 
            onClick={() => signOut()}
            style={{
              background: 'transparent',
              color: '#9ca3af',
              border: '1px solid #374151',
              borderRadius: '6px',
              padding: '6px 12px',
              fontSize: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.color = '#e5e7eb';
              e.target.style.borderColor = '#6b7280';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = '#9ca3af';
              e.target.style.borderColor = '#374151';
            }}
          >
            Sign out
          </button>
        </div>
      )}
    </div>

      {/* Main Content */}
      <main style={styles.main}>
        <div style={styles.hero}>
          <h1 style={styles.heroTitle}>
            AI <br />
            <span style={styles.heroSubtitle}>Portfolio</span>
          </h1>
          <p style={styles.heroDescription}>
            Upload your resume <br />
            Get your website <br />
            Deploy with GitHub
          </p>
        </div>

        <div style={styles.mainCard}>
          {/* Step 1: File Upload */}
          <div style={styles.sectionMargin}>
            <h2 style={styles.stepHeader}>
              <span style={{ ...styles.stepNumber, background: "#9333ea" }}>1</span>
              Upload Your Resume
            </h2>

            <div
              style={{
                ...styles.uploadArea,
                borderColor: file ? "#9333ea" : "rgba(75, 85, 99, 0.3)",
                background: file ? 'rgba(147, 51, 234, 0.1)' : 'rgba(31, 41, 55, 0.5)',
                boxShadow: file ? '0 0 20px rgba(147, 51, 234, 0.2)' : 'none'
              }}
              onClick={() => document.getElementById("file-upload").click()}
              onMouseEnter={(e) => {
                if (!file) {
                  e.target.style.borderColor = '#9333ea';
                  e.target.style.background = 'rgba(147, 51, 234, 0.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (!file) {
                  e.target.style.borderColor = 'rgba(75, 85, 99, 0.3)';
                  e.target.style.background = 'rgba(31, 41, 55, 0.5)';
                }
              }}
            >
              <input
                type="file"
                accept="application/pdf"
                id="file-upload"
                style={{ display: "none" }}
                onChange={(e) => setFile(e.target.files[0])}
              />
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px'
              }}>
                {/* Upload Icon */}
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'rgba(147, 51, 234, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="#9333ea">
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                  </svg>
                </div>
                <p style={{ 
                  fontSize: "18px", 
                  color: "white", 
                  margin: 0,
                  fontWeight: '500'
                }}>
                  {file ? file.name : "Choose PDF file"}
                </p>
                {!file && (
                  <p style={{ 
                    fontSize: "14px", 
                    color: "#6b7280", 
                    margin: 0 
                  }}>
                    Click to browse or drag and drop
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Step 2: Theme Selection */}
          {file && (
            <div style={styles.sectionMargin}>
              <h2 style={styles.stepHeader}>
                <span style={{ ...styles.stepNumber, background: "#3b82f6" }}>2</span>
                Choose Portfolio Theme
              </h2>
              <div style={styles.themeGrid}>
                {themes.map((themeOption) => (
                  <button
                    key={themeOption.value}
                    onClick={() => setTheme(themeOption.value)}
                    style={{
                      ...styles.themeButton,
                      ...(theme === themeOption.value
                        ? styles.themeButtonSelected
                        : {}),
                    }}
                    onMouseEnter={(e) => {
                      if (theme !== themeOption.value) {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.3)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (theme !== themeOption.value) {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                      }
                    }}
                  >
                    <div
                      style={{
                        ...styles.themeColor,
                        backgroundColor: themeOption.color,
                      }}
                    />
                    <p style={{ fontSize: "12px", color: "#9ca3af", margin: 0 }}>
                      {themeOption.name}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Custom Features Input */}
          {file && (
            <div style={styles.sectionMargin}>
              <h2 style={styles.stepHeader}>
                <span style={{ ...styles.stepNumber, background: "#10b981" }}>3</span>
                Custom Features
              </h2>
              <label style={styles.inputLabel}>
                Additional features for your portfolio (optional):
              </label>
              <textarea
                rows={4}
                value={customFeatures}
                onChange={(e) => setCustomFeatures(e.target.value)}
                placeholder="e.g., Dark mode toggle, project gallery, contact form, blog section..."
                style={styles.textArea}
                onFocus={(e) => {
                  e.target.style.borderColor = '#9333ea';
                  e.target.style.boxShadow = '0 0 0 3px rgba(147, 51, 234, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(75, 85, 99, 0.3)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          )}
          
          {/* Step 4: Generate Portfolio */}
          {file && (
            <div style={styles.sectionMargin}>
              <button
                onClick={handleGeneratePortfolio}
                disabled={loadingGenerate}
                style={{
                  ...styles.primaryButton,
                  ...styles.primaryButtonLarge,
                  ...(loadingGenerate ? styles.disabledButton : {}),
                }}
                onMouseEnter={(e) => {
                  if (!loadingGenerate) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 25px rgba(147, 51, 234, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loadingGenerate) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 14px rgba(147, 51, 234, 0.3)';
                  }
                }}
              >
                {loadingGenerate ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    Generating Portfolio...
                  </div>
                ) : (
                  "Generate Portfolio"
                )}
              </button>
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={styles.errorBox}>
              <span style={{ color: "#fca5a5" }}>⚠️ Error: {error}</span>
            </div>
          )}

          {generatedCode && (
  <div style={{ 
    marginTop: "20px", 
    display: "flex", 
    justifyContent: "center" 
  }}>
    <button
      onClick={handleDeployToGitHub}
      style={styles.deployButton}
      onMouseEnter={(e) => {
        e.target.style.transform = 'translateY(-2px)';
        e.target.style.boxShadow = '0 6px 20px 0 rgba(36, 41, 47, 0.4)';
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'translateY(0)';
        e.target.style.boxShadow = '0 4px 14px 0 rgba(36, 41, 47, 0.3)';
      }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
      Deploy to GitHub
    </button>
  </div>
)}
        </div>
        
        
      </main>
    </div>
  </>
);
}