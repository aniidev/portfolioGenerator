import { motion } from 'framer-motion';

export default function GlowButton({ children, href, onClick, variant = 'primary', theme, style = {} }) {
  const isPrimary = variant === 'primary';

  const base = {
    display:        'inline-flex',
    alignItems:     'center',
    gap:            '8px',
    padding:        '12px 28px',
    borderRadius:   '9999px',
    fontFamily:     theme.fontBody,
    fontWeight:     600,
    fontSize:       '0.9rem',
    letterSpacing:  '0.02em',
    textDecoration: 'none',
    cursor:         'pointer',
    border:         'none',
    transition:     'box-shadow 0.3s ease, background 0.3s ease',
    ...style,
  };

  const primary = {
    ...base,
    background:  theme.accentGradient,
    color:       '#ffffff',
    boxShadow:   `0 0 28px rgba(${theme.accentRgb}, 0.4)`,
  };

  const outline = {
    ...base,
    background:  'transparent',
    color:       theme.accent,
    border:      `1.5px solid ${theme.accent}`,
    boxShadow:   'none',
  };

  const El = href ? 'a' : 'button';

  return (
    <motion.div
      style={{ display: 'inline-block' }}
      whileHover={{ scale: 1.04, y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
    >
      <El href={href} onClick={onClick} style={isPrimary ? primary : outline}>
        {children}
      </El>
    </motion.div>
  );
}
