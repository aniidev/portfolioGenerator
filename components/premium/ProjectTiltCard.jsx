import Tilt from 'react-parallax-tilt';
import { motion } from 'framer-motion';

export default function ProjectTiltCard({ project, theme, index }) {
  const featured = project.featured && index === 0;

  return (
    <Tilt
      tiltMaxAngleX={7}
      tiltMaxAngleY={7}
      glareEnable
      glareMaxOpacity={0.06}
      glareColor={theme.accent}
      scale={1.015}
      transitionSpeed={450}
      style={{ borderRadius: theme.cardRadius, height: '100%' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.65, delay: index * 0.09, ease: [0.16, 1, 0.3, 1] }}
        style={{
          background:     theme.surfaceBg,
          border:         `1px solid ${theme.surfaceBorder}`,
          borderRadius:   theme.cardRadius,
          padding:        featured ? '2.5rem' : '2rem',
          height:         '100%',
          display:        'flex',
          flexDirection:  'column',
          position:       'relative',
          overflow:       'hidden',
          backdropFilter: 'blur(14px)',
          transition:     'border-color 0.3s, box-shadow 0.3s',
          cursor:         'default',
        }}
        whileHover={{
          borderColor: `rgba(${theme.accentRgb}, 0.45)`,
          boxShadow:   `0 24px 64px rgba(${theme.accentRgb}, 0.15), 0 0 0 1px rgba(${theme.accentRgb}, 0.1)`,
        }}
      >
        {/* gradient top bar */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: theme.accentGradient, opacity: 0.75 }} />

        {featured && (
          <div style={{
            display:       'inline-flex',
            padding:       '3px 12px',
            borderRadius:  '9999px',
            background:    `rgba(${theme.accentRgb}, 0.12)`,
            border:        `1px solid rgba(${theme.accentRgb}, 0.28)`,
            fontSize:      '0.65rem',
            fontWeight:    700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color:         theme.accent,
            marginBottom:  '1rem',
            fontFamily:    theme.fontBody,
            width:         'fit-content',
          }}>
            ★ Featured
          </div>
        )}

        <h3 style={{
          fontSize:    featured ? '1.35rem' : '1.1rem',
          fontWeight:  700,
          color:       theme.textPrimary,
          fontFamily:  theme.fontHeading,
          marginBottom:'0.75rem',
          lineHeight:  1.3,
        }}>
          {project.name}
        </h3>

        <p style={{
          fontSize:   '0.9rem',
          color:      theme.textMuted,
          fontFamily: theme.fontBody,
          lineHeight: 1.75,
          flex:       1,
          marginBottom: '1.5rem',
        }}>
          {project.description}
        </p>

        {project.tech?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {project.tech.map((t, i) => (
              <motion.span
                key={i}
                whileHover={{ scale: 1.06 }}
                style={{
                  padding:       '3px 11px',
                  borderRadius:  '6px',
                  background:    `rgba(${theme.accentRgb}, 0.1)`,
                  border:        `1px solid rgba(${theme.accentRgb}, 0.22)`,
                  fontSize:      '0.7rem',
                  fontWeight:    500,
                  color:         theme.accent,
                  fontFamily:    theme.fontBody,
                  letterSpacing: '0.02em',
                  cursor:        'default',
                }}
              >
                {t}
              </motion.span>
            ))}
          </div>
        )}
      </motion.div>
    </Tilt>
  );
}
