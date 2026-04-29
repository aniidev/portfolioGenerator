import { motion } from 'framer-motion';

// Gentle floating animation — each badge gets its own random phase
function floatVariant(i) {
  const dur   = 2.8 + (i % 5) * 0.4;
  const delay = (i * 0.18) % 2;
  return {
    animate: {
      y: [0, -7, 0],
      transition: { duration: dur, repeat: Infinity, ease: 'easeInOut', delay },
    },
  };
}

export default function FloatingSkillsCloud({ skills, theme }) {
  if (!skills?.length) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {skills.map((group, gi) => (
        <div key={gi}>
          {/* Category label */}
          <div style={{
            fontSize:      '0.7rem',
            fontWeight:    700,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color:         theme.accent,
            fontFamily:    theme.fontBody,
            marginBottom:  '1rem',
          }}>
            {group.category}
          </div>

          {/* Skill pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {(group.items || []).map((skill, si) => {
              const idx = gi * 8 + si;
              return (
                <motion.div
                  key={si}
                  variants={floatVariant(idx)}
                  animate="animate"
                  whileHover={{ scale: 1.1, y: -5 }}
                  style={{
                    padding:        '6px 18px',
                    borderRadius:   '9999px',
                    background:     `rgba(${theme.accentRgb}, 0.08)`,
                    border:         `1px solid rgba(${theme.accentRgb}, 0.22)`,
                    fontSize:       '0.85rem',
                    fontWeight:     500,
                    color:          theme.textPrimary,
                    fontFamily:     theme.fontBody,
                    cursor:         'default',
                    backdropFilter: 'blur(8px)',
                    userSelect:     'none',
                    transition:     'background 0.2s, border-color 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background     = `rgba(${theme.accentRgb}, 0.18)`;
                    e.currentTarget.style.borderColor    = `rgba(${theme.accentRgb}, 0.5)`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background     = `rgba(${theme.accentRgb}, 0.08)`;
                    e.currentTarget.style.borderColor    = `rgba(${theme.accentRgb}, 0.22)`;
                  }}
                >
                  {skill}
                </motion.div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
