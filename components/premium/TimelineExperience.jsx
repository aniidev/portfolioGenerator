import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

function TimelineItem({ exp, theme, index }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-70px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -28 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      style={{ display: 'flex', gap: '1.75rem', paddingBottom: '3rem', position: 'relative' }}
    >
      {/* Dot */}
      <div style={{ position: 'relative', flexShrink: 0, width: '14px', paddingTop: '4px' }}>
        <motion.div
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{ duration: 0.4, delay: index * 0.12 + 0.25, type: 'spring', stiffness: 200 }}
          style={{
            width:     '14px',
            height:    '14px',
            borderRadius: '50%',
            background:   theme.accentGradient,
            boxShadow:    `0 0 14px rgba(${theme.accentRgb}, 0.55)`,
          }}
        />
      </div>

      {/* Card */}
      <div style={{
        background:     theme.surfaceBg,
        border:         `1px solid ${theme.surfaceBorder}`,
        borderRadius:   theme.cardRadius,
        padding:        '1.75rem',
        flex:           1,
        backdropFilter: 'blur(12px)',
        transition:     'border-color 0.25s',
      }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: theme.accent, fontFamily: theme.fontBody, marginBottom: '0.25rem' }}>
          {exp.company}
        </div>
        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: theme.textPrimary, fontFamily: theme.fontHeading, marginBottom: '0.2rem', lineHeight: 1.3 }}>
          {exp.role}
        </div>
        <div style={{ fontSize: '0.78rem', color: theme.textMuted, fontFamily: theme.fontBody, marginBottom: '0.85rem' }}>
          {exp.duration}
        </div>
        {exp.description && (
          <p style={{ fontSize: '0.92rem', color: theme.textMuted, fontFamily: theme.fontBody, lineHeight: 1.75 }}>
            {exp.description}
          </p>
        )}
        {exp.highlights?.length > 0 && (
          <ul style={{ marginTop: '0.85rem', paddingLeft: '1.1rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            {exp.highlights.map((h, i) => (
              <li key={i} style={{ fontSize: '0.88rem', color: theme.textMuted, fontFamily: theme.fontBody, lineHeight: 1.65 }}>
                {h}
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
}

export default function TimelineExperience({ experience, theme }) {
  if (!experience?.length) return null;

  return (
    <div style={{ position: 'relative', paddingLeft: '0.5rem' }}>
      {/* Animated vertical line */}
      <motion.div
        initial={{ scaleY: 0, transformOrigin: 'top' }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'absolute',
          left:     '6px',
          top:      '18px',
          bottom:   '60px',
          width:    '2px',
          background: `linear-gradient(to bottom, ${theme.accent}, transparent)`,
          opacity:  0.35,
        }}
      />
      {experience.map((exp, i) => (
        <TimelineItem key={i} exp={exp} theme={theme} index={i} />
      ))}
    </div>
  );
}
