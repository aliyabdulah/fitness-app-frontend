// Enhanced Theme System for TrainX Fitness App
export const Colors = {
  // Primary TrainX colors
  primary: "#FF4C29",
  secondary: "#2C394B",
  background: "#082032",
  card: "#2C394B",
  
  // Text colors
  textPrimary: "#FFFFFF",
  textSecondary: "#9CA3AF",
  
  // UI colors
  border: "#374151",
  error: "#EF4444",
  success: "#10B981",
  warning: "#F59E0B",
  
  // Additional colors
  white: "#FFFFFF",
  black: "#000000",
  gray100: "#F3F4F6",
  gray200: "#E5E7EB",
  gray300: "#D1D5DB",
  gray400: "#9CA3AF",
  gray500: "#6B7280",
  gray600: "#4B5563",
  gray700: "#374151",
  gray800: "#1F2937",
  gray900: "#111827",
};

// TrainX compatible colors object (exact same structure as original TrainX)
export const colors = {
  primary: '#FF4C29',
  secondary: '#082032',
  accent: '#2C394B',
  light: '#F0F0F0',
  blue: '#3B82F6',
  orange: '#F59E42',
  red: '#EF4444',
  purple: '#A78BFA',
  green: '#22C55E',
  yellow: '#FACC15',
  gray700: '#374151',
  gray400: '#9CA3AF',
  white: '#FFFFFF',
};

// Spacing system
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
  "5xl": 48,
  "6xl": 64,
};

// Border radius system
export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

// Typography system
export const Typography = {
  h1: {
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  small: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
};

// Export default theme object for convenience
export default {
  Colors,
  Spacing,
  BorderRadius,
  Typography,
}; 