import { motion } from 'framer-motion';
import GlowButton from './GlowButton';
import AnimatedCounter from './AnimatedCounter';

const EASE = [0.16, 1, 0.3, 1];

// Animates each character of a string individually
function SplitText({ text }) {
  const chars = Array.from(text || '');
  return (
    <>
      {chars.map((c, i) => (
        <motion.span
          key={i}
          custom={i}
          variants={{
            hidden: { opacity: 0, y: 40, rotateX: -40 },
            visible: (i) => ({
              opacity: 1, y: 0, rotateX: 0,
              transition: { duration: 0.55, delay: i * 0.028, ease: EASE },
            }),
          }}
          style={{ display: 'inline-block', whiteSpace: c === ' ' ? 'pre' : 'normal' }}
        >
          {c}
        </motion.span>
      ))}
    </>
  );
}

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.14 } } };
const fadeUp  = {
  hidden:  { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

// Terminal-style hero variant
function TerminalHero({ blueprint, theme }) {
  const { hero, contact } = blueprint;
  return (
    <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '7rem 2.5rem 4rem', position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
        <motion.div variants={stagger} initial="hidden" animate="visible">
          <motion.div variants={fadeUp} style={{ fontFamily: theme.fontBody, color: theme.textMuted, fontSize: '0.9rem', marginBottom: '1rem' }}>
            <span style={{ color: theme.accent }}>~/portfolio</span>{' '}
            <span style={{ color: theme.textMuted }}>$</span>{' '}
            <span style={{ color: theme.textPrimary }}>whoami</span>
          </motion.div>
          <motion.h1
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.025 } } }}
            style={{ fontFamily: theme.fontHeading, fontSize: 'clamp(2.8rem, 7vw, 6rem)', fontWeight: 700, lineHeight: 1.05, marginBottom: '0.5rem', color: theme.textPrimary, perspective: '600px' }}
          >
            <SplitText text={hero?.name || ''} />
            <motion.span variants={{ hidden: { opacity: 1 }, visible: { opacity: 1 } }} style={{ display: 'inline-block', width: '0.06em', height: '0.85em', background: theme.accent, marginLeft: '4px', verticalAlign: 'middle', animation: 'blink 1.1s step-end infinite' }} />
          </motion.h1>
          <motion.div variants={fadeUp} style={{ color: theme.accent, fontFamily: theme.fontBody, fontSize: '0.85rem', marginBottom: '0.4rem' }}>
            // {hero?.role}
          </motion.div>
          <motion.div variants={fadeUp} style={{ color: theme.textMuted, fontFamily: theme.fontBody, fontSize: '1rem', marginBottom: '2.5rem', maxWidth: '640px', lineHeight: 1.75 }}>
            {hero?.subheadline}
          </motion.div>
          {hero?.metrics?.length > 0 && (
            <motion.div variants={fadeUp} style={{ display: 'flex', gap: '1.5rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
              {hero.metrics.map((m, i) => (
                <div key={i} style={{ padding: '1rem 1.5rem', border: `1px solid ${theme.surfaceBorder}`, borderRadius: theme.cardRadius, background: theme.surfaceBg, fontFamily: theme.fontBody }}>
                  <AnimatedCounter value={m.value} label={m.label} theme={theme} />
                </div>
              ))}
            </motion.div>
          )}
          <motion.div variants={fadeUp} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <GlowButton href="#projects" variant="primary" theme={theme}>View Projects</GlowButton>
            <GlowButton href={`mailto:${contact?.email || ''}`} variant="outline" theme={theme}>Contact</GlowButton>
          </motion.div>
        </motion.div>
      </div>
      <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}`}</style>
    </section>
  );
}

// Default centered hero
function CenteredHero({ blueprint, theme }) {
  const { hero, contact } = blueprint;
  return (
    <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '7rem 2rem 4rem', position: 'relative', zIndex: 1 }}>
      <motion.div variants={stagger} initial="hidden" animate="visible" style={{ maxWidth: '900px', width: '100%' }}>
        <motion.div variants={fadeUp} style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: theme.accent, fontFamily: theme.fontBody, marginBottom: '1.5rem' }}>
          {blueprint.persona || 'Developer'} Portfolio
        </motion.div>
        <motion.h1
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.022 } } }}
          style={{ fontFamily: theme.fontHeading, fontSize: 'clamp(3rem, 9vw, 7.5rem)', fontWeight: 800, lineHeight: 1.02, letterSpacing: '-0.03em', marginBottom: '1rem', background: theme.accentGradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', perspective: '600px' }}
        >
          <SplitText text={hero?.name || ''} />
        </motion.h1>
        <motion.div variants={fadeUp} style={{ fontSize: 'clamp(1rem, 2vw, 1.35rem)', color: theme.textMuted, fontFamily: theme.fontBody, fontWeight: 300, marginBottom: '1rem', letterSpacing: '0.06em' }}>
          {hero?.role}
        </motion.div>
        {hero?.headline && (
          <motion.div variants={fadeUp} style={{ fontSize: 'clamp(1.1rem, 2.2vw, 1.6rem)', fontWeight: 600, color: theme.textPrimary, fontFamily: theme.fontHeading, marginBottom: '1rem' }}>
            {hero.headline}
          </motion.div>
        )}
        {hero?.subheadline && (
          <motion.p variants={fadeUp} style={{ fontSize: '1.05rem', color: theme.textMuted, fontFamily: theme.fontBody, fontWeight: 300, lineHeight: 1.85, maxWidth: '640px', margin: '0 auto 2rem' }}>
            {hero.subheadline}
          </motion.p>
        )}
        {hero?.metrics?.length > 0 && (
          <motion.div variants={fadeUp} style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
            {hero.metrics.map((m, i) => (
              <div key={i} style={{ padding: '1.2rem 2rem', borderRadius: theme.cardRadius, background: theme.surfaceBg, border: `1px solid ${theme.surfaceBorder}`, backdropFilter: 'blur(12px)' }}>
                <AnimatedCounter value={m.value} label={m.label} theme={theme} />
              </div>
            ))}
          </motion.div>
        )}
        <motion.div variants={fadeUp} style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <GlowButton href="#projects" variant="primary" theme={theme}>View Projects</GlowButton>
          <GlowButton href={`mailto:${contact?.email || ''}`} variant="outline" theme={theme}>Get In Touch</GlowButton>
        </motion.div>
      </motion.div>
    </section>
  );
}

// Editorial (light theme) hero
function EditorialHero({ blueprint, theme }) {
  const { hero, contact } = blueprint;
  return (
    <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '5rem 3rem 6rem', position: 'relative', zIndex: 1 }}>
      <motion.div variants={stagger} initial="hidden" animate="visible" style={{ maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
        <motion.div variants={fadeUp} style={{ width: '4rem', height: '3px', background: theme.accentGradient, marginBottom: '2rem' }} />
        <motion.h1
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.02 } } }}
          style={{ fontFamily: theme.fontHeading, fontStyle: 'italic', fontSize: 'clamp(3.5rem, 10vw, 8.5rem)', fontWeight: 400, lineHeight: 0.95, letterSpacing: '-0.02em', color: theme.textPrimary, marginBottom: '1.5rem', perspective: '600px' }}
        >
          <SplitText text={hero?.name || ''} />
        </motion.h1>
        <motion.div variants={fadeUp} style={{ fontSize: 'clamp(0.9rem, 1.8vw, 1.1rem)', color: theme.textMuted, fontFamily: theme.fontBody, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem', fontWeight: 400 }}>
          {hero?.role}
        </motion.div>
        {hero?.subheadline && (
          <motion.p variants={fadeUp} style={{ fontSize: '1.05rem', color: theme.textMuted, fontFamily: theme.fontBody, fontWeight: 300, lineHeight: 1.9, maxWidth: '540px', marginBottom: '2rem' }}>
            {hero.subheadline}
          </motion.p>
        )}
        <motion.div variants={fadeUp} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <GlowButton href="#projects" variant="primary" theme={theme}>View Work</GlowButton>
          <GlowButton href={`mailto:${contact?.email || ''}`} variant="outline" theme={theme}>Contact</GlowButton>
        </motion.div>
      </motion.div>
    </section>
  );
}

export default function AnimatedHero({ blueprint, theme }) {
  if (theme.heroStyle === 'terminal') return <TerminalHero blueprint={blueprint} theme={theme} />;
  if (theme.heroStyle === 'editorial') return <EditorialHero blueprint={blueprint} theme={theme} />;
  return <CenteredHero blueprint={blueprint} theme={theme} />;
}
