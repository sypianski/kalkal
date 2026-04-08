// Scholarly brutalism: rubric red on cream.
// Inspired by medieval manuscript rubrication — red cinnabar ink headings
// against parchment — reframed with hard edges and heavy type.
export const brutalist = {
  name: 'brutalist' as const,
  colors: {
    background: '#f4efe4',      // warm cream (parchment)
    surface: '#e8e1cd',         // deeper cream
    surfaceAlt: '#0a0a0a',      // ink black
    text: '#0a0a0a',
    textSecondary: '#2a2a2a',
    textMuted: '#6b6457',
    accent: '#c8102e',          // rubric red (cinnabar)
    accentGold: '#c8102e',      // legacy alias → unified red
    accentTeal: '#0a0a0a',      // legacy alias → ink black
    accentText: '#ffffff',      // text on red accent
    border: '#0a0a0a',
    error: '#8a0f1a',
    resultBg: '#ffffff',
    buttonBg: '#0a0a0a',
    buttonText: '#f4efe4',      // cream on black
    cardBg: '#ffffff',
    tabBar: '#0a0a0a',
    tabActive: '#e63946',       // brighter rubric red on black
    tabInactive: '#8a8270',
  },
  fonts: {
    regular: undefined, // system mono
    mono: undefined, // system mono
  },
  borderRadius: 0,
  borderWidth: 3,
  shadowOffset: { width: 6, height: 6 },
};
