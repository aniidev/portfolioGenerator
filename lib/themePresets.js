/**
 * Premium portfolio theme presets.
 * Each preset is a complete design token set — no Tailwind class names,
 * only raw values so components work as pure inline-styled React.
 */

export const THEME_PRESETS = {

  futuristic_ai: {
    id: 'futuristic_ai',
    label: 'Futuristic AI',
    dark: true,
    // Palette
    accent:          '#a855f7',
    accentRgb:       '168,85,247',
    accentSecondary: '#06b6d4',
    accentGradient:  'linear-gradient(135deg, #a855f7 0%, #06b6d4 100%)',
    // Backgrounds
    pageBg:       '#04010d',
    surfaceBg:    'rgba(168,85,247,0.05)',
    surfaceBorder:'rgba(168,85,247,0.18)',
    navBg:        'rgba(4,1,13,0.82)',
    // Orbs
    orb1: 'rgba(168,85,247,0.18)',
    orb2: 'rgba(6,182,212,0.10)',
    // Text
    textPrimary: '#f8f8ff',
    textMuted:   'rgba(248,248,255,0.52)',
    // Shape
    cardRadius: '20px',
    // Typography
    fontUrl:     'https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap',
    fontHeading: "'Syne', sans-serif",
    fontBody:    "'Plus Jakarta Sans', sans-serif",
    // Motion
    animIntensity: 1.2,
    heroStyle:     'centered',
  },

  sleek_engineer: {
    id: 'sleek_engineer',
    label: 'Sleek Engineer',
    dark: true,
    accent:          '#60a5fa',
    accentRgb:       '96,165,250',
    accentSecondary: '#34d399',
    accentGradient:  'linear-gradient(135deg, #60a5fa 0%, #34d399 100%)',
    pageBg:       '#09090b',
    surfaceBg:    'rgba(255,255,255,0.04)',
    surfaceBorder:'rgba(255,255,255,0.09)',
    navBg:        'rgba(9,9,11,0.85)',
    orb1: 'rgba(96,165,250,0.12)',
    orb2: 'rgba(52,211,153,0.08)',
    textPrimary: '#ffffff',
    textMuted:   'rgba(255,255,255,0.50)',
    cardRadius: '16px',
    fontUrl:     'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
    fontHeading: "'Inter', sans-serif",
    fontBody:    "'Inter', sans-serif",
    animIntensity: 0.9,
    heroStyle:     'centered',
  },

  quant_terminal: {
    id: 'quant_terminal',
    label: 'Quant Terminal',
    dark: true,
    accent:          '#00ff88',
    accentRgb:       '0,255,136',
    accentSecondary: '#00b4d8',
    accentGradient:  'linear-gradient(135deg, #00ff88 0%, #00b4d8 100%)',
    pageBg:       '#0d1117',
    surfaceBg:    'rgba(0,255,136,0.04)',
    surfaceBorder:'rgba(0,255,136,0.12)',
    navBg:        'rgba(13,17,23,0.95)',
    orb1: 'rgba(0,255,136,0.07)',
    orb2: 'rgba(0,180,216,0.05)',
    textPrimary: '#e6edf3',
    textMuted:   '#8b949e',
    cardRadius: '8px',
    fontUrl:     'https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,300;0,400;0,500;0,700;1,300&display=swap',
    fontHeading: "'JetBrains Mono', monospace",
    fontBody:    "'JetBrains Mono', monospace",
    animIntensity: 0.7,
    heroStyle:     'terminal',
  },

  modern_minimalist: {
    id: 'modern_minimalist',
    label: 'Modern Minimalist',
    dark: false,
    accent:          '#6366f1',
    accentRgb:       '99,102,241',
    accentSecondary: '#f43f5e',
    accentGradient:  'linear-gradient(135deg, #6366f1 0%, #f43f5e 100%)',
    pageBg:       '#fafaf9',
    surfaceBg:    '#ffffff',
    surfaceBorder:'#e5e7eb',
    navBg:        'rgba(250,250,249,0.9)',
    orb1: 'rgba(99,102,241,0.07)',
    orb2: 'rgba(244,63,94,0.05)',
    textPrimary: '#111827',
    textMuted:   '#6b7280',
    cardRadius: '12px',
    fontUrl:     'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600&display=swap',
    fontHeading: "'Instrument Serif', serif",
    fontBody:    "'Inter', sans-serif",
    animIntensity: 0.8,
    heroStyle:     'editorial',
  },
};

/** Resume persona → theme mapping */
export const PERSONA_THEME_MAP = {
  'AI Engineer':        'futuristic_ai',
  'Software Engineer':  'sleek_engineer',
  'Quant Developer':    'quant_terminal',
  'Startup Builder':    'sleek_engineer',
  'Student Researcher': 'modern_minimalist',
};

export function getThemeForPersona(persona) {
  const id = PERSONA_THEME_MAP[persona] || 'sleek_engineer';
  return THEME_PRESETS[id] || THEME_PRESETS.sleek_engineer;
}
