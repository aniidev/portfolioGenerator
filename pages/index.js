import { useState } from "react";
import { signIn, useSession, signOut } from "next-auth/react";
import {
  Upload,
  Github,
  Sparkles,
  Palette,
  FileText,
  Rocket,
  Code2,
  Wand2,
  ArrowRight,
  Check,
  AlertTriangle,
  Loader2,
  ChevronRight,
  Zap,
  Globe,
  LayoutGrid,
  ExternalLink,
  Briefcase,
  GraduationCap,
  Mail,
  Star,
} from "lucide-react";

// ---------- Design tokens ----------
const T = {
  bg: "#08080B",
  surface: "#0F0F14",
  card: "#15151E",
  cardHi: "#1B1B26",
  border: "#26262F",
  borderHi: "#3A3A47",
  ink: "#F4F4F5",
  mutedInk: "#A1A1AA",
  dim: "#71717A",
  violet: "#A78BFA",
  cyan: "#22D3EE",
  success: "#22C55E",
  danger: "#F87171",
  display: "'Space Grotesk', 'Inter', ui-sans-serif, system-ui, sans-serif",
  body: "'Inter', ui-sans-serif, system-ui, sans-serif",
};

const themes = [
  { value: "purple", color: "#A78BFA", name: "Reflect" },
  { value: "blue",   color: "#60A5FA", name: "Ocean" },
  { value: "pink",   color: "#F472B6", name: "Sunset" },
  { value: "green",  color: "#34D399", name: "Forest" },
  { value: "red",    color: "#F87171", name: "Crimson" },
  { value: "yellow", color: "#FBBF24", name: "Solar" },
  { value: "gray",   color: "#9CA3AF", name: "Minimal" },
  { value: "dark",   color: "#1F2937", name: "Night" },
];

const features = [
  {
    icon: Wand2,
    title: "AI Resume Extraction",
    body:
      "Drop in any PDF résumé and a structured-output LLM pipeline pulls out experience, projects, skills, and links into a clean schema.",
  },
  {
    icon: LayoutGrid,
    title: "Premium React Components",
    body:
      "Animated hero, parallax background, tilt project cards, timeline, and a floating skills cloud — built with Framer Motion and GSAP.",
  },
  {
    icon: Palette,
    title: "8 Theme Presets",
    body:
      "Pick a palette in one click. Each theme rebuilds typography, gradients, and accents to match — no CSS required.",
  },
  {
    icon: Sparkles,
    title: "Custom Feature Prompts",
    body:
      "Want a blog, contact form, or dark-mode toggle? Describe it in plain English and the generator wires it into the build.",
  },
  {
    icon: Github,
    title: "One-Click GitHub Deploy",
    body:
      "Sign in once and we provision a repo, push the generated source, and ship a live site — all from the browser.",
  },
  {
    icon: Globe,
    title: "Production-Ready Output",
    body:
      "Next.js 15 + React 19, fully responsive, lighthouse-friendly, and yours to fork. No vendor lock-in.",
  },
];

const steps = [
  {
    n: "01",
    title: "Upload your résumé",
    body: "PDF only. We never store the file — it's parsed in-memory and discarded.",
  },
  {
    n: "02",
    title: "Pick a theme & extras",
    body: "Choose one of 8 palettes and optionally describe extra sections you want.",
  },
  {
    n: "03",
    title: "Generate & deploy",
    body: "Preview your portfolio in a new tab, then ship it live to GitHub Pages with one click.",
  },
];

export default function Home() {
  // ---------- functional state (unchanged) ----------
  const [file, setFile] = useState(null);
  const [generatedCode, setGeneratedCode] = useState("");
  const [loadingGenerate, setLoadingGenerate] = useState(false);
  const [error, setError] = useState("");
  const [theme, setTheme] = useState("purple");
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
      const formData = new FormData();
      formData.append("resume", file);
      const parseRes = await fetch("/api/parseResume", { method: "POST", body: formData });
      if (!parseRes.ok) {
        const err = await parseRes.json();
        throw new Error(err.error || "Failed to parse PDF");
      }
      const parseData = await parseRes.json();
      const resumeText = parseData.text;

      const genRes = await fetch("/api/generatePortfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, customFeatures }),
      });
      if (!genRes.ok) {
        const err = await genRes.json();
        throw new Error(err.error || "Failed to generate portfolio");
      }
      const data = await genRes.json();

      sessionStorage.setItem("portfolioBlueprint", JSON.stringify(data.blueprint));
      sessionStorage.setItem("portfolioTheme", data.theme || "sleek_engineer");
      setGeneratedCode(JSON.stringify(data.blueprint));
      window.open("/portfolio", "_blank");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingGenerate(false);
    }
  }

  async function handleDeployToGitHub() {
    if (!session) {
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
      window.open(data.url, "_blank");
    } catch (err) {
      setError("Deployment failed: " + err.message);
    }
  }

  // ---------- render ----------
  return (
    <>
      <GlobalStyles />

      <div style={{ background: T.bg, color: T.ink, fontFamily: T.body, minHeight: "100vh", overflowX: "hidden" }}>
        <BackgroundOrbs />
        <Nav session={session} />

        {/* HERO */}
        <section style={{ position: "relative", zIndex: 2, padding: "120px 24px 80px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gap: 56, gridTemplateColumns: "1fr", alignItems: "center" }}
               className="hero-grid">
            {/* Left: copy */}
            <div>
              <Pill>
                <Sparkles size={12} style={{ color: T.violet }} />
                <span>Powered by structured-output RAG LLMs</span>
              </Pill>

              <h1 style={{
                fontFamily: T.display,
                fontSize: "clamp(2.5rem, 6vw, 4.25rem)",
                lineHeight: 1.05,
                margin: "20px 0 20px",
                fontWeight: 600,
                letterSpacing: "-0.03em",
              }}>
                Turn your résumé into a{" "}
                <span style={{
                  background: `linear-gradient(135deg, ${T.violet} 0%, ${T.cyan} 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}>
                  live portfolio site
                </span>{" "}
                in 60 seconds.
              </h1>

              <p style={{ fontSize: 18, lineHeight: 1.6, color: T.mutedInk, maxWidth: 540, margin: "0 0 32px" }}>
                Upload a PDF. PortfolioGen extracts your experience, generates a polished
                Next.js site, and ships it to your own GitHub repo. No code, no design tools,
                no copy-paste.
              </p>

              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 32 }}>
                <a href="#try" style={primaryCta()}>
                  Try it free
                  <ArrowRight size={16} />
                </a>
                <a href="#how" style={ghostCta()}>
                  How it works
                </a>
              </div>

              <div style={{ display: "flex", gap: 24, color: T.dim, fontSize: 13, flexWrap: "wrap" }}>
                <Trust label="No credit card" />
                <Trust label="Open source output" />
                <Trust label="Deploy to your GitHub" />
              </div>
            </div>

            {/* Right: live upload card */}
            <div id="try">
              <TryCard
                file={file}
                setFile={setFile}
                theme={theme}
                setTheme={setTheme}
                customFeatures={customFeatures}
                setCustomFeatures={setCustomFeatures}
                loadingGenerate={loadingGenerate}
                handleGeneratePortfolio={handleGeneratePortfolio}
                handleDeployToGitHub={handleDeployToGitHub}
                generatedCode={generatedCode}
                error={error}
                session={session}
              />
            </div>
          </div>
        </section>

        {/* TRUST STRIP */}
        <section style={{ position: "relative", zIndex: 2, padding: "16px 24px 24px" }}>
          <div style={{
            maxWidth: 1200, margin: "0 auto", display: "flex", gap: 28,
            flexWrap: "wrap", justifyContent: "center", alignItems: "center",
            color: T.dim, fontSize: 13, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`,
            padding: "20px 0",
          }}>
            <span style={{ letterSpacing: "0.18em", textTransform: "uppercase", fontSize: 11 }}>Built with</span>
            <TechBadge>Next.js 15</TechBadge>
            <TechBadge>React 19</TechBadge>
            <TechBadge>Framer Motion</TechBadge>
            <TechBadge>GSAP</TechBadge>
            <TechBadge>Groq · LLM pipeline</TechBadge>
            <TechBadge>GitHub API</TechBadge>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" style={{ position: "relative", zIndex: 2, padding: "100px 24px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <SectionHeading
              eyebrow="Features"
              title="Everything you need to ship a portfolio"
              subtitle="A real product pipeline behind a single upload button — résumé parsing, structured LLM extraction, themeable React rendering, and one-click deployment."
            />

            <div style={{
              display: "grid", gap: 20, marginTop: 56,
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            }}>
              {features.map((f) => (
                <FeatureCard key={f.title} icon={f.icon} title={f.title} body={f.body} />
              ))}
            </div>
          </div>
        </section>

        {/* GALLERY */}
        <section id="gallery" style={{ position: "relative", zIndex: 2, padding: "60px 24px 100px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <SectionHeading
              eyebrow="Gallery"
              title="See what it builds"
              subtitle="Real generated portfolios across every theme. Each one is a fully responsive Next.js site you can deploy in one click."
            />
            <div style={{
              display: "grid", gap: 24, marginTop: 56,
              gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))",
            }}>
              {GALLERY.map((p) => <PreviewCard key={p.name} {...p} />)}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how" style={{ position: "relative", zIndex: 2, padding: "60px 24px 100px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <SectionHeading
              eyebrow="How it works"
              title="Three steps from PDF to live URL"
              subtitle="The pipeline stays decoupled — extraction, generation, deployment — so each piece is testable and replaceable."
            />

            <div style={{
              display: "grid", gap: 20, marginTop: 56,
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            }}>
              {steps.map((s) => <StepCard key={s.n} n={s.n} title={s.title} body={s.body} />)}
            </div>
          </div>
        </section>

        {/* CTA BANNER */}
        <section style={{ position: "relative", zIndex: 2, padding: "60px 24px 100px" }}>
          <div style={{
            maxWidth: 1100, margin: "0 auto", padding: "56px 40px",
            borderRadius: 24,
            background: `radial-gradient(ellipse at top left, rgba(167,139,250,0.18), transparent 60%),
                         radial-gradient(ellipse at bottom right, rgba(34,211,238,0.14), transparent 60%),
                         ${T.surface}`,
            border: `1px solid ${T.border}`,
            textAlign: "center",
            boxShadow: "0 30px 80px -30px rgba(0,0,0,0.6)",
          }}>
            <h2 style={{
              fontFamily: T.display, fontSize: "clamp(2rem, 4vw, 2.75rem)",
              margin: "0 0 12px", letterSpacing: "-0.02em",
            }}>
              Your portfolio shouldn't take a weekend.
            </h2>
            <p style={{ color: T.mutedInk, maxWidth: 560, margin: "0 auto 28px", fontSize: 17, lineHeight: 1.6 }}>
              Upload your résumé and have a deployed site before your coffee gets cold.
            </p>
            <a href="#try" style={primaryCta()}>
              Generate my portfolio
              <ArrowRight size={16} />
            </a>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}

/* =========================================================================
 *  COMPONENTS
 * ========================================================================= */

function GlobalStyles() {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap"
        rel="stylesheet"
      />
      <style jsx global>{`
        *, *::before, *::after { box-sizing: border-box; }
        html, body { margin: 0; padding: 0; background: ${T.bg}; }
        body {
          font-family: ${T.body};
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        ::selection { background: ${T.violet}55; color: ${T.ink}; }
        a { color: inherit; text-decoration: none; }
        button { font-family: inherit; }

        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes orbDrift {
          0%, 100% { transform: translate3d(0,0,0) scale(1); opacity: 0.55; }
          50%      { transform: translate3d(20px,-30px,0) scale(1.08); opacity: 0.75; }
        }
        @keyframes orbDrift2 {
          0%, 100% { transform: translate3d(0,0,0) scale(1); opacity: 0.45; }
          50%      { transform: translate3d(-30px,20px,0) scale(0.95); opacity: 0.65; }
        }

        .hero-grid { grid-template-columns: 1fr; }
        @media (min-width: 980px) {
          .hero-grid { grid-template-columns: 1.05fr 1fr; }
        }

        .focus-ring:focus-visible {
          outline: 2px solid ${T.violet};
          outline-offset: 2px;
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation: none !important; transition: none !important; }
        }
      `}</style>
    </>
  );
}

function BackgroundOrbs() {
  return (
    <>
      <div style={{
        position: "absolute", top: -120, left: "50%", transform: "translateX(-50%)",
        width: 900, height: 600,
        background: `radial-gradient(ellipse, rgba(167,139,250,0.28) 0%, rgba(167,139,250,0.10) 40%, transparent 70%)`,
        filter: "blur(80px)", pointerEvents: "none", zIndex: 1,
        animation: "orbDrift 14s ease-in-out infinite",
      }} />
      <div style={{
        position: "absolute", top: 360, right: -120, width: 600, height: 500,
        background: `radial-gradient(ellipse, rgba(34,211,238,0.22) 0%, rgba(34,211,238,0.06) 50%, transparent 80%)`,
        filter: "blur(90px)", pointerEvents: "none", zIndex: 1,
        animation: "orbDrift2 18s ease-in-out infinite",
      }} />
    </>
  );
}

function Nav({ session }) {
  return (
    <header style={{
      position: "fixed", top: 16, left: 16, right: 16, zIndex: 50,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "12px 20px",
      background: "rgba(15,15,20,0.7)",
      backdropFilter: "blur(14px)",
      WebkitBackdropFilter: "blur(14px)",
      border: `1px solid ${T.border}`,
      borderRadius: 14,
      maxWidth: 1200, margin: "0 auto",
    }}>
      <a href="#" style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 28, height: 28, borderRadius: 8,
          background: `linear-gradient(135deg, ${T.violet}, ${T.cyan})`,
          display: "grid", placeItems: "center",
        }}>
          <Code2 size={16} style={{ color: T.bg }} strokeWidth={2.5} />
        </div>
        <span style={{ fontFamily: T.display, fontWeight: 600, fontSize: 16, letterSpacing: "-0.01em" }}>
          PortfolioGen
        </span>
      </a>

      <nav style={{ display: "flex", gap: 28, alignItems: "center" }} className="nav-links">
        <NavLink href="#features">Features</NavLink>
        <NavLink href="#gallery">Gallery</NavLink>
        <NavLink href="#how">How it works</NavLink>
        <NavLink href="https://github.com/aniidev/portfolioGenerator" external>GitHub</NavLink>
      </nav>

      <div>
        {!session ? (
          <button
            onClick={() => signIn("github")}
            className="focus-ring"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: T.ink, color: T.bg, border: "none",
              borderRadius: 10, padding: "9px 16px",
              fontSize: 14, fontWeight: 600, cursor: "pointer",
              transition: "transform 150ms ease, box-shadow 150ms ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 20px -8px rgba(244,244,245,0.4)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
          >
            <Github size={15} />
            Sign in
          </button>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 13, color: T.mutedInk }}>{session.user?.name || "Signed in"}</span>
            <button
              onClick={() => signOut()}
              className="focus-ring"
              style={{
                background: "transparent", color: T.mutedInk,
                border: `1px solid ${T.border}`, borderRadius: 8,
                padding: "6px 12px", fontSize: 12, cursor: "pointer",
                transition: "color 150ms, border-color 150ms",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = T.ink; e.currentTarget.style.borderColor = T.borderHi; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = T.mutedInk; e.currentTarget.style.borderColor = T.border; }}
            >
              Sign out
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @media (max-width: 760px) {
          .nav-links { display: none; }
        }
      `}</style>
    </header>
  );
}

function NavLink({ href, children, external }) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      style={{ color: T.mutedInk, fontSize: 14, fontWeight: 500, transition: "color 150ms" }}
      onMouseEnter={(e) => { e.currentTarget.style.color = T.ink; }}
      onMouseLeave={(e) => { e.currentTarget.style.color = T.mutedInk; }}
    >
      {children}
    </a>
  );
}

function Pill({ children }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 8,
      padding: "6px 12px",
      background: "rgba(167,139,250,0.08)",
      border: `1px solid rgba(167,139,250,0.25)`,
      borderRadius: 999,
      fontSize: 12, fontWeight: 500, color: T.mutedInk,
      letterSpacing: "0.01em",
    }}>
      {children}
    </span>
  );
}

function Trust({ label }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      <Check size={14} style={{ color: T.success }} />
      {label}
    </span>
  );
}

function TechBadge({ children }) {
  return (
    <span style={{
      padding: "4px 10px",
      border: `1px solid ${T.border}`,
      borderRadius: 6,
      fontSize: 12,
      color: T.mutedInk,
    }}>
      {children}
    </span>
  );
}

function SectionHeading({ eyebrow, title, subtitle }) {
  return (
    <div style={{ textAlign: "center", maxWidth: 720, margin: "0 auto" }}>
      <span style={{
        display: "inline-block", padding: "4px 10px",
        background: T.card, border: `1px solid ${T.border}`,
        borderRadius: 6, fontSize: 11, color: T.violet,
        letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 600,
      }}>
        {eyebrow}
      </span>
      <h2 style={{
        fontFamily: T.display, fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
        margin: "16px 0 12px", letterSpacing: "-0.02em", lineHeight: 1.15,
      }}>
        {title}
      </h2>
      <p style={{ color: T.mutedInk, fontSize: 16, lineHeight: 1.6, margin: 0 }}>
        {subtitle}
      </p>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, body }) {
  return (
    <div
      style={{
        background: T.card,
        border: `1px solid ${T.border}`,
        borderRadius: 14,
        padding: 24,
        transition: "border-color 200ms ease, transform 200ms ease, background 200ms ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = T.borderHi;
        e.currentTarget.style.background = T.cardHi;
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = T.border;
        e.currentTarget.style.background = T.card;
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div style={{
        width: 38, height: 38, borderRadius: 10,
        background: "rgba(167,139,250,0.10)",
        border: `1px solid rgba(167,139,250,0.25)`,
        display: "grid", placeItems: "center", marginBottom: 16,
      }}>
        <Icon size={18} style={{ color: T.violet }} />
      </div>
      <h3 style={{ fontFamily: T.display, fontSize: 17, margin: "0 0 8px", letterSpacing: "-0.01em", fontWeight: 600 }}>
        {title}
      </h3>
      <p style={{ color: T.mutedInk, fontSize: 14.5, lineHeight: 1.6, margin: 0 }}>
        {body}
      </p>
    </div>
  );
}

function StepCard({ n, title, body }) {
  return (
    <div style={{
      background: T.card, border: `1px solid ${T.border}`,
      borderRadius: 14, padding: 28,
      position: "relative", overflow: "hidden",
    }}>
      <div style={{
        fontFamily: T.display, fontSize: 56, fontWeight: 700,
        background: `linear-gradient(135deg, ${T.violet}, ${T.cyan})`,
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        lineHeight: 1, marginBottom: 14, letterSpacing: "-0.04em",
      }}>{n}</div>
      <h3 style={{ fontFamily: T.display, fontSize: 18, margin: "0 0 8px", fontWeight: 600 }}>
        {title}
      </h3>
      <p style={{ color: T.mutedInk, fontSize: 14.5, lineHeight: 1.6, margin: 0 }}>
        {body}
      </p>
    </div>
  );
}

function TryCard({
  file, setFile, theme, setTheme, customFeatures, setCustomFeatures,
  loadingGenerate, handleGeneratePortfolio, handleDeployToGitHub,
  generatedCode, error, session,
}) {
  return (
    <div style={{
      background: `linear-gradient(180deg, ${T.cardHi} 0%, ${T.card} 100%)`,
      border: `1px solid ${T.border}`,
      borderRadius: 18,
      padding: 24,
      boxShadow: "0 30px 80px -40px rgba(0,0,0,0.6), 0 0 0 1px rgba(167,139,250,0.05)",
      position: "relative",
    }}>
      {/* glow accent */}
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse at top, rgba(167,139,250,0.10), transparent 60%)`,
        pointerEvents: "none", borderRadius: 18,
      }} />

      <div style={{ position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <div style={{ display: "flex", gap: 6 }}>
            <Dot color="#FF5F57" />
            <Dot color="#FEBC2E" />
            <Dot color="#28C840" />
          </div>
          <span style={{ fontSize: 12, color: T.dim, fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>
            portfolio-gen.app/try
          </span>
        </div>

        {/* Step 1: Upload */}
        <StepLabel num={1} text="Upload your résumé" />
        <UploadZone file={file} setFile={setFile} />

        {/* Step 2: Theme */}
        {file && (
          <>
            <StepLabel num={2} text="Choose a theme" />
            <div style={{
              display: "grid", gap: 10,
              gridTemplateColumns: "repeat(4, 1fr)",
              marginBottom: 24,
            }}>
              {themes.map((t) => {
                const selected = theme === t.value;
                return (
                  <button
                    key={t.value}
                    onClick={() => setTheme(t.value)}
                    className="focus-ring"
                    style={{
                      background: selected ? "rgba(167,139,250,0.10)" : T.surface,
                      border: `1px solid ${selected ? T.violet : T.border}`,
                      borderRadius: 10, padding: "10px 8px",
                      cursor: "pointer", display: "flex", flexDirection: "column",
                      alignItems: "center", gap: 6,
                      transition: "border-color 150ms, background 150ms, transform 150ms",
                    }}
                    onMouseEnter={(e) => {
                      if (!selected) {
                        e.currentTarget.style.borderColor = T.borderHi;
                        e.currentTarget.style.transform = "translateY(-1px)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!selected) {
                        e.currentTarget.style.borderColor = T.border;
                        e.currentTarget.style.transform = "translateY(0)";
                      }
                    }}
                  >
                    <span style={{
                      width: 18, height: 18, borderRadius: "50%",
                      background: t.color, boxShadow: `0 0 0 2px ${T.surface}, 0 0 0 3px ${selected ? T.violet : T.border}`,
                    }} />
                    <span style={{ fontSize: 11, color: selected ? T.ink : T.mutedInk }}>{t.name}</span>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* Step 3: Custom features */}
        {file && (
          <>
            <StepLabel num={3} text="Custom features (optional)" />
            <textarea
              rows={3}
              value={customFeatures}
              onChange={(e) => setCustomFeatures(e.target.value)}
              placeholder="e.g., dark-mode toggle, project gallery, contact form, blog…"
              className="focus-ring"
              style={{
                width: "100%", padding: "12px 14px",
                borderRadius: 10, border: `1px solid ${T.border}`,
                background: T.surface, color: T.ink,
                fontSize: 14, fontFamily: T.body, resize: "vertical",
                outline: "none", transition: "border-color 150ms",
                marginBottom: 24,
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = T.violet; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = T.border; }}
            />
          </>
        )}

        {/* Generate */}
        {file && (
          <button
            onClick={handleGeneratePortfolio}
            disabled={loadingGenerate}
            className="focus-ring"
            style={{
              ...primaryCta(),
              width: "100%",
              justifyContent: "center",
              opacity: loadingGenerate ? 0.7 : 1,
              cursor: loadingGenerate ? "not-allowed" : "pointer",
            }}
          >
            {loadingGenerate ? (
              <>
                <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
                Generating…
              </>
            ) : (
              <>
                <Rocket size={16} />
                Generate portfolio
              </>
            )}
          </button>
        )}

        {/* Deploy */}
        {generatedCode && (
          <button
            onClick={handleDeployToGitHub}
            className="focus-ring"
            style={{
              marginTop: 12, width: "100%", justifyContent: "center",
              ...ghostCta(),
            }}
          >
            <Github size={16} />
            {session ? "Deploy to GitHub" : "Sign in & deploy"}
          </button>
        )}

        {/* Error */}
        {error && (
          <div style={{
            marginTop: 16,
            display: "flex", alignItems: "flex-start", gap: 10,
            padding: "12px 14px",
            background: "rgba(248,113,113,0.08)",
            border: `1px solid rgba(248,113,113,0.30)`,
            borderRadius: 10,
            color: T.danger,
            fontSize: 13.5,
          }}>
            <AlertTriangle size={16} style={{ marginTop: 1, flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Hint */}
        {!file && (
          <p style={{ fontSize: 12, color: T.dim, marginTop: 12, textAlign: "center" }}>
            PDF only · processed in-memory · never stored
          </p>
        )}
      </div>
    </div>
  );
}

function Dot({ color }) {
  return <span style={{ width: 10, height: 10, borderRadius: "50%", background: color, opacity: 0.85 }} />;
}

function StepLabel({ num, text }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "0 0 12px", fontSize: 13, color: T.mutedInk, fontWeight: 500 }}>
      <span style={{
        width: 22, height: 22, borderRadius: 6,
        background: T.surface, border: `1px solid ${T.border}`,
        display: "grid", placeItems: "center",
        fontSize: 11, color: T.violet, fontWeight: 700, fontFamily: T.display,
      }}>{num}</span>
      {text}
    </div>
  );
}

function UploadZone({ file, setFile }) {
  return (
    <div
      onClick={() => document.getElementById("file-upload").click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") document.getElementById("file-upload").click(); }}
      className="focus-ring"
      style={{
        border: `1.5px dashed ${file ? T.violet : T.border}`,
        borderRadius: 12,
        padding: "28px 20px",
        textAlign: "center", cursor: "pointer",
        background: file ? "rgba(167,139,250,0.06)" : T.surface,
        transition: "border-color 150ms, background 150ms",
        marginBottom: 24,
      }}
      onMouseEnter={(e) => { if (!file) e.currentTarget.style.borderColor = T.borderHi; }}
      onMouseLeave={(e) => { if (!file) e.currentTarget.style.borderColor = T.border; }}
    >
      <input
        id="file-upload"
        type="file"
        accept="application/pdf"
        style={{ display: "none" }}
        onChange={(e) => setFile(e.target.files[0])}
      />
      <div style={{
        width: 40, height: 40, borderRadius: 10,
        background: file ? "rgba(167,139,250,0.15)" : T.card,
        border: `1px solid ${file ? "rgba(167,139,250,0.4)" : T.border}`,
        display: "grid", placeItems: "center", margin: "0 auto 12px",
      }}>
        {file ? <FileText size={18} style={{ color: T.violet }} /> : <Upload size={18} style={{ color: T.mutedInk }} />}
      </div>
      <p style={{ margin: 0, fontSize: 14, color: T.ink, fontWeight: 500 }}>
        {file ? file.name : "Drop PDF or click to browse"}
      </p>
      {!file && (
        <p style={{ margin: "4px 0 0", fontSize: 12, color: T.dim }}>
          Max 10MB · résumés, CVs, profiles
        </p>
      )}
    </div>
  );
}

function Footer() {
  return (
    <footer style={{
      position: "relative", zIndex: 2,
      borderTop: `1px solid ${T.border}`,
      padding: "32px 24px",
      color: T.dim, fontSize: 13,
    }}>
      <div style={{
        maxWidth: 1200, margin: "0 auto",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        gap: 16, flexWrap: "wrap",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 22, height: 22, borderRadius: 6,
            background: `linear-gradient(135deg, ${T.violet}, ${T.cyan})`,
            display: "grid", placeItems: "center",
          }}>
            <Code2 size={13} style={{ color: T.bg }} strokeWidth={2.5} />
          </div>
          <span style={{ color: T.mutedInk, fontFamily: T.display, fontWeight: 600 }}>PortfolioGen</span>
          <span>© {new Date().getFullYear()}</span>
        </div>
        <div style={{ display: "flex", gap: 20 }}>
          <a href="https://github.com/aniidev/portfolioGenerator" target="_blank" rel="noreferrer"
             style={{ color: T.mutedInk, transition: "color 150ms" }}
             onMouseEnter={(e) => (e.currentTarget.style.color = T.ink)}
             onMouseLeave={(e) => (e.currentTarget.style.color = T.mutedInk)}>
            GitHub
          </a>
          <a href="#features" style={{ color: T.mutedInk, transition: "color 150ms" }}
             onMouseEnter={(e) => (e.currentTarget.style.color = T.ink)}
             onMouseLeave={(e) => (e.currentTarget.style.color = T.mutedInk)}>
            Features
          </a>
          <a href="#how" style={{ color: T.mutedInk, transition: "color 150ms" }}
             onMouseEnter={(e) => (e.currentTarget.style.color = T.ink)}
             onMouseLeave={(e) => (e.currentTarget.style.color = T.mutedInk)}>
            How it works
          </a>
        </div>
      </div>
    </footer>
  );
}

/* =========================================================================
 *  GALLERY DATA + COMPONENT
 * ========================================================================= */

const GALLERY = [
  {
    slug: "alex",
    name: "Alex Chen",
    role: "ML Engineer",
    domain: "alex-chen.dev",
    themeName: "Futuristic AI",
    themeId: "futuristic_ai",
    accent: "#A855F7",
    accent2: "#06B6D4",
    bg: "#04010D",
    surface: "#0F0820",
    ink: "#F8F8FF",
    muted: "#A8A0C0",
    stats: [
      { k: "12", v: "Projects" },
      { k: "4y", v: "Experience" },
      { k: "3.9", v: "GPA · CMU" },
    ],
    projects: ["LLM-RAG search", "Vision diff tool", "Vector DB bench"],
    skills: ["PyTorch", "JAX", "CUDA", "Triton", "Ray"],
    blueprint: {
      persona: "AI Engineer",
      hero: {
        name: "Alex Chen",
        role: "Machine Learning Engineer",
        headline: "Shipping production-grade ML systems.",
        subheadline:
          "Building retrieval, training, and inference pipelines for LLM-powered products. Previously ML at a YC fintech and research at CMU LTI.",
        metrics: [
          { label: "Projects", value: 12 },
          { label: "Years", value: 4 },
          { label: "Papers", value: 3 },
        ],
      },
      about: {
        paragraph:
          "I work at the intersection of applied ML and systems engineering. My focus is on retrieval-augmented generation, vector databases, and the unglamorous infrastructure that makes models actually useful in production. I care about latency budgets, cost-per-query, and making sure the right answer comes back the first time.",
      },
      experience: [
        { company: "Forge AI", role: "ML Engineer", duration: "2024 — Present",
          bullets: ["Built the RAG pipeline serving 2M queries/day", "Cut p99 retrieval latency from 420ms to 78ms", "Owned eval harness across 4 model families"] },
        { company: "Lumen Capital", role: "ML Intern",  duration: "Summer 2023",
          bullets: ["Trained transformer model on 8B tokens of filings", "Productionized inference with vLLM + Triton"] },
        { company: "CMU LTI",      role: "Research Asst.", duration: "2022 — 2024",
          bullets: ["First-author at EMNLP 2024 on long-context retrieval", "Open-sourced eval suite with 300+ stars"] },
      ],
      projects: [
        { title: "LLM-RAG Search",    description: "End-to-end retrieval system over 50M docs with hybrid sparse-dense routing and learned re-ranking.", tags: ["PyTorch", "FAISS", "Triton"] },
        { title: "Vision Diff Tool",  description: "Pixel-aware UI regression detector using CLIP embeddings — used in CI for two design systems.", tags: ["CLIP", "ONNX", "Vercel"] },
        { title: "Vector DB Bench",   description: "Open-source benchmark across pgvector, Qdrant, Milvus, Weaviate. 1.2k GitHub stars.", tags: ["Go", "Docker", "k6"] },
      ],
      skills: ["PyTorch", "JAX", "CUDA", "Triton", "Ray", "vLLM", "FAISS", "Python", "Go", "Kubernetes"],
      education: [
        { school: "Carnegie Mellon University", degree: "MS, Language Technologies", duration: "2022 — 2024",
          achievements: ["GPA 3.95", "Dean's Honor List", "EMNLP 2024 paper"] },
        { school: "UC Berkeley",                degree: "BS, Computer Science",      duration: "2018 — 2022",
          achievements: ["CS Honors", "AI4ALL Fellow"] },
      ],
      contact: { email: "alex@alex-chen.dev", github: "alexchen", linkedin: "alexchen-ml" },
    },
  },
  {
    slug: "maya",
    name: "Maya Rodriguez",
    role: "Product Designer",
    domain: "maya.design",
    themeName: "Modern Minimalist",
    themeId: "modern_minimalist",
    light: true,
    accent: "#6366F1",
    accent2: "#F43F5E",
    bg: "#FAFAF9",
    surface: "#FFFFFF",
    ink: "#111827",
    muted: "#6B7280",
    stats: [
      { k: "30+", v: "Brands" },
      { k: "6y", v: "Experience" },
      { k: "MICA", v: "BFA, Honors" },
    ],
    projects: ["Acme rebrand", "Lumen design system", "Editorial app"],
    skills: ["Figma", "Webflow", "Framer", "Type", "Motion"],
    blueprint: {
      persona: "Student Researcher",
      hero: {
        name: "Maya Rodriguez",
        role: "Product Designer",
        headline: "Editorial design for software products.",
        subheadline:
          "I design quiet interfaces for loud problems — design systems, brand identity, and the small details that make products feel resolved.",
        metrics: [
          { label: "Brands", value: 30 },
          { label: "Years", value: 6 },
          { label: "Awards", value: 4 },
        ],
      },
      about: {
        paragraph:
          "I've spent the last six years designing for early-stage startups and editorial publications. My work has shipped on Mailchimp, Substack, and three Y Combinator companies. I treat type as the foundation, not the finish.",
      },
      experience: [
        { company: "Independent",       role: "Design Lead, Contract", duration: "2023 — Present",
          bullets: ["Lead design for two YC seed-stage startups", "Built Lumen — a Figma-native design system used by 40+ teams"] },
        { company: "Mailchimp",         role: "Senior Product Designer", duration: "2020 — 2023",
          bullets: ["Owned the email composer redesign (used by 13M senders)", "Shipped a typographic refresh that lifted CTR by 9%"] },
        { company: "Pentagram",         role: "Junior Designer",         duration: "2018 — 2020",
          bullets: ["Identity work for arts and cultural institutions", "AIGA Fresh 2019 honoree"] },
      ],
      projects: [
        { title: "Acme Rebrand",        description: "Identity, type system, and motion language for a Series B fintech. Rolled out across 14 surfaces.", tags: ["Identity", "Motion", "Type"] },
        { title: "Lumen Design System", description: "Figma-native system with 280 components and a Storybook bridge. Adopted by 40+ teams.", tags: ["Figma", "Storybook", "Tokens"] },
        { title: "Editorial App",       description: "Long-form reading experience with custom OpenType features and a generative cover system.", tags: ["Webflow", "GSAP", "Type"] },
      ],
      skills: ["Figma", "Webflow", "Framer", "After Effects", "GSAP", "Type design", "Brand systems", "Prototyping"],
      education: [
        { school: "Maryland Institute College of Art", degree: "BFA, Graphic Design", duration: "2014 — 2018",
          achievements: ["Honors", "Type@Cooper alum"] },
      ],
      contact: { email: "hello@maya.design", github: "mayard", linkedin: "maya-rodriguez" },
    },
  },
  {
    slug: "jordan",
    name: "Jordan Kim",
    role: "Full-stack Developer",
    domain: "jordankim.io",
    themeName: "Sleek Engineer",
    themeId: "sleek_engineer",
    accent: "#60A5FA",
    accent2: "#34D399",
    bg: "#09090B",
    surface: "#18181B",
    ink: "#FFFFFF",
    muted: "#9CA3AF",
    stats: [
      { k: "20", v: "Repos" },
      { k: "5y", v: "Experience" },
      { k: "MIT", v: "BS · CS" },
    ],
    projects: ["Edge KV cache", "OAuth gateway", "Realtime canvas"],
    skills: ["TypeScript", "Go", "Postgres", "Redis", "k8s"],
    blueprint: {
      persona: "Software Engineer",
      hero: {
        name: "Jordan Kim",
        role: "Full-stack Engineer",
        headline: "I build infrastructure that doesn't get in the way.",
        subheadline:
          "Backend-leaning generalist. Comfortable from the metal up — Go, TypeScript, Postgres, and the boring discipline of running things in production.",
        metrics: [
          { label: "Repos", value: 20 },
          { label: "Years", value: 5 },
          { label: "Stars", value: 3400 },
        ],
      },
      about: {
        paragraph:
          "I'm happiest in the unglamorous middle of the stack — designing schemas, picking the right cache, and shaving milliseconds off the request path. I've shipped infrastructure for two early-stage startups and one mid-size SaaS, and open-sourced the parts that should never be rebuilt twice.",
      },
      experience: [
        { company: "Linear",      role: "Software Engineer",   duration: "2023 — Present",
          bullets: ["Owned the realtime sync backbone serving 100k+ workspaces", "Cut sync round-trip from 180ms to 45ms"] },
        { company: "Vercel",      role: "Backend Engineer",    duration: "2021 — 2023",
          bullets: ["Built the edge KV cache layer", "On-call rotation for the build pipeline (99.98% uptime)"] },
        { company: "MIT CSAIL",   role: "Research Software",   duration: "2020 — 2021",
          bullets: ["Distributed systems work on byzantine consensus"] },
      ],
      projects: [
        { title: "Edge KV Cache",     description: "Sub-10ms read-through cache layer with consistent hashing and per-region invalidation.", tags: ["Go", "Redis", "WASM"] },
        { title: "OAuth Gateway",     description: "Drop-in OIDC gateway with row-level multi-tenancy. Used by 12 internal services.", tags: ["TypeScript", "Postgres", "k8s"] },
        { title: "Realtime Canvas",   description: "CRDT-backed multiplayer drawing surface, ported the same primitives now used in Linear.", tags: ["Yjs", "WebSocket", "Canvas"] },
      ],
      skills: ["TypeScript", "Go", "Rust", "Postgres", "Redis", "Kubernetes", "Terraform", "gRPC", "React"],
      education: [
        { school: "MIT", degree: "BS, Computer Science", duration: "2017 — 2021",
          achievements: ["Phi Beta Kappa", "GPA 4.8/5.0"] },
      ],
      contact: { email: "jordan@jordankim.io", github: "jordankim", linkedin: "jordan-kim" },
    },
  },
  {
    slug: "sam",
    name: "Sam Patel",
    role: "DevOps Engineer",
    domain: "samp.sh",
    themeName: "Quant Terminal",
    themeId: "quant_terminal",
    accent: "#00FF88",
    accent2: "#00B4D8",
    bg: "#0D1117",
    surface: "#161B22",
    ink: "#E6EDF3",
    muted: "#8B949E",
    stats: [
      { k: "99.99", v: "Uptime %" },
      { k: "8y", v: "Experience" },
      { k: "AWS", v: "Pro · DevOps" },
    ],
    projects: ["Terraform module lib", "CI cache layer", "Otel pipeline"],
    skills: ["Terraform", "Docker", "k8s", "Prom", "Grafana"],
    blueprint: {
      persona: "Quant Developer",
      hero: {
        name: "Sam Patel",
        role: "Senior DevOps Engineer",
        headline: "Infrastructure as code, observability as default.",
        subheadline:
          "I build the platforms other engineers stand on — multi-region Kubernetes, Terraform module libraries, and the OpenTelemetry plumbing that catches things before users do.",
        metrics: [
          { label: "Uptime %", value: 99 },
          { label: "Years", value: 8 },
          { label: "Clusters", value: 14 },
        ],
      },
      about: {
        paragraph:
          "Eight years across DevOps and SRE roles at fintech and infra startups. I treat reliability as a product feature. Most of my work is invisible by design — until one day someone notices the dashboards never went red.",
      },
      experience: [
        { company: "Stripe",          role: "Staff SRE",          duration: "2022 — Present",
          bullets: ["Owned the multi-region failover runbook", "Drove p99 uptime from 99.94% → 99.99% across two services"] },
        { company: "HashiCorp",       role: "Solutions Engineer", duration: "2019 — 2022",
          bullets: ["Built the public Terraform module library (4.5k+ stars)", "Spoke at HashiConf 2021"] },
        { company: "Bridgewater",     role: "Platform Engineer",  duration: "2016 — 2019",
          bullets: ["Containerized the legacy quant pipeline", "Reduced compute spend 38% in 9 months"] },
      ],
      projects: [
        { title: "Terraform Module Lib", description: "Production-grade module library with 40+ providers covered. 4.5k stars.", tags: ["Terraform", "AWS", "GCP"] },
        { title: "CI Cache Layer",       description: "Distributed Bazel cache reducing CI runtimes by 6× across two monorepos.", tags: ["Bazel", "Go", "S3"] },
        { title: "Otel Pipeline",        description: "End-to-end OpenTelemetry collector + storage stack with cardinality controls.", tags: ["OTel", "Prom", "Grafana"] },
      ],
      skills: ["Terraform", "Kubernetes", "Docker", "AWS", "GCP", "Prometheus", "Grafana", "Go", "Bash", "Helm"],
      education: [
        { school: "Georgia Tech", degree: "BS, Computer Engineering", duration: "2012 — 2016",
          achievements: ["Cum Laude", "ACM Programming Team"] },
      ],
      contact: { email: "sam@samp.sh", github: "samp", linkedin: "sam-patel-sre" },
    },
  },
];

function openDemo(p) {
  if (typeof window === "undefined") return;
  // Pass demo via URL query — survives the new tab (sessionStorage doesn't).
  window.open(`/portfolio?demo=${encodeURIComponent(p.slug)}`, "_blank", "noopener,noreferrer");
}

function PreviewCard(p) {
  const { name, role, domain, themeName, accent, accent2, bg, surface, ink, muted, stats, projects, skills } = p;

  const handleOpen = () => openDemo(p);
  const handleKey = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openDemo(p);
    }
  };

  return (
    <div
      onClick={handleOpen}
      onKeyDown={handleKey}
      role="link"
      tabIndex={0}
      aria-label={`Open live demo of ${name} portfolio in ${themeName} theme`}
      className="focus-ring"
      style={{
        background: T.card,
        border: `1px solid ${T.border}`,
        borderRadius: 16,
        padding: 14,
        cursor: "pointer",
        transition: "border-color 200ms ease, transform 200ms ease, box-shadow 200ms ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = T.borderHi;
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = `0 24px 50px -30px rgba(0,0,0,0.6), 0 0 0 1px ${accent}33`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = T.border;
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Browser chrome — also clickable */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "8px 12px", marginBottom: 10,
        background: T.surface, border: `1px solid ${T.border}`,
        borderRadius: 10,
      }}>
        <div style={{ display: "flex", gap: 5 }}>
          <Dot color="#FF5F57" />
          <Dot color="#FEBC2E" />
          <Dot color="#28C840" />
        </div>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "3px 10px",
          background: T.card, border: `1px solid ${T.border}`,
          borderRadius: 6,
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          fontSize: 11, color: T.mutedInk,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: accent }} />
          {domain}
        </span>
        <ExternalLink size={12} style={{ color: T.dim }} />
      </div>

      {/* Mini portfolio canvas */}
      <div style={{
        background: bg,
        border: `1px solid ${T.border}`,
        borderRadius: 12,
        padding: 22,
        position: "relative",
        overflow: "hidden",
        minHeight: 320,
      }}>
        {/* gradient orb */}
        <div style={{
          position: "absolute", top: -40, right: -40, width: 220, height: 160,
          background: `radial-gradient(ellipse, ${accent}55, transparent 70%)`,
          filter: "blur(30px)", pointerEvents: "none",
        }} />

        {/* Hero */}
        <div style={{ position: "relative" }}>
          <div style={{
            fontSize: 10, color: muted, letterSpacing: "0.16em",
            textTransform: "uppercase", marginBottom: 6,
          }}>
            Portfolio · 2026
          </div>
          <div style={{
            fontFamily: T.display, fontSize: 22, fontWeight: 700,
            color: ink, lineHeight: 1.1, margin: "0 0 4px",
            letterSpacing: "-0.02em",
          }}>
            {name}
          </div>
          <div style={{
            fontSize: 12, fontWeight: 500,
            background: `linear-gradient(90deg, ${accent}, ${accent2})`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            marginBottom: 14,
          }}>
            {role}
          </div>

          {/* Stats */}
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
            gap: 6, marginBottom: 14,
          }}>
            {stats.map((s) => (
              <div key={s.v} style={{
                background: surface,
                border: `1px solid ${accent}22`,
                borderRadius: 8, padding: "8px 6px",
                textAlign: "center",
              }}>
                <div style={{
                  fontFamily: T.display, fontSize: 14, fontWeight: 700,
                  color: ink, lineHeight: 1,
                }}>
                  {s.k}
                </div>
                <div style={{ fontSize: 8.5, color: muted, marginTop: 2, letterSpacing: "0.04em" }}>
                  {s.v}
                </div>
              </div>
            ))}
          </div>

          {/* Projects */}
          <div style={{ fontSize: 9.5, color: muted, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 6 }}>
            Selected Work
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 12 }}>
            {projects.map((p, i) => (
              <div key={p} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                background: surface,
                border: `1px solid ${accent}1F`,
                borderRadius: 6, padding: "6px 9px",
                fontSize: 11, color: ink,
              }}>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{
                    width: 4, height: 4, borderRadius: "50%",
                    background: i === 0 ? accent : accent2,
                  }} />
                  {p}
                </span>
                <ChevronRight size={10} style={{ color: muted }} />
              </div>
            ))}
          </div>

          {/* Skills */}
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {skills.map((s) => (
              <span key={s} style={{
                fontSize: 9.5,
                padding: "3px 7px",
                background: `${accent}14`,
                color: ink,
                border: `1px solid ${accent}33`,
                borderRadius: 999,
              }}>
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Meta strip */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "12px 4px 4px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{
            width: 10, height: 10, borderRadius: "50%", background: accent,
            boxShadow: `0 0 0 2px ${T.card}, 0 0 0 3px ${accent}66`,
          }} />
          <span style={{ fontSize: 13, color: T.ink, fontWeight: 500 }}>{themeName}</span>
          <span style={{ fontSize: 12, color: T.dim }}>· {role}</span>
        </div>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 4,
          fontSize: 12, color: T.mutedInk, fontWeight: 500,
        }}>
          View live
          <ArrowRight size={12} />
        </span>
      </div>
    </div>
  );
}

/* =========================================================================
 *  STYLE HELPERS
 * ========================================================================= */

function primaryCta() {
  return {
    display: "inline-flex", alignItems: "center", gap: 8,
    padding: "12px 20px",
    background: T.ink, color: T.bg,
    border: "none", borderRadius: 10,
    fontSize: 14.5, fontWeight: 600, cursor: "pointer",
    transition: "transform 150ms ease, box-shadow 150ms ease, background 150ms ease",
    boxShadow: "0 8px 20px -8px rgba(244,244,245,0.4)",
  };
}

function ghostCta() {
  return {
    display: "inline-flex", alignItems: "center", gap: 8,
    padding: "12px 20px",
    background: "transparent", color: T.ink,
    border: `1px solid ${T.border}`, borderRadius: 10,
    fontSize: 14.5, fontWeight: 600, cursor: "pointer",
    transition: "border-color 150ms ease, background 150ms ease",
  };
}
