// Central design tokens for the app. Keeping a single palette makes the UI
// feel consistent across all screens.

export const colors = {
  primary: '#2E7D32', // deep agricultural green
  primaryDark: '#1B5E20',
  primaryLight: '#66BB6A',
  secondary: '#8D6E63', // soil brown
  secondaryLight: '#D7CCC8',
  accent: '#F9A825', // warm harvest yellow
  background: '#F4F8F1',
  surface: '#FFFFFF',
  surfaceAlt: '#EEF3EA',
  border: '#DDE6D8',
  text: '#1F2A1D',
  textSecondary: '#5B6B57',
  textMuted: '#8A968A',
  danger: '#C62828',
  warning: '#EF6C00',
  success: '#2E7D32',
  info: '#0277BD',
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(0,0,0,0.45)',
};

// A ranked palette used for the 7 crop result bars so each crop keeps a
// stable, distinguishable color no matter the sort order.
export const cropPalette = {
  "Bug'doy": '#C9A227',
  Kartoshka: '#8D6E63',
  Loviya: '#6D4C41',
  "Makkajo'xori": '#F9A825',
  Paxta: '#ECEFF1',
  Qalampir: '#D84315',
  Sabzi: '#EF6C00',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radius = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  pill: 999,
};

export const typography = {
  h1: { fontSize: 26, fontWeight: '800' },
  h2: { fontSize: 21, fontWeight: '700' },
  h3: { fontSize: 17, fontWeight: '700' },
  body: { fontSize: 15, fontWeight: '400' },
  bodyBold: { fontSize: 15, fontWeight: '600' },
  small: { fontSize: 13, fontWeight: '400' },
  tiny: { fontSize: 11, fontWeight: '500' },
};

export default colors;
