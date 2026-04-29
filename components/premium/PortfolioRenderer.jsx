import { useEffect, useRef, useState } from 'react';
import AnimatedHero        from './AnimatedHero';
import RevealSection       from './RevealSection';
import ProjectTiltCard     from './ProjectTiltCard';
import TimelineExperience  from './TimelineExperience';
import FloatingSkillsCloud from './FloatingSkillsCloud';
import ParallaxBackground  from './ParallaxBackground';
import AnimatedCounter     from './AnimatedCounter';

// Shared layout constants
const MAX = '1160px';

function Section({ id, children, theme, style = {} }) {
  return (
    <section
      id={id}
      style={{
        padding:       '7rem 2rem',
        borderTop:     `1px solid ${theme.surfaceBorder}`,
        position:      'relative',
        zIndex:        1,
        ...style,
      }}
    >
      <div style={{ maxWidth: MAX, margin: '0 auto' }}>{children}</div>
    </section>
  );
}

function SectionHeading({ children, theme }) {
  return (
    <h2 style={{
      fontFamily:            theme.fontHeading,
      fontSize:              'clamp(1.7rem, 4vw, 2.8rem)',
      fontWeight:            800,
      background:            theme.accentGradient,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor:  'transparent',
      backgroundClip:       'text',
      marginBottom:          '3rem',
      letterSpacing:         '-0.01em',
    }}>
      {children}
    </h2>
  );
}

function Card({ children, theme, style = {} }) {
  return (
    <div style={{
      background:     theme.surfaceBg,
      border:         `1px solid ${theme.surfaceBorder}`,
      borderRadius:   theme.cardRadius,
      padding:        '2rem',
      backdropFilter: 'blur(14px)',
      ...style,
    }}>
      {children}
    </div>
  );
}

export default function PortfolioRenderer({ blueprint, theme }) {
  const { hero, about, experience, projects, skills, education, contact } = blueprint || {};
  const lenisRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);

  // Lenis smooth scroll
  useEffect(() => {
    let raf;
    (async () => {
      try {
        const { default: Lenis } = await import('lenis');
        const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1.1 });
        lenisRef.current = lenis;
        const tick = (t) => { lenis.raf(t); raf = requestAnimationFrame(tick); };
        raf = requestAnimationFrame(tick);
      } catch (_) {}
    })();
    return () => { if (raf) cancelAnimationFrame(raf); lenisRef.current?.destroy(); };
  }, []);

  // Nav scroll state
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = ['About', 'Experience', 'Projects', 'Skills', 'Education', 'Contact'];

  return (
    <>
      {/* ── global styles ─────────────────────────────────────────── */}
      <style>{`
        @import url('${theme.fontUrl}');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body {
          background: ${theme.pageBg};
          color: ${theme.textPrimary};
          font-family: ${theme.fontBody};
          min-height: 100vh;
          overflow-x: hidden;
        }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${theme.accent}; border-radius: 2px; }
        a { text-decoration: none; color: inherit; }
        @media (max-width: 768px) {
          .pm-nav-links { display: none !important; }
          .pm-grid { grid-template-columns: 1fr !important; }
          .pm-edu-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── parallax background ────────────────────────────────────── */}
      <ParallaxBackground theme={theme} />

      {/* ── navigation ─────────────────────────────────────────────── */}
      <nav style={{
        position:       'fixed',
        top:            0, left: 0, right: 0,
        zIndex:         999,
        display:        'flex',
        justifyContent: 'space-between',
        alignItems:     'center',
        padding:        '0.9rem 2.5rem',
        background:     scrolled ? theme.navBg : 'transparent',
        backdropFilter: scrolled ? 'blur(22px)' : 'none',
        borderBottom:   scrolled ? `1px solid ${theme.surfaceBorder}` : '1px solid transparent',
        transition:     'background 0.35s, backdrop-filter 0.35s, border-color 0.35s',
        fontFamily:     theme.fontBody,
      }}>
        <span style={{
          fontWeight:            700,
          fontSize:              '1.05rem',
          fontFamily:            theme.fontHeading,
          background:            theme.accentGradient,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor:  'transparent',
          backgroundClip:       'text',
        }}>
          {hero?.name?.split(' ')[0] || 'Portfolio'}
        </span>
        <div className="pm-nav-links" style={{ display: 'flex', gap: '2rem' }}>
          {navLinks.map(s => (
            <a
              key={s}
              href={`#${s.toLowerCase()}`}
              style={{ color: theme.textMuted, fontSize: '0.83rem', fontWeight: 500, letterSpacing: '0.04em', transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = theme.accent}
              onMouseLeave={e => e.target.style.color = theme.textMuted}
            >
              {s}
            </a>
          ))}
        </div>
      </nav>

      {/* ── hero ───────────────────────────────────────────────────── */}
      <div style={{ maxWidth: MAX, margin: '0 auto', padding: '0 2rem' }}>
        <AnimatedHero blueprint={blueprint} theme={theme} />
      </div>

      {/* ── about ──────────────────────────────────────────────────── */}
      {about?.paragraph && (
        <Section id="about" theme={theme}>
          <RevealSection>
            <SectionHeading theme={theme}>About</SectionHeading>
          </RevealSection>
          <RevealSection delay={0.1}>
            <Card theme={theme}>
              <p style={{ fontSize: '1.08rem', color: theme.textMuted, fontFamily: theme.fontBody, fontWeight: 300, lineHeight: 1.9 }}>
                {about.paragraph}
              </p>
            </Card>
          </RevealSection>
        </Section>
      )}

      {/* ── experience ─────────────────────────────────────────────── */}
      {experience?.length > 0 && (
        <Section id="experience" theme={theme}>
          <RevealSection>
            <SectionHeading theme={theme}>Experience</SectionHeading>
          </RevealSection>
          <TimelineExperience experience={experience} theme={theme} />
        </Section>
      )}

      {/* ── projects ───────────────────────────────────────────────── */}
      {projects?.length > 0 && (
        <Section id="projects" theme={theme}>
          <RevealSection>
            <SectionHeading theme={theme}>Projects</SectionHeading>
          </RevealSection>
          <div
            className="pm-grid"
            style={{
              display:             'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap:                 '1.5rem',
            }}
          >
            {projects.map((p, i) => (
              <ProjectTiltCard key={i} project={p} theme={theme} index={i} />
            ))}
          </div>
        </Section>
      )}

      {/* ── skills ─────────────────────────────────────────────────── */}
      {skills?.length > 0 && (
        <Section id="skills" theme={theme}>
          <RevealSection>
            <SectionHeading theme={theme}>Skills</SectionHeading>
          </RevealSection>
          <FloatingSkillsCloud skills={skills} theme={theme} />
        </Section>
      )}

      {/* ── education ──────────────────────────────────────────────── */}
      {education?.length > 0 && (
        <Section id="education" theme={theme}>
          <RevealSection>
            <SectionHeading theme={theme}>Education</SectionHeading>
          </RevealSection>
          <div
            className="pm-edu-grid"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}
          >
            {education.map((edu, i) => (
              <RevealSection key={i} delay={i * 0.1}>
                <Card theme={theme} style={{ height: '100%' }}>
                  <div style={{ fontFamily: theme.fontHeading, fontSize: '1.15rem', fontWeight: 700, color: theme.textPrimary, marginBottom: '0.35rem', lineHeight: 1.3 }}>
                    {edu.school}
                  </div>
                  <div style={{ color: theme.accent, fontSize: '0.9rem', fontFamily: theme.fontBody, marginBottom: '0.25rem' }}>
                    {edu.degree}
                  </div>
                  <div style={{ color: theme.textMuted, fontSize: '0.78rem', fontFamily: theme.fontBody, marginBottom: '1rem' }}>
                    {edu.duration}
                  </div>
                  {edu.achievements?.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {edu.achievements.map((a, ai) => (
                        <span key={ai} style={{
                          padding:       '3px 12px',
                          borderRadius:  '9999px',
                          background:    `rgba(${theme.accentRgb}, 0.1)`,
                          border:        `1px solid rgba(${theme.accentRgb}, 0.25)`,
                          fontSize:      '0.73rem',
                          fontWeight:    500,
                          color:         theme.accent,
                          fontFamily:    theme.fontBody,
                        }}>
                          {a}
                        </span>
                      ))}
                    </div>
                  )}
                </Card>
              </RevealSection>
            ))}
          </div>
        </Section>
      )}

      {/* ── contact / footer ───────────────────────────────────────── */}
      <Section id="contact" theme={theme} style={{ textAlign: 'center' }}>
        <RevealSection>
          <SectionHeading theme={theme}>Get In Touch</SectionHeading>
          <p style={{ color: theme.textMuted, fontFamily: theme.fontBody, fontSize: '1.05rem', marginBottom: '2.5rem', maxWidth: '480px', margin: '0 auto 2.5rem', lineHeight: 1.8 }}>
            Open to internships, research collaborations, and interesting problems.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}>
            {contact?.email && (
              <a
                href={`mailto:${contact.email}`}
                style={{
                  display:       'inline-flex',
                  alignItems:    'center',
                  gap:           '8px',
                  padding:       '13px 30px',
                  borderRadius:  '9999px',
                  background:    theme.accentGradient,
                  color:         '#fff',
                  fontFamily:    theme.fontBody,
                  fontWeight:    600,
                  fontSize:      '0.9rem',
                  boxShadow:     `0 0 28px rgba(${theme.accentRgb}, 0.4)`,
                  transition:    'box-shadow 0.3s',
                }}
              >
                ✉ {contact.email}
              </a>
            )}
            {contact?.phone && (
              <a
                href={`tel:${contact.phone}`}
                style={{
                  display:       'inline-flex',
                  alignItems:    'center',
                  gap:           '8px',
                  padding:       '13px 30px',
                  borderRadius:  '9999px',
                  background:    'transparent',
                  color:         theme.accent,
                  border:        `1.5px solid ${theme.accent}`,
                  fontFamily:    theme.fontBody,
                  fontWeight:    600,
                  fontSize:      '0.9rem',
                }}
              >
                {contact.phone}
              </a>
            )}
          </div>
          {(contact?.github || contact?.linkedin) && (
            <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', color: theme.textMuted, fontSize: '0.85rem', fontFamily: theme.fontBody, marginBottom: '3rem' }}>
              {contact.github   && <span>GitHub: {contact.github}</span>}
              {contact.linkedin && <span>LinkedIn: {contact.linkedin}</span>}
            </div>
          )}
          <div style={{ borderTop: `1px solid ${theme.surfaceBorder}`, paddingTop: '2rem', color: theme.textMuted, fontSize: '0.78rem', fontFamily: theme.fontBody }}>
            Built with PortfolioGen AI · {new Date().getFullYear()}
          </div>
        </RevealSection>
      </Section>
    </>
  );
}
