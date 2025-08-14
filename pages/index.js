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
      <style jsx>{`
        @keyframes floatPulse {
          0%, 100% { 
            opacity: 0.5; 
            transform: translateY(0px) scale(1); 
          }
          33% { 
            opacity: 0.8; 
            transform: translateY(-20px) scale(1.1); 
          }
          66% { 
            opacity: 0.6; 
            transform: translateY(10px) scale(0.9); 
          }
        }
        
        @keyframes slowFloat {
          0%, 100% { 
            transform: translateY(0px) translateX(0px) scale(1); 
            opacity: 0.4;
          }
          25% { 
            transform: translateY(-15px) translateX(10px) scale(1.05); 
            opacity: 0.6;
          }
          50% { 
            transform: translateY(-30px) translateX(-5px) scale(0.95); 
            opacity: 0.5;
          }
          75% { 
            transform: translateY(-10px) translateX(-15px) scale(1.1); 
            opacity: 0.7;
          }
        }
        
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
        
        @keyframes titleGlow {
          0% { 
            filter: brightness(1) drop-shadow(0 0 5px rgba(168, 85, 247, 0.3));
          }
          100% { 
            filter: brightness(1.2) drop-shadow(0 0 20px rgba(168, 85, 247, 0.6));
          }
        }
        
        @keyframes cardFloat {
          0%, 100% { 
            transform: translateY(0px); 
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          }
          50% { 
            transform: translateY(-5px); 
            box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.35);
          }
        }
        
        @keyframes featureFloat {
          0%, 100% { 
            transform: translateY(0px); 
          }
          50% { 
            transform: translateY(-8px); 
          }
        }
        
        @keyframes particleFloat {
          0% { 
            transform: translateY(100vh) translateX(0px); 
            opacity: 0;
          }
          10% { 
            opacity: 1;
          }
          90% { 
            opacity: 1;
          }
          100% { 
            transform: translateY(-100px) translateX(50px); 
            opacity: 0;
          }
        }
        
        @keyframes buttonPulse {
          0%, 100% { 
            box-shadow: 0 0 0 0 rgba(147, 51, 234, 0.4);
          }
          50% { 
            box-shadow: 0 0 0 10px rgba(147, 51, 234, 0);
          }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animated-button {
          position: relative;
          overflow: hidden;
        }
        
        .animated-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          transition: left 0.5s;
        }
        
        .animated-button:hover::before {
          left: 100%;
        }
        
        .theme-button {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .theme-button:hover {
          transform: translateY(-4px) scale(1.05);
        }
        
        input[type="file"] {
          display: none;
        }
        *::-webkit-scrollbar {
          width: 6px;
        }
        *::-webkit-scrollbar-track {
          background: #1f2937;
        }
        *::-webkit-scrollbar-thumb {
          background: #4b5563;
          border-radius: 3px;
        }
      `}</style>
      
      <div style={styles.container}>
        {/* Background Elements */}
        <div style={styles.backgroundOrbs}>
          {/* Animated Grid Pattern */}
          <div style={styles.gridPattern}></div>
          
          {/* Floating Particles */}
          <div style={styles.particles}>
            {Array.from({length: 15}).map((_, i) => (
              <div
                key={i}
                style={{
                  ...styles.particle,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 20}s`,
                  animation: `particleFloat ${15 + Math.random() * 10}s linear infinite`
                }}
              />
            ))}
          </div>
          
          {/* Glowing Orbs */}
          <div style={styles.orb1}></div>
          <div style={styles.orb2}></div>
          <div style={styles.orb3}></div>
          <div style={styles.orb4}></div>
          <div style={styles.orb5}></div>
        </div>

        {/* Header */}
        <header style={styles.header}>
          <div style={styles.headerContent}>
            <div style={styles.logo}>
              <div style={styles.logoIcon}>PG</div>
              <span style={styles.logoText}>Portfolio Generator</span>
            </div>
            <nav style={styles.nav}>
              <a href="#" style={styles.navLink} 
                 onMouseEnter={(e) => e.target.style.color = 'white'}
                 onMouseLeave={(e) => e.target.style.color = '#d1d5db'}>
                Home
              </a>
              <a href="#" style={styles.navLink}
                 onMouseEnter={(e) => e.target.style.color = 'white'}
                 onMouseLeave={(e) => e.target.style.color = '#d1d5db'}>
                About
              </a>
              <a href="#" style={styles.navLink}
                 onMouseEnter={(e) => e.target.style.color = 'white'}
                 onMouseLeave={(e) => e.target.style.color = '#d1d5db'}>
                Pricing
              </a>
              <a href="#" style={styles.navLink}
                 onMouseEnter={(e) => e.target.style.color = 'white'}
                 onMouseLeave={(e) => e.target.style.color = '#d1d5db'}>
                Contact
              </a>
            </nav>
            <button style={styles.getStartedBtn}
                    onMouseEnter={(e) => e.target.style.background = 'linear-gradient(135deg, #7c3aed, #db2777)'}
                    onMouseLeave={(e) => e.target.style.background = 'linear-gradient(135deg, #9333ea, #ec4899)'}>
              Get Started
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main style={styles.main}>
          {/* Hero Section */}
          <div style={styles.hero}>
            <h1 style={styles.heroTitle}>
              AI
              <br />
              <span style={styles.heroSubtitle}>Portfolio Generation</span>
              <br />

            </h1>
            <p style={styles.heroDescription}>
              Transform your resume into a stunning, professional portfolio website using advanced AI technology. 
              No coding required.
            </p>
          </div>

          {/* Main Card */}
          <div style={styles.mainCard}>
            
            {/* Step 1: File Upload */}
            <div style={styles.sectionMargin}>
              <h2 style={styles.stepHeader}>
                <span style={{...styles.stepNumber, background: '#9333ea'}}>1</span>
                Upload Your Resume
              </h2>
              
              <div style={{
                ...styles.uploadArea,
                borderColor: file ? '#9333ea' : '#374151'
              }}
                   onClick={() => document.getElementById('file-upload').click()}
                   onMouseEnter={(e) => e.target.style.borderColor = '#6b21a8'}
                   onMouseLeave={(e) => e.target.style.borderColor = file ? '#9333ea' : '#374151'}>
                
                <input
                  type="file"
                  name="resume"
                  accept="application/pdf"
                  onChange={(e) => setFile(e.target.files[0])}
                  id="file-upload"
                />
                
                <div style={styles.uploadIcon}>
                  <svg width="32" height="32" fill="none" stroke="#9ca3af" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <p style={{ fontSize: '18px', fontWeight: '500', marginBottom: '8px', color: 'white' }}>
                  {file ? file.name : "Choose PDF file or drag and drop"}
                </p>
                <p style={{ color: '#9ca3af', fontSize: '14px' }}>PDF files only, up to 10MB</p>
              </div>

              <button
                onClick={handleParsePdf}
                disabled={loadingParse || !file}
                style={{
                  ...styles.primaryButton,
                  ...(loadingParse || !file ? styles.disabledButton : {})
                }}
                onMouseEnter={(e) => {
                  if (!loadingParse && file) {
                    e.target.style.background = 'linear-gradient(135deg, #7c3aed, #db2777)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loadingParse && file) {
                    e.target.style.background = 'linear-gradient(135deg, #9333ea, #ec4899)';
                  }
                }}
              >
                {loadingParse ? (
                  <>
                    <div style={styles.spinner}></div>
                    Parsing PDF...
                  </>
                ) : (
                  "Parse PDF Resume"
                )}
              </button>
            </div>

            {/* Step 2: Resume Text Display */}
            {resumeText && (
              <div style={styles.sectionMargin}>
                <h2 style={styles.stepHeader}>
                  <span style={{...styles.stepNumber, background: '#10b981'}}>2</span>
                  Extracted Resume Content
                </h2>
                <textarea
                  rows={8}
                  readOnly
                  value={resumeText}
                  style={styles.textArea}
                />
              </div>
            )}

            {/* Step 3: Theme Selection */}
            {resumeText && (
              <div style={styles.sectionMargin}>
                <h2 style={styles.stepHeader}>
                  <span style={{...styles.stepNumber, background: '#3b82f6'}}>3</span>
                  Choose Portfolio Theme
                </h2>
                
                <div style={styles.themeGrid}>
                  {themes.map((themeOption) => (
                    <button
                      key={themeOption.value}
                      onClick={() => setTheme(themeOption.value)}
                      style={{
                        ...styles.themeButton,
                        ...(theme === themeOption.value ? styles.themeButtonSelected : {})
                      }}
                    >
                      <div style={{
                        ...styles.themeColor,
                        backgroundColor: themeOption.color
                      }}></div>
                      <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>
                        {themeOption.name}
                      </p>
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleGeneratePortfolio}
                  disabled={loadingGenerate}
                  className="animated-button"
                  style={{
                    ...styles.primaryButton,
                    ...styles.primaryButtonLarge,
                    ...(loadingGenerate ? styles.disabledButton : {}),
                    animation: loadingGenerate ? 'none' : 'buttonPulse 2s infinite'
                  }}
                  onMouseEnter={(e) => {
                    if (!loadingGenerate) {
                      e.target.style.background = 'linear-gradient(135deg, #7c3aed, #db2777)';
                      e.target.style.transform = 'translateY(-2px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loadingGenerate) {
                      e.target.style.background = 'linear-gradient(135deg, #9333ea, #ec4899)';
                      e.target.style.transform = 'translateY(0px)';
                    }
                  }}
                >
                  {loadingGenerate ? (
                    <>
                      <div style={{...styles.spinner, width: '24px', height: '24px'}}></div>
                      Generating Portfolio...
                    </>
                  ) : (
                    <>
                      <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Generate AI Portfolio
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div style={styles.errorBox}>
                <svg width="20" height="20" fill="none" stroke="#f87171" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span style={{ color: '#fca5a5', fontWeight: '500' }}>Error: {error}</span>
              </div>
            )}

            {/* Generated Code Display */}
            {generatedCode && (
              <div style={styles.sectionMargin}>
                <h2 style={styles.stepHeader}>
                  <span style={{...styles.stepNumber, background: '#10b981'}}>4</span>
                  Your Portfolio is Ready!
                </h2>
                
                <div style={styles.codeContainer}>
                  <div style={styles.codeHeader}>
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#d1d5db' }}>
                      Generated HTML Code
                    </span>
                    <button 
                      onClick={() => navigator.clipboard.writeText(generatedCode)}
                      style={styles.copyButton}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#4b5563'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#374151'}
                    >
                      Copy Code
                    </button>
                  </div>
                  <pre style={styles.codeContent}>
                    {generatedCode}
                  </pre>
                </div>

                <div style={styles.buttonGroup}>
                  <a
                    href={`/viewPortfolio?code=${encodeURIComponent(generatedCode)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      ...styles.primaryButton,
                      ...styles.primaryButtonLarge,
                      textDecoration: 'none',
                      flex: '1'
                    }}
                  >
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    View Live Portfolio
                  </a>
                  <button
                    onClick={() => {
                      const blob = new Blob([generatedCode], { type: "text/html" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'portfolio.html';
                      a.click();
                    }}
                    style={styles.secondaryButton}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#4b5563'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#374151'}
                  >
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Features Section */}
          <div style={styles.featuresGrid}>
            <div style={styles.featureCard}>
              <div style={{...styles.featureIcon, background: 'rgba(168, 85, 247, 0.2)'}}>
                <svg width="24" height="24" fill="none" stroke="#a855f7" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 style={styles.featureTitle}>AI-Powered</h3>
              <p style={styles.featureDescription}>
                Advanced language models analyze your resume and create personalized portfolio websites.
              </p>
            </div>

            <div style={styles.featureCard}>
              <div style={{...styles.featureIcon, background: 'rgba(236, 72, 153, 0.2)'}}>
                <svg width="24" height="24" fill="none" stroke="#ec4899" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 style={styles.featureTitle}>Beautiful Themes</h3>
              <p style={styles.featureDescription}>
                Choose from carefully crafted color themes that make your portfolio stand out.
              </p>
            </div>

            <div style={styles.featureCard}>
              <div style={{...styles.featureIcon, background: 'rgba(59, 130, 246, 0.2)'}}>
                <svg width="24" height="24" fill="none" stroke="#3b82f6" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 style={styles.featureTitle}>Instant Generation</h3>
              <p style={styles.featureDescription}>
                Get your complete portfolio website in seconds, ready to deploy anywhere.
              </p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}