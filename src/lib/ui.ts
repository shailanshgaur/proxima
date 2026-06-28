// Cinema Dark design system — Modern Dark (Cinema Mobile) adapted for web
// Accent: ochre brand color (not purple), everything else follows the dark cinematic spec
export const t = {
  // Page & surface
  bgDeep:    '#020203',
  bg:        '#050506',
  elevated:  '#0d0d0f',
  surface:   'rgba(255,255,255,0.04)',
  surfaceHover: 'rgba(255,255,255,0.07)',

  // Borders — hairline, near-invisible
  border:    'rgba(255,255,255,0.08)',
  borderHover: 'rgba(255,255,255,0.16)',

  // Text
  ink:       '#EDEDEF',
  muted:     '#8A8F98',
  subtle:    '#4A4D56',

  // Brand accent — ochre, brightened for dark bg contrast (7:1 ratio)
  ochre:     '#e07b39',
  ochreDark: '#c96f2f',
  ochreGlow: 'rgba(224,123,57,0.20)',
  ochreDim:  'rgba(224,123,57,0.10)',
  ochreBorder: 'rgba(224,123,57,0.25)',

  // Semantic
  successText:   '#4ade80',
  successBg:     'rgba(74,222,128,0.08)',
  successBorder: 'rgba(74,222,128,0.18)',

  errText:    '#f87171',
  errBg:      'rgba(248,113,113,0.08)',
  errBorder:  'rgba(248,113,113,0.18)',

  // Shape — 16px cards per cinema dark spec
  radius:    '8px',
  radiusLg:  '14px',
  radiusFull:'9999px',

  // Type
  font:     "Inter, -apple-system, system-ui, sans-serif",
  fontMono: "ui-monospace, 'SF Mono', monospace",

  // Motion — expo-out curve from cinema dark spec
  ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
} as const;
