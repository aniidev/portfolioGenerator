import { useRef } from 'react';
import { useInView } from 'framer-motion';
import CountUp from 'react-countup';

export default function AnimatedCounter({ value, label, theme, suffix = '' }) {
  const ref  = useRef(null);
  const seen = useInView(ref, { once: true, margin: '-40px' });
  const num  = typeof value === 'number' ? value : (parseInt(value) || 0);

  return (
    <div ref={ref} style={{ textAlign: 'center', minWidth: '80px' }}>
      <div style={{
        fontSize:               'clamp(2rem, 4vw, 2.8rem)',
        fontWeight:             800,
        fontFamily:             theme.fontHeading,
        background:             theme.accentGradient,
        WebkitBackgroundClip:  'text',
        WebkitTextFillColor:   'transparent',
        backgroundClip:        'text',
        lineHeight:             1,
      }}>
        {seen ? <CountUp end={num} duration={2.2} separator="," suffix={suffix} /> : '0'}
      </div>
      <div style={{
        fontSize:      '0.68rem',
        fontWeight:    600,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color:         theme.textMuted,
        marginTop:     '6px',
        fontFamily:    theme.fontBody,
      }}>
        {label}
      </div>
    </div>
  );
}
