// ─── Oxy46 Workshop Video — Design System ───────────────────────────────────

export const COLORS = {
  // Backgrounds
  bg:        '#0B0F14',
  bgAlt:     '#0D1117',
  surface:   '#141A22',
  surfaceHi: '#1C2535',

  // Typography
  textPrimary: '#F0EDE8',
  textSecond:  '#A8B2C1',
  textMuted:   '#4B5563',

  // Accent — electric blue, very controlled
  accent:     '#3B82F6',
  accentGlow: 'rgba(59,130,246,0.15)',
  accentCyan: '#22D3EE',
  accentFaint:'rgba(59,130,246,0.07)',

  // Negative / decline
  negative:    '#EF4444',
  negativeDim: 'rgba(239,68,68,0.25)',
  negativeGlow:'rgba(239,68,68,0.08)',

  // Positive / aspiration
  positive:    '#10B981',
  positiveDim: 'rgba(16,185,129,0.20)',

  // Lines / structure
  lineSubtle:  'rgba(255,255,255,0.05)',
  lineMid:     'rgba(255,255,255,0.10)',
  lineAccent:  'rgba(59,130,246,0.22)',

  // Stage colors
  stageAugmented:    '#3B82F6',
  stageAgentic:      '#06B6D4',
  stageOrchestrated: '#818CF8',
} as const;

export const FONTS = {
  // System-safe stack — closest to Inter/Helvetica Neue without web fonts
  sans: '"Inter","Helvetica Neue",Helvetica,Arial,sans-serif',
  mono: '"IBM Plex Mono","Courier New",monospace',
} as const;

// ─── Scene timing (frames @ 30 fps) ─────────────────────────────────────────
export const FPS = 30;

export const SCENES = {
  intro:     { start: 0,    duration: 360  }, // 12 s
  valueLoss: { start: 360,  duration: 450  }, // 15 s
  shift:     { start: 810,  duration: 540  }, // 18 s
  maturity:  { start: 1350, duration: 660  }, // 22 s
  newCo:     { start: 2010, duration: 450  }, // 15 s
  closing:   { start: 2460, duration: 390  }, // 13 s
  total:     2850,                             // 95 s
} as const;
