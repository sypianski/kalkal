// Manuscript: warm parchment, iron-gall ink, muted teal rubric.
// Refined scholarly palette — no yellow.
export const manuscript = {
  name: 'manuscript' as const,
  colors: {
    background: '#f7f1e1',      // warm parchment
    surface: '#efe6cc',
    surfaceAlt: '#e4d7b5',
    text: '#1a1612',
    textSecondary: '#5c4f3d',
    textMuted: '#8a7e6a',
    accent: '#7a2e1e',          // deep iron-gall red
    accentGold: '#a15c2c',      // warm umber (replaces yellow-leaning goldenrod)
    accentTeal: '#2f6b60',      // muted teal
    accentText: '#faf6ee',      // text on accent
    border: '#d4c9b0',
    error: '#a94442',
    resultBg: '#fbf6e8',
    buttonBg: '#7a2e1e',
    buttonText: '#faf6ee',
    cardBg: '#fffdf6',
    tabBar: '#efe6cc',
    tabActive: '#7a2e1e',
    tabInactive: '#8a7e6a',
  },
  fonts: {
    regular: undefined, // system serif
    mono: undefined, // system mono
  },
  borderRadius: 8,
  borderWidth: 1,
  shadowOffset: { width: 0, height: 2 },
};
