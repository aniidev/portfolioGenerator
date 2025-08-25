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
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f1e 100%)',
      color: 'white',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    },
    backgroundOrbs: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      pointerEvents: 'none',
      zIndex: 0
    },
    orb1: {
      position: 'absolute',
      top: '80px',
      right: '80px',
      width: '384px',
      height: '384px',
      background: 'radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)',
      borderRadius: '50%',
      filter: 'blur(60px)',
      animation: 'floatPulse 8s ease-in-out infinite'
    },
    orb2: {
      position: 'absolute',
      bottom: '80px',
      left: '80px',
      width: '320px',
      height: '320px',
      background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
      borderRadius: '50%',
      filter: 'blur(60px)',
      animation: 'floatPulse 6s ease-in-out infinite 2s'
    },
    orb3: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '256px',
      height: '256px',
      background: 'radial-gradient(circle, rgba(236, 72, 153, 0.08) 0%, transparent 70%)',
      borderRadius: '50%',
      filter: 'blur(60px)',
      animation: 'floatPulse 10s ease-in-out infinite 1s'
    },
    orb4: {
      position: 'absolute',
      top: '20%',
      left: '10%',
      width: '200px',
      height: '200px',
      background: 'radial-gradient(circle, rgba(34, 197, 94, 0.08) 0%, transparent 70%)',
      borderRadius: '50%',
      filter: 'blur(40px)',
      animation: 'slowFloat 15s ease-in-out infinite 3s'
    },
    orb5: {
      position: 'absolute',
      bottom: '30%',
      right: '15%',
      width: '150px',
      height: '150px',
      background: 'radial-gradient(circle, rgba(251, 191, 36, 0.06) 0%, transparent 70%)',
      borderRadius: '50%',
      filter: 'blur(30px)',
      animation: 'slowFloat 12s ease-in-out infinite 5s'
    },
    gridPattern: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: `
        linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
      `,
      backgroundSize: '50px 50px',
      animation: 'gridMove 20s linear infinite'
    },
    particles: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    particle: {
      position: 'absolute',
      width: '2px',
      height: '2px',
      background: 'rgba(255, 255, 255, 0.3)',
      borderRadius: '50%',
    },
    header: {
      position: 'relative',
      zIndex: 10,
      padding: '16px 24px',
      borderBottom: '1px solid rgba(55, 65, 81, 0.3)',
      backdropFilter: 'blur(10px)'
    },
    headerContent: {
      maxWidth: '1280px',
      margin: '0 auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    logoIcon: {
      width: '32px',
      height: '32px',
      background: 'linear-gradient(135deg, #a855f7, #ec4899)',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '14px',
      fontWeight: 'bold'
    },
    logoText: {
      fontSize: '20px',
      fontWeight: '600'
    },
    nav: {
      display: 'flex',
      alignItems: 'center',
      gap: '32px',
      fontSize: '14px'
    },
    navLink: {
      color: '#d1d5db',
      textDecoration: 'none',
      transition: 'color 0.2s',
      cursor: 'pointer'
    },
    getStartedBtn: {
      background: 'linear-gradient(135deg, #9333ea, #ec4899)',
      padding: '8px 16px',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500',
      border: 'none',
      color: 'white',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    main: {
      position: 'relative',
      zIndex: 10,
      maxWidth: '1152px',
      margin: '0 auto',
      padding: '0 24px 48px'
    },
    hero: {
      textAlign: 'center',
      marginBottom: '64px',
      paddingTop: '48px'
    },
    heroTitle: {
      fontSize: '4rem',
      fontWeight: 'bold',
      marginBottom: '24px',
      background: 'linear-gradient(135deg, #ffffff, #e5d3ff, #fce7f3)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      lineHeight: '1.1',
      animation: 'titleGlow 3s ease-in-out infinite alternate'
    },
    heroSubtitle: {
      background: 'linear-gradient(135deg, #c084fc, #f472b6)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    },
    heroDescription: {
      fontSize: '20px',
      color: '#9ca3af',
      maxWidth: '512px',
      margin: '0 auto 32px',
      lineHeight: '1.6'
    },
    mainCard: {
      background: 'rgba(17, 24, 39, 0.4)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(55, 65, 81, 0.3)',
      borderRadius: '16px',
      padding: '32px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      animation: 'cardFloat 6s ease-in-out infinite'
    },
    stepHeader: {
      fontSize: '24px',
      fontWeight: '600',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center'
    },
    stepNumber: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '14px',
      fontWeight: 'bold',
      marginRight: '12px'
    },
    uploadArea: {
      border: '2px dashed #374151',
      borderRadius: '12px',
      padding: '32px',
      textAlign: 'center',
      transition: 'border-color 0.3s',
      cursor: 'pointer',
      marginBottom: '16px'
    },
    uploadIcon: {
      width: '64px',
      height: '64px',
      background: '#1f2937',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 16px'
    },
    primaryButton: {
      width: '100%',
      background: 'linear-gradient(135deg, #9333ea, #ec4899)',
      padding: '12px 24px',
      borderRadius: '12px',
      fontWeight: '500',
      border: 'none',
      color: 'white',
      cursor: 'pointer',
      fontSize: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      transition: 'all 0.2s',
      marginTop: '16px'
    },
    primaryButtonLarge: {
      padding: '16px 24px',
      fontSize: '18px',
      boxShadow: '0 10px 25px rgba(147, 51, 234, 0.3)'
    },
    disabledButton: {
      background: 'linear-gradient(135deg, #374151, #4b5563)',
      cursor: 'not-allowed'
    },
    textArea: {
      width: '100%',
      background: 'rgba(31, 41, 55, 0.5)',
      border: '1px solid rgba(55, 65, 81, 0.5)',
      borderRadius: '12px',
      padding: '16px',
      color: '#d1d5db',
      fontFamily: 'monospace',
      fontSize: '14px',
      resize: 'none',
      outline: 'none',
      minHeight: '200px'
    },
    themeGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
      gap: '12px',
      marginBottom: '24px'
    },
    themeButton: {
      padding: '12px',
      borderRadius: '12px',
      border: '2px solid transparent',
      background: 'transparent',
      cursor: 'pointer',
      transition: 'all 0.2s',
      textAlign: 'center'
    },
    themeButtonSelected: {
      border: '2px solid white',
      transform: 'scale(1.05)',
      boxShadow: '0 4px 15px rgba(255, 255, 255, 0.2)'
    },
    themeColor: {
      width: '32px',
      height: '32px',
      borderRadius: '8px',
      margin: '0 auto 8px'
    },
    errorBox: {
      background: 'rgba(185, 28, 28, 0.1)',
      border: '1px solid rgba(239, 68, 68, 0.3)',
      borderRadius: '12px',
      padding: '16px',
      marginBottom: '32px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    codeContainer: {
      background: 'rgba(31, 41, 55, 0.5)',
      borderRadius: '12px',
      border: '1px solid rgba(55, 65, 81, 0.5)',
      overflow: 'hidden',
      marginBottom: '24px'
    },
    codeHeader: {
      background: 'rgba(31, 41, 55, 0.8)',
      padding: '12px 16px',
      borderBottom: '1px solid rgba(55, 65, 81, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    copyButton: {
      background: '#374151',
      border: 'none',
      color: '#d1d5db',
      padding: '4px 12px',
      borderRadius: '6px',
      fontSize: '12px',
      cursor: 'pointer',
      transition: 'background-color 0.2s'
    },
    codeContent: {
      padding: '16px',
      fontSize: '14px',
      color: '#d1d5db',
      fontFamily: 'monospace',
      overflow: 'auto',
      maxHeight: '256px',
      whiteSpace: 'pre-wrap'
    },
    buttonGroup: {
      display: 'flex',
      gap: '16px'
    },
    secondaryButton: {
      background: '#374151',
      padding: '12px 24px',
      borderRadius: '12px',
      fontWeight: '500',
      border: 'none',
      color: 'white',
      cursor: 'pointer',
      fontSize: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      transition: 'all 0.2s',
      flex: '1'
    },
    featuresGrid: {
      marginTop: '80px',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '32px'
    },
    featureCard: {
      background: 'rgba(17, 24, 39, 0.3)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(55, 65, 81, 0.3)',
      borderRadius: '12px',
      padding: '24px',
      animation: 'featureFloat 4s ease-in-out infinite',
      animationDelay: 'calc(var(--delay, 0) * 0.5s)'
    },
    featureIcon: {
      width: '48px',
      height: '48px',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '16px'
    },
    featureTitle: {
      fontSize: '20px',
      fontWeight: '600',
      marginBottom: '8px'
    },
    featureDescription: {
      color: '#9ca3af'
    },
    spinner: {
      width: '20px',
      height: '20px',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      borderTop: '2px solid white',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    },
    sectionMargin: {
      marginBottom: '32px'
    }
  };

  const themes = [
    { value: "blue", color: "#3b82f6", name: "Ocean" },
    { value: "red", color: "#ef4444", name: "Crimson" },
    { value: "green", color: "#10b981", name: "Forest" },
    { value: "purple", color: "#a855f7", name: "Galaxy" },
    { value: "pink", color: "#ec4899", name: "Sunset" },
    { value: "yellow", color: "#f59e0b", name: "Solar" },
    { value: "gray", color: "#6b7280", name: "Minimal" },
    { value: "dark", color: "#1f2937", name: "Night" }
  ];

  return (
    <>
    {/* GitHub Authentication Section */}
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

    <div style={styles.container}>
      {/* Keep your background + header code the same */}

      {/* Main Content */}
      <main style={styles.main}>
        <div style={styles.hero}>
          <h1 style={styles.heroTitle}>
            AI <br />
            <span style={styles.heroSubtitle}>Portfolio Generation</span>
          </h1>
          <p style={styles.heroDescription}>
            Upload your resume and instantly get a professional portfolio website. 
            No coding required.
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
                borderColor: file ? "#9333ea" : "#374151",
              }}
              onClick={() => document.getElementById("file-upload").click()}
            >
              <input
                type="file"
                accept="application/pdf"
                id="file-upload"
                style={{ display: "none" }}
                onChange={(e) => setFile(e.target.files[0])}
              />
              <p style={{ fontSize: "18px", color: "white" }}>
                {file ? file.name : "Choose PDF file"}
              </p>
            </div>
          </div>

          {/* Step 2: Theme Selection (optional — remove if you want auto theme) */}
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
            <div style={{ marginBottom: "20px" }}>
              <label style={{ color: "white", display: "block", marginBottom: "8px" }}>
                Custom Features (optional):
              </label>
              <textarea
                rows={4}
                value={customFeatures}
                onChange={(e) => setCustomFeatures(e.target.value)}
                placeholder="e.g. Add a contact form, dark mode toggle, project gallery..."
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "6px",
                  border: "1px solid #374151",
                  resize: "vertical",
                }}
              />
            </div>
          )}
          
          {/* Step 3: Generate Portfolio */}
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
              >
                {loadingGenerate ? "Generating Portfolio..." : "Generate Portfolio"}
              </button>
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={styles.errorBox}>
              <span style={{ color: "#fca5a5" }}>Error: {error}</span>
            </div>
          )}
        </div>
        
        {/* Enhanced Deploy to GitHub Button */}
        {generatedCode && (
          <div style={{ marginTop: "20px" }}>
            <button
              onClick={handleDeployToGitHub}
              style={{
                ...styles.primaryButton,
                background: 'linear-gradient(135deg, #24292f 0%, #32383f 100%)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '16px',
                fontWeight: '600',
                padding: '14px 24px',
                border: '1px solid #444c56',
                boxShadow: '0 4px 14px 0 rgba(36, 41, 47, 0.3)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px 0 rgba(36, 41, 47, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 14px 0 rgba(36, 41, 47, 0.3)';
              }}
            >
              {/* GitHub Logo for Deploy Button */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              Deploy to GitHub
              {/* Rocket emoji as additional visual element */}
              <span style={{ fontSize: '18px' }}>🚀</span>
            </button>
          </div>
        )}
      </main>
    </div>
    </>
  );
}