import { Platform } from 'react-native';

// Main brand colors from the Projects page
const primaryColor = '#6366F1';      // Purple - main brand color
const secondaryColor = '#8B5CF6';    // Light purple - secondary brand color
const accentColor = '#10B981';       // Green - success/accent
const warningColor = '#F59E0B';      // Orange - warning/attention
const dangerColor = '#EF4444';       // Red - error/danger
const infoColor = '#3B82F6';         // Blue - information

// Neutral colors from the Projects page
const neutral50 = '#FAFAFA';         // Light background
const neutral100 = '#F5F5F5';        // Card backgrounds
const neutral200 = '#E5E7EB';        // Borders
const neutral300 = '#D1D5DB';        // Light text/icons
const neutral400 = '#9CA3AF';        // Muted text
const neutral500 = '#6B7280';        // Secondary text
const neutral600 = '#4B5563';        // Primary text
const neutral700 = '#374151';        // Dark text
const neutral800 = '#1F2937';        // Headers
const neutral900 = '#111827';        // Very dark text

// Category colors from the Projects page
const categoryColors = {
  all: '#6366F1',       // Primary purple
  olympiad: '#F59E0B',  // Orange
  project: '#10B981',   // Green
  hackathon: '#8B5CF6', // Purple
  conference: '#EC4899', // Pink
  competition: '#3B82F6', // Blue
};

// Difficulty colors
const difficultyColors = {
  easy: '#10B981',      // Green
  medium: '#F59E0B',    // Orange
  hard: '#EF4444',      // Red
};

// Project specific colors
const projectColors = {
  cardGradient1: '#8B5CF620',  // Light purple gradient
  cardGradient2: '#EC489910',  // Light pink gradient
  teamCard: '#8B5CF6',         // Team section background
  shadow: '#000000',           // Shadow color
};

const tintColorLight = primaryColor;
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: neutral50,
    tint: tintColorLight,
    icon: neutral500,
    tabIconDefault: neutral400,
    tabIconSelected: tintColorLight,
    primary: primaryColor,
    secondary: secondaryColor,
    accent: accentColor,
    warning: warningColor,
    danger: dangerColor,
    info: infoColor,
    neutral: {
      50: neutral50,
      100: neutral100,
      200: neutral200,
      300: neutral300,
      400: neutral400,
      500: neutral500,
      600: neutral600,
      700: neutral700,
      800: neutral800,
      900: neutral900,
    },
    categories: categoryColors,
    difficulty: difficultyColors,
    project: projectColors,
    cardBackground: '#FFFFFF',
    cardBorder: neutral200,
    shadow: neutral200,
    success: '#10B981',
    error: '#EF4444',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    primary: primaryColor,
    secondary: secondaryColor,
    accent: accentColor,
    warning: warningColor,
    danger: dangerColor,
    info: infoColor,
    neutral: {
      50: '#1F2937',
      100: '#374151',
      200: '#4B5563',
      300: '#6B7280',
      400: '#9CA3AF',
      500: '#D1D5DB',
      600: '#E5E7EB',
      700: '#F3F4F6',
      800: '#FAFAFA',
      900: '#FFFFFF',
    },
    categories: categoryColors,
    difficulty: difficultyColors,
    project: projectColors,
    cardBackground: '#1F2937',
    cardBorder: '#374151',
    shadow: '#000000',
    success: '#10B981',
    error: '#EF4444',
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

// Border radius constants
export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
};

// Shadow constants
export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 12,
  },
};

// Typography scale
export const Typography = {
  headline: {
    fontSize: 28,
    fontWeight: '800' as const,
    lineHeight: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: '700' as const,
    lineHeight: 24,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 20,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 22,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 18,
  },
  small: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
};